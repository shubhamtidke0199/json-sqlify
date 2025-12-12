// index.js

function isValidIdentifier(name) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name);
}

function validateName(name, type) {
  if (!isValidIdentifier(name)) {
    throw new Error(
      `${type} "${name}" is invalid. Use letters, numbers, underscore; must start with a letter or underscore.`
    );
  }
}

// Escape values safely for raw SQL (Postgres)
function escapeValue(v) {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  if (typeof v === "number") return String(v);
  if (v instanceof Date) return `'${v.toISOString()}'`;
  return `'${String(v).replace(/'/g, "''")}'`; // escape single quotes
}

// Convert a single object to SQL (parameterized or raw)
function jsonToInsert(table, obj, options = { raw: false }) {
  validateName(table, "Table name");

  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    throw new Error("jsonToInsert expects a single object.");
  }

  const columns = Object.keys(obj);
  columns.forEach((col) => validateName(col, "Column name"));

  const values = columns.map((col) => obj[col]);

  if (options.raw) {
    const valString = values.map(escapeValue).join(", ");
    return {
      sql: `INSERT INTO ${table} (${columns.join(
        ", "
      )}) VALUES (${valString});`,
    };
  } else {
    const placeholders = values.map((_, idx) => `$${idx + 1}`).join(", ");
    return {
      sql: `INSERT INTO ${table} (${columns.join(
        ", "
      )}) VALUES (${placeholders});`,
      params: values,
    };
  }
}

// Convert an array of objects to SQL (parameterized or raw)
function jsonToBulkInsert(table, arr, options = { raw: false }) {
  validateName(table, "Table name");
  if (!Array.isArray(arr) || arr.length === 0)
    throw new Error("jsonToBulkInsert expects a non-empty array of objects.");

  const columns = Object.keys(arr[0]);
  columns.forEach((col) => validateName(col, "Column name"));

  if (options.raw) {
    const rowStrings = arr.map(
      (obj) => `(${columns.map((col) => escapeValue(obj[col])).join(", ")})`
    );
    return {
      sql: `INSERT INTO ${table} (${columns.join(
        ", "
      )}) VALUES ${rowStrings.join(", ")};`,
    };
  } else {
    const params = [];
    const rowPlaceholders = arr.map((obj) => {
      const row = columns.map((col) => {
        params.push(obj[col]);
        return `$${params.length}`;
      });
      return `(${row.join(", ")})`;
    });
    return {
      sql: `INSERT INTO ${table} (${columns.join(
        ", "
      )}) VALUES ${rowPlaceholders.join(", ")};`,
      params,
    };
  }
}

// Auto-detect single vs multiple, supports `raw` option
function jsonToSQL(table, data, options = { raw: false }) {
  return Array.isArray(data)
    ? jsonToBulkInsert(table, data, options)
    : jsonToInsert(table, data, options);
}

export { jsonToInsert, jsonToBulkInsert, jsonToSQL };
// module.exports = { jsonToInsert, jsonToBulkInsert, jsonToSQL };
