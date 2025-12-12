import { jsonToBulkInsert, jsonToInsert, jsonToSQL } from "./index.js";

// -----------------------------------------------
// Single INSERT (Parameterized)
// -----------------------------------------------
const singleParam = jsonToInsert(
  "users",
  { name: "Alice", age: 25, admin: true },
  { raw: false }
);

console.log("Single Insert (Parameterized):");
console.log(singleParam.sql); // INSERT INTO users (...)
console.log(singleParam.params); // ['Alice', 25, true]
console.log("\n");

// -----------------------------------------------
// Single INSERT (Raw SQL)
// -----------------------------------------------
const singleRaw = jsonToInsert(
  "users",
  { name: "Bob", age: null, admin: false },
  { raw: true }
);

console.log("Single Insert (Raw SQL):");
console.log(singleRaw.sql); // INSERT INTO users (...)
console.log("\n");

// -----------------------------------------------
// Bulk INSERT (Parameterized)
// -----------------------------------------------
const bulkParam = jsonToBulkInsert(
  "users",
  [
    { name: "Charlie", age: 30, admin: false },
    { name: "Daisy", age: 27, admin: true },
  ],
  { raw: false }
);

console.log("Bulk Insert (Parameterized):");
console.log(bulkParam.sql);
console.log(bulkParam.params);
console.log("\n");

// -----------------------------------------------
// Bulk INSERT (Raw SQL)
// -----------------------------------------------
const bulkRaw = jsonToBulkInsert(
  "users",
  [
    { name: "Eve", age: 22, admin: true },
    { name: "Frank", age: 35, admin: false },
  ],
  { raw: true }
);

console.log("Bulk Insert (Raw SQL):");
console.log(bulkRaw.sql);
console.log("\n");

// -----------------------------------------------
// Auto-detect Single vs Bulk
// -----------------------------------------------
console.log("Auto Single:");
console.log(jsonToSQL("users", { name: "Grace", age: 29 }));

console.log("\nAuto Bulk:");
console.log(
  jsonToSQL("users", [
    { name: "Henry", age: 33 },
    { name: "Ivy", age: 24 },
  ])
);
console.log("\n");

// -----------------------------------------------
// Complex dataset test (Raw SQL)
// -----------------------------------------------
const testData = [
  {
    name: "John",
    age: 28,
    admin: true,
    last_login: new Date("2025-01-01T10:00:00Z"),
    notes: null,
  },
  {
    name: "Kim",
    age: 35,
    admin: false,
    last_login: new Date("2025-01-05T15:30:00Z"),
    notes: "VIP user",
  },
  {
    name: "Leo",
    age: 22,
    admin: true,
    last_login: null,
    notes: "",
  },
  {
    name: "O'Brien",
    age: 40,
    admin: false,
    last_login: new Date(),
    notes: "Has 'quotes'",
  },
];

console.log("Complex Data (Raw Inserts):");
testData.forEach((user) => {
  const stmt = jsonToInsert("users", user, { raw: true });
  console.log(stmt.sql);
});
