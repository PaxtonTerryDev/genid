import { assertEquals, assertMatch } from "@std/assert";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const HEX_RE = /^[0-9a-f]+$/;

async function run(...args: string[]): Promise<string> {
  const cmd = new Deno.Command("deno", {
    args: ["run", "--allow-all", "src/main.ts", ...args],
    stdout: "piped",
    stderr: "null",
  });
  const { stdout } = await cmd.output();
  return new TextDecoder().decode(stdout).trim();
}

Deno.test("uuid v1 generates valid v1 uuid", async () => {
  const out = await run("uuid", "v1");
  assertMatch(out, UUID_RE);
  assertEquals(out[14], "1");
});

Deno.test("uuid v3 generates valid v3 uuid", async () => {
  const out = await run("uuid", "v3", "hello");
  assertMatch(out, UUID_RE);
  assertEquals(out[14], "3");
});

Deno.test("uuid v3 is deterministic", async () => {
  const a = await run("uuid", "v3", "hello");
  const b = await run("uuid", "v3", "hello");
  assertEquals(a, b);
});

Deno.test("uuid v4 generates valid v4 uuid", async () => {
  const out = await run("uuid", "v4");
  assertMatch(out, UUID_RE);
  assertEquals(out[14], "4");
});

Deno.test("uuid v5 generates valid v5 uuid", async () => {
  const out = await run("uuid", "v5", "hello");
  assertMatch(out, UUID_RE);
  assertEquals(out[14], "5");
});

Deno.test("uuid v5 is deterministic", async () => {
  const a = await run("uuid", "v5", "hello");
  const b = await run("uuid", "v5", "hello");
  assertEquals(a, b);
});

Deno.test("uuid v7 generates valid v7 uuid", async () => {
  const out = await run("uuid", "v7");
  assertMatch(out, UUID_RE);
  assertEquals(out[14], "7");
});

Deno.test("uuid v7 with timestamp generates valid v7 uuid", async () => {
  const out = await run("uuid", "v7", "1000000000000");
  assertMatch(out, UUID_RE);
  assertEquals(out[14], "7");
});

Deno.test("secret aes generates hex key", async () => {
  const out = await run("secret");
  assertMatch(out, HEX_RE);
  assertEquals(out.length, 32);
});

Deno.test("secret aes 256 generates 256-bit hex key", async () => {
  const out = await run("secret", "aes", "256");
  assertMatch(out, HEX_RE);
  assertEquals(out.length, 64);
});

Deno.test("secret hmac generates hex key", async () => {
  const out = await run("secret", "hmac");
  assertMatch(out, HEX_RE);
});
