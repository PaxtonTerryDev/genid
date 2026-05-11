import * as uuid from "@std/uuid";
import { Command } from "@cliffy/command";
import { handleError, readStdin } from "../lib.ts";

const piped = await readStdin();

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

uuidCmd.command("v1", v1cmd);
uuidCmd.command("v3", v3cmd);
uuidCmd.command("v4", v4cmd);
uuidCmd.command("v5", v5cmd);
uuidCmd.command("v7", v7cmd);

export { uuidCmd };
