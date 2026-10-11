// Helpers for the request body changes between Pipedrive v1 and v2.
//
// v1 accepted custom fields at the root of the body (keyed by their hash) and
// coerced string values. v2 nests them under `custom_fields` and validates each
// value against the field's type, while workflow steps pass every value as a
// string. These helpers convert values using the field definitions from the
// v2 Fields APIs (`field_code`, `field_name`, `field_type`, `options`).

const NUMERIC_TYPES = [
  "double",
  "int",
  // Linked records: the value is the record's numeric id
  "org",
  "people",
  "user",
];

function toNumber(field, value) {
  const number = Number(value);
  if (Number.isNaN(number)) {
    throw new Error(`"${value}" is not a number, which ${field.field_name} requires`);
  }
  return number;
}

function toOptionId(field, value) {
  const text = String(value).trim();
  if (/^\d+$/.test(text)) {
    return Number(text);
  }
  const option = (field.options || [])
    .find(({ label }) => String(label).toLowerCase() === text.toLowerCase());
  if (!option) {
    throw new Error(`"${value}" is not an option of ${field.field_name}`);
  }
  return option.id;
}

function toFieldValue(field, value) {
  if (value === undefined) {
    return undefined;
  }
  // An empty value clears the field, as it did in v1
  if (value === null || value === "") {
    return null;
  }
  if (!field) {
    return value;
  }
  if (NUMERIC_TYPES.includes(field.field_type)) {
    return toNumber(field, value);
  }
  if (field.field_type === "enum") {
    return toOptionId(field, value);
  }
  if (field.field_type === "set") {
    const values = Array.isArray(value)
      ? value
      : String(value).split(",");
    return values.map((v) => toOptionId(field, v));
  }
  if (field.field_type === "address" && typeof value !== "object") {
    return {
      value: String(value),
    };
  }
  return value;
}

export default {
  // { [fieldCode]: value } -> v2 `custom_fields` object, values converted by type.
  // Undefined values and missing keys are left out.
  customFields(fieldDefinitions, values = {}) {
    const byCode = Object.fromEntries(
      fieldDefinitions.map((field) => [
        field.field_code,
        field,
      ]),
    );
    const customFields = {};
    for (const [
      code,
      value,
    ] of Object.entries(values)) {
      if (!code || code === "undefined") {
        continue;
      }
      const converted = toFieldValue(byCode[code], value);
      if (converted !== undefined) {
        customFields[code] = converted;
      }
    }
    return customFields;
  },
  // Label name (as sent by workflows, e.g. the x-environment header) -> v2 `label_ids`.
  // Returns undefined when the label isn't an option, matching v1 (label left unset).
  // `exact` keeps v1's case-sensitive match, which add-organization used
  // (persons and deals matched case-insensitively).
  labelIds(fieldDefinitions, label, { exact = false } = {}) {
    if (!label) {
      return undefined;
    }
    const labelField = fieldDefinitions
      .find(({ field_code: code }) => code === "label_ids" || code === "label");
    const option = labelField?.options
      ?.find((o) => (exact
        ? o.label === label
        : String(o.label).toLowerCase() === String(label).toLowerCase()));
    return option
      ? [
        option.id,
      ]
      : undefined;
  },
  // v1 `email` / `phone` (a string, an array of strings, or objects like a
  // GET person response) -> v2 `emails` / `phones` arrays of { value, primary, label }.
  contactList(value) {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }
    const items = Array.isArray(value)
      ? value
      : [
        value,
      ];
    const list = items
      .filter((item) => item !== undefined && item !== null && item !== "")
      .map((item, i) => (typeof item === "object"
        ? {
          value: String(item.value),
          primary: item.primary ?? i === 0,
          label: item.label || "work",
        }
        : {
          value: String(item),
          primary: i === 0,
          label: "work",
        }));
    return list.length
      ? list
      : undefined;
  },
};
