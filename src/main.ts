import * as uuid from "@std/uuid";
import { bgRed, red } from "@std/fmt/colors";
import { Command, EnumType } from "@cliffy/command";
import { generateKey } from "node:crypto";

function handleError(message: string): void {
  console.log(
    `${bgRed(" ERROR ")} ${
      red(
        message,
      )
    }`,
  );
  Deno.exit();
}

async function readStdin(): Promise<string | null> {
  if (!Deno.stdin.isTerminal()) {
    const buf = await Deno.stdin.readable
      .getReader()
      .read();
    return new TextDecoder().decode(buf.value).trim();
  }
  return null;
}

const piped = await readStdin();

const main = new Command().name("genit")
  .version("0.1.0")
  .description("Generate and validate uuid or secret strings");

const uuidCmd = new Command().description("Generate uuid strings");

const v1cmd = new Command()
  .description("Generate a time-based uuid (v1)")
  .action(() => console.log(uuid.v1.generate()));

const v3cmd = new Command()
  .description("Generate a namespace-based uuid using MD5 (v3)")
  .argument("<input:string>", "The string to encode into the uuid")
  .useRawArgs()
  .action(async (_, input) => {
    const u = piped ?? input;
    console.log(
      await uuid.v3.generate(
        uuid.NAMESPACE_DNS,
        new TextEncoder().encode(u),
      ),
    );
  });

const v4cmd = new Command()
  .description("Generate a random uuid (v4)")
  .action(() => console.log(crypto.randomUUID()));

const v5cmd = new Command()
  .description("Generate a namespace-based uuid using SHA-1 (v5)")
  .argument("<input:string>", "The string to encode into the uuid")
  .useRawArgs()
  .action(async (_, input) => {
    const u = piped ?? input;
    console.log(
      await uuid.v5.generate(
        uuid.NAMESPACE_DNS,
        new TextEncoder().encode(u),
      ),
    );
  });

const v7cmd = new Command()
  .description("Generate a timestamp-ordered uuid (v7)")
  .argument("[timestamp:number]", "The timestamp to encode")
  .action((_, timestamp) => {
    const input = piped ?? timestamp;
    if (!input) {
      console.log(uuid.v7.generate());
      return;
    }
    try {
      const date = new Date(input).getTime();
      console.log(uuid.v7.generate(date));
    } catch (_) {
      handleError(
        "invalid data provided to v7 generation function - requires a valid unix timestamp",
      );
    }
  });

const encryptionMethod = new EnumType(["hmac", "aes"]);
const validLength = new EnumType([128, 192, 256]);

const secretCmd = new Command()
  .description("Generate a new secret key")
  .type("encryption", encryptionMethod)
  .argument(
    "[encryption:encryption]",
    "The type of hash to use to create the secret key",
    { default: "aes" },
  )
  .type("valid-length", validLength)
  .argument(
    "[length:valid-length]",
    "The length of the key. Note - valid lengths vary by encryption type",
    { default: 128 },
  )
  .action((_, e, l) => {
    generateKey(e, { length: l }, (err, key) => {
      if (err) {
        handleError(
          `Unable to create secret key\n${err.message ?? ""}`,
        );
      }
      console.log(key.export().toString("hex"));
    });
  });

uuidCmd.command("v1", v1cmd);
uuidCmd.command("v3", v3cmd);
uuidCmd.command("v4", v4cmd);
uuidCmd.command("v5", v5cmd);
uuidCmd.command("v7", v7cmd);
main.command("uuid", uuidCmd);
main.command("secret", secretCmd);

await main.parse();
