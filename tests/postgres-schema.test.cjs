const assert = require("node:assert/strict");
const { test } = require("node:test");
const { Client } = require("pg");
require("ts-node").register({ transpileOnly: true, compilerOptions: { module: "CommonJS" } });
const newConnector = require("../src/lib/connectors/postgres").default;

// Use a disposable database owned by the test user, with CREATE access to public.
// The test removes only the schemas and table it creates.
test("PostgreSQL schemas preserve column comments", { skip: !process.env.SQLCHAT_TEST_POSTGRES_URL }, async () => {
  const url = new URL(process.env.SQLCHAT_TEST_POSTGRES_URL);
  const client = new Client({ connectionString: url.toString() });
  const suffix = `${process.pid}_${Date.now()}`;
  const schemas = [`comments_${suffix}`, `comments " ${suffix}`];
  const publicTable = `uncommented_${suffix}`;
  const quote = (name) => `"${name.replace(/"/g, '""')}"`;
  const text = "Customer's address\\unit\n第二行 */ --";
  await client.connect();
  try {
    for (const schema of schemas) {
      await client.query(`CREATE SCHEMA ${quote(schema)}`);
      await client.query(`CREATE TABLE ${quote(schema)}.items (removed text, value text, plain integer)`);
      await client.query(`ALTER TABLE ${quote(schema)}.items DROP COLUMN removed`);
    }
    await client.query(`COMMENT ON COLUMN ${quote(schemas[0])}.items.value IS 'First schema'`);
    const { rows: comments } = await client.query("SELECT format('COMMENT ON COLUMN %I.items.value IS %L', $1::text, $2::text) AS sql", [
      schemas[1],
      text,
    ]);
    await client.query(comments[0].sql);
    await client.query(`CREATE VIEW ${quote(schemas[1])}.item_view AS SELECT value FROM ${quote(schemas[1])}.items`);
    await client.query(`COMMENT ON COLUMN ${quote(schemas[1])}.item_view.value IS 'View comment'`);
    await client.query(`ALTER TABLE ${quote(schemas[1])}.items ADD COLUMN "quoted column" text`);
    await client.query(`COMMENT ON COLUMN ${quote(schemas[1])}.items."quoted column" IS 'Quoted column'`);
    await client.query(`CREATE TABLE public.${quote(publicTable)} (id integer NOT NULL)`);

    const connector = newConnector({
      host: url.hostname,
      port: url.port || "5432",
      username: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
    });
    const result = await connector.getTableSchema(url.pathname.slice(1));
    const structure = (schema, table) => result.find((item) => item.name === schema).tables.find((item) => item.name === table).structure;
    const first = structure(schemas[0], "items");
    const second = structure(schemas[1], "items");
    assert.ok(first.includes("IS 'First schema';"));
    assert.ok(!second.includes("First schema"));
    assert.ok(second.includes("items.\"quoted column\" IS 'Quoted column';"));
    assert.equal((second.match(/COMMENT ON COLUMN/g) || []).length, 2);
    assert.ok(structure(schemas[1], "item_view").includes("IS 'View comment';"));
    assert.equal(structure("public", publicTable), `CREATE TABLE "${publicTable}" (\nid INTEGER NOT NULL\n);`);

    // Replay the emitted statements to verify identifier and literal escaping.
    await client.query(`COMMENT ON COLUMN ${quote(schemas[1])}.items.value IS NULL`);
    const commentSql = second.slice(second.indexOf("COMMENT ON COLUMN"));
    await client.query(commentSql);
    const { rows } = await client.query(
      "SELECT col_description(c.oid, a.attnum) AS description FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace JOIN pg_attribute a ON a.attrelid = c.oid WHERE n.nspname = $1 AND c.relname = 'items' AND a.attname = 'value'",
      [schemas[1]]
    );
    assert.equal(rows[0].description, text);
  } finally {
    try {
      for (const schema of schemas) await client.query(`DROP SCHEMA IF EXISTS ${quote(schema)} CASCADE`);
      await client.query(`DROP TABLE IF EXISTS public.${quote(publicTable)}`);
    } finally {
      await client.end();
    }
  }
});
