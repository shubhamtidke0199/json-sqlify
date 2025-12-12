const { jsonToInsert, jsonToBulkInsert, jsonToSQL } = require("./index.js");

describe("Postgres JSON → SQL package", () => {
  // -------------------
  // Single row - parameterized
  // -------------------
  test("jsonToInsert - single row - parameterized", () => {
    const { sql, params } = jsonToInsert("users", {
      name: "Shubham",
      age: 22,
      admin: true,
    });
    expect(sql).toBe(
      "INSERT INTO users (name, age, admin) VALUES ($1, $2, $3);"
    );
    expect(params).toEqual(["Shubham", 22, true]);
  });

  // -------------------
  // Single row - raw SQL
  // -------------------
  test("jsonToInsert - single row - raw", () => {
    const { sql } = jsonToInsert(
      "users",
      { name: "O'Brien", age: 22, admin: true },
      { raw: true }
    );
    expect(sql).toBe(
      "INSERT INTO users (name, age, admin) VALUES ('O''Brien', 22, TRUE);"
    );
  });

  // -------------------
  // Bulk insert - parameterized
  // -------------------
  test("jsonToBulkInsert - multiple rows - parameterized", () => {
    const { sql, params } = jsonToBulkInsert("users", [
      { name: "A", age: 20, admin: false },
      { name: "B", age: 25, admin: true },
    ]);
    expect(sql).toBe(
      "INSERT INTO users (name, age, admin) VALUES ($1, $2, $3), ($4, $5, $6);"
    );
    expect(params).toEqual(["A", 20, false, "B", 25, true]);
  });

  // -------------------
  // Bulk insert - raw SQL
  // -------------------
  test("jsonToBulkInsert - multiple rows - raw", () => {
    const { sql } = jsonToBulkInsert(
      "users",
      [
        { name: "A", age: 20, admin: false },
        { name: "B", age: 25, admin: true },
      ],
      { raw: true }
    );
    expect(sql).toBe(
      "INSERT INTO users (name, age, admin) VALUES ('A', 20, FALSE), ('B', 25, TRUE);"
    );
  });

  // -------------------
  // jsonToSQL auto-detect
  // -------------------
  test("jsonToSQL - auto detects single object", () => {
    const { sql, params } = jsonToSQL("users", { name: "X", age: 30 });
    expect(sql).toBe("INSERT INTO users (name, age) VALUES ($1, $2);");
    expect(params).toEqual(["X", 30]);
  });

  test("jsonToSQL - auto detects array", () => {
    const { sql, params } = jsonToSQL("users", [
      { name: "Y", age: 31 },
      { name: "Z", age: 32 },
    ]);
    expect(sql).toBe(
      "INSERT INTO users (name, age) VALUES ($1, $2), ($3, $4);"
    );
    expect(params).toEqual(["Y", 31, "Z", 32]);
  });

  // -------------------
  // Invalid table/column names
  // -------------------
  test("should throw error on invalid table name", () => {
    expect(() => jsonToInsert("123users", { name: "X" })).toThrow(/Table name/);
  });

  test("should throw error on invalid column name", () => {
    expect(() => jsonToInsert("users", { "123name": "X" })).toThrow(
      /Column name/
    );
  });

  // -------------------
  // Special characters in strings
  // -------------------
  test("should escape single quotes in raw SQL", () => {
    const { sql } = jsonToInsert("users", { name: "O'Neil" }, { raw: true });
    expect(sql).toBe("INSERT INTO users (name) VALUES ('O''Neil');");
  });

  // -------------------
  // Null, undefined, boolean handling
  // -------------------
  test("should handle null, undefined, boolean in raw SQL", () => {
    const { sql } = jsonToInsert(
      "users",
      { name: null, age: undefined, active: true },
      { raw: true }
    );
    expect(sql).toBe(
      "INSERT INTO users (name, age, active) VALUES (NULL, NULL, TRUE);"
    );
  });
});
