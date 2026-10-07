/**
 * Decodes an SD-JWT (issuer-signed JWT, disclosures and optional key-binding JWT) entirely in the browser.
 * It reconstructs the disclosed claims; it does not verify any signature.
 */

export interface Disclosure {
  raw: string;
  digest: string;
  salt: string;
  /** Absent for array element disclosures. */
  name?: string;
  value: unknown;
  /** Where the disclosure was found in the payload, if anywhere. */
  path?: string;
}

export interface DecodedJwt {
  header: unknown;
  payload: unknown;
  signature: string;
}

export interface DecodedSdJwt {
  jwt: DecodedJwt;
  disclosures: Disclosure[];
  keyBinding?: DecodedJwt;
  claims: unknown;
  hiddenCount: number;
  warnings: string[];
}

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

function base64UrlDecode(s: string): string {
  if (!/^[A-Za-z0-9_-]*$/.test(s)) throw new Error('Found characters that are not base64url.');
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseJson(s: string, what: string): Json {
  try {
    return JSON.parse(s);
  } catch {
    throw new Error(`The ${what} is not valid JSON.`);
  }
}

function decodeJwt(token: string, what: string): DecodedJwt {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error(`The ${what} must have three dot-separated parts.`);
  return {
    header: parseJson(base64UrlDecode(parts[0]), `${what} header`),
    payload: parseJson(base64UrlDecode(parts[1]), `${what} payload`),
    signature: parts[2],
  };
}

async function sha256(s: string): Promise<string> {
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
  let bin = '';
  hash.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const isObject = (v: unknown): v is Record<string, Json> => typeof v === 'object' && v !== null && !Array.isArray(v);

export async function decodeSdJwt(input: string): Promise<DecodedSdJwt> {
  const compact = input.replace(/\s+/g, '');
  if (!compact) throw new Error('Paste an SD-JWT to decode it.');

  const parts = compact.split('~');
  const jwt = decodeJwt(parts[0], 'issuer-signed JWT');
  const last = parts.length > 1 ? parts[parts.length - 1] : '';
  const keyBinding = last ? decodeJwt(last, 'key-binding JWT') : undefined;
  const rawDisclosures = parts.slice(1, -1).filter(Boolean);

  const warnings: string[] = [];
  const payload = jwt.payload;
  const alg = isObject(payload) && typeof payload._sd_alg === 'string' ? payload._sd_alg : 'sha-256';
  if (alg !== 'sha-256') warnings.push(`Digest algorithm ${alg} is not supported here, so disclosures cannot be matched.`);

  const disclosures: Disclosure[] = [];
  for (const raw of rawDisclosures) {
    const arr = parseJson(base64UrlDecode(raw), 'disclosure');
    if (!Array.isArray(arr) || (arr.length !== 2 && arr.length !== 3) || typeof arr[0] !== 'string') {
      warnings.push('A disclosure is not a [salt, name, value] or [salt, value] array and was skipped.');
      continue;
    }
    const d: Disclosure = { raw, digest: await sha256(raw), salt: arr[0], value: arr[arr.length - 1] };
    if (arr.length === 3) d.name = String(arr[1]);
    disclosures.push(d);
  }

  const byDigest = new Map(disclosures.map((d) => [d.digest, d]));
  let hiddenCount = 0;

  const expand = (node: Json, path: string): Json => {
    if (Array.isArray(node)) {
      const out: Json[] = [];
      node.forEach((item, i) => {
        if (isObject(item) && Object.keys(item).length === 1 && typeof item['...'] === 'string') {
          const d = alg === 'sha-256' ? byDigest.get(item['...']) : undefined;
          if (d && d.name === undefined) {
            d.path = `${path}[${i}]`;
            out.push(expand(d.value as Json, d.path));
          } else {
            hiddenCount++;
          }
        } else {
          out.push(expand(item, `${path}[${i}]`));
        }
      });
      return out;
    }
    if (isObject(node)) {
      const out: Record<string, Json> = {};
      for (const [key, value] of Object.entries(node)) {
        if (key === '_sd_alg') continue;
        if (key === '_sd' && Array.isArray(value)) {
          for (const digest of value) {
            const d = typeof digest === 'string' && alg === 'sha-256' ? byDigest.get(digest) : undefined;
            if (d && d.name !== undefined) {
              d.path = path ? `${path}.${d.name}` : d.name;
              out[d.name] = expand(d.value as Json, d.path);
            } else {
              hiddenCount++;
            }
          }
          continue;
        }
        out[key] = expand(value, path ? `${path}.${key}` : key);
      }
      return out;
    }
    return node;
  };

  const claims = expand(payload as Json, '');
  const unmatched = disclosures.filter((d) => !d.path).length;
  if (unmatched && alg === 'sha-256') {
    warnings.push(`${unmatched} disclosure${unmatched > 1 ? 's do' : ' does'} not match any digest in the payload.`);
  }

  return { jwt, disclosures, keyBinding, claims, hiddenCount, warnings };
}

/** A consistent, unsigned example: two of five claims disclosed. The signature is random bytes. */
export const exampleSdJwt =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6ImRjK3NkLWp3dCJ9.eyJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlIiwiaWF0IjoxNzkxMzMxMjAwLCJ2Y3QiOiJodHRwczovL2NyZWRlbnRpYWxzLmV4YW1wbGUvZW1wbG95ZWUiLCJfc2QiOlsiNEZkNXdyYjY3cy1xR0JQT3FiNVg5NENSTkJjeVB3Z3FJWndIQUZDN3RHdyIsIlRzeThkT1kzQzlRVFVQNXRkeDRjZW94NHc4SXU4eF9Jd25VQnZjelFWdjQiLCJ5bWZ5UThkNkNDWlhqRlUyaFBrT1FRVDFqY3Z1OXhlVU9FQ2szbHRQazk0Il0sImFkZHJlc3MiOnsiX3NkIjpbIlYxbzJKWlBUVDd6ckdza0NsNW9XNGpSaGZNdmc3TEdXOXRuY292bGdvNUkiLCJ2emU3WWRadFFmVGl4RVo3eHNtTmRLX3JHNkxfZWlyQ0ZGZ3o5dHAyQ3RBIl19LCJfc2RfYWxnIjoic2hhLTI1NiJ9.Y-hL4Eap63DgcvzjMygZ9ovcy8uokWjVWuXTPpwO1Tsa0gzmyLHXb7nimSqtLxD1vQMIEUgkqdSQi2UxA4fOMA~WyIyR0xDNDJzS1F2ZUNmR2ZyeU5STjl3Iiwib3JnIiwiRXhhbXBsZSBDb3JwIl0~WyJRZ19PNjR6cUF4ZTQxMmExMDhpcm9BIiwiY291bnRyeSIsIkxLIl0~';
