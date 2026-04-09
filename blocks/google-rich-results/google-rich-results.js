/**
 * Google Rich Results block.
 *
 * This block renders a single `<script type="application/ld+json">` into the block,
 * containing JSON-LD built from a 2-column table authored in the block.
 *
 * Authoring (each row is key/value):
 * - Column 1: JSON key (supports dot-paths for nesting, e.g. `address.streetAddress`)
 * - Column 2: JSON value
 *
 * Defaults (always present unless overwritten by authored keys):
 * - `@context`: `https://schema.org`
 * - `@type`: `Person`
 *
 * Value coercion:
 * - `true` / `false` → boolean
 * - `null` → null
 * - numbers (e.g. `42`, `3.14`) → number
 * - JSON object/array pasted as text (starting with `{` or `[`) → parsed JSON
 * - otherwise → string
 *
 * If a key is authored multiple times, values are accumulated into an array.
 *
 * @param {Element} block The block element
 */
function coerceValue(raw) {
  const value = raw.trim();
  if (!value) return '';

  // Allow authors to paste JSON for objects/arrays.
  const first = value[0];
  if (first === '{' || first === '[') {
    try {
      return JSON.parse(value);
    } catch (e) {
      // fall through to treat as plain string
    }
  }

  if (/^(true|false)$/i.test(value)) return value.toLowerCase() === 'true';
  if (/^null$/i.test(value)) return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);

  return value;
}

function setDeep(target, path, value) {
  const parts = path.split('.').map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return;

  let obj = target;
  for (let i = 0; i < parts.length; i += 1) {
    const key = parts[i];
    const isLast = i === parts.length - 1;

    if (isLast) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const existing = obj[key];
        obj[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      } else {
        obj[key] = value;
      }
      return;
    }

    const next = obj[key];
    if (!next || typeof next !== 'object' || Array.isArray(next)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
}

export default function decorate(block) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
  };

  [...block.children].forEach((row) => {
    const cols = row ? [...row.children] : [];
    const key = cols[0]?.textContent?.trim();
    const valueText = cols[1]?.textContent ?? '';
    if (!key) return;

    const value = coerceValue(valueText);
    setDeep(data, key, value);
  });

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data, null, 2);

  block.replaceChildren(script);
}
