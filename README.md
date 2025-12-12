# **json-sqlify**

A tiny, zero-dependency utility that converts **JSON objects or arrays
of objects into SQL INSERT statements**.\
Supports **both parameterized and raw SQL**, handles **null**,
**boolean**, **empty strings**, and automatically maps fields.

Perfect for scripts, migrations, test data generation, or quick SQL
prototyping.

------------------------------------------------------------------------

## **✨ Features**

-   Convert a single JSON object → SQL `INSERT`
-   Convert an array of JSON objects → SQL bulk `INSERT`
-   Supports **parameterized** and **raw SQL** formats
-   Handles:
    -   `null`
    -   booleans (`true` → `TRUE`)
    -   empty strings
-   Fully typed (if used with TypeScript)
-   Zero dependencies

------------------------------------------------------------------------

## **📦 Installation**

``` sh
npm install json-sqlify
```

or

``` sh
yarn add json-sqlify
```

------------------------------------------------------------------------

## **📌 Usage**

### **1. Single JSON → SQL Insert**

``` js
import { jsonToInsert } from "json-sqlify";

const result = jsonToInsert("users", {
  name: "Alice",
  age: 22,
  admin: true,
});
```

**Result (Parameterized SQL)**

``` sql
INSERT INTO users (name, age, admin) VALUES ($1, $2, $3);
```

**Params**

``` js
["Alice", 22, true]
```

### **Raw SQL version**

``` js
jsonToInsert("users", { name: "A", age: 30, admin: false }, { raw: true });
```

------------------------------------------------------------------------

### **2. Bulk JSON → SQL Insert**

``` js
import { jsonToBulkInsert } from "json-sqlify";

const rows = [
  { name: "A", age: 20, admin: false },
  { name: "B", age: 25, admin: true }
];

const result = jsonToBulkInsert("users", rows);
```

### **Bulk Raw SQL**

``` js
jsonToBulkInsert("users", rows, { raw: true });
```

------------------------------------------------------------------------

## **🧪 Running Tests**

``` sh
npm test
```

------------------------------------------------------------------------

## **📁 File Structure**

    json-sqlify/
    ├── index.js
    ├── index.test.js
    ├── package.json
    └── README.md

------------------------------------------------------------------------

## **📜 License**

MIT © Shubham Tidke
