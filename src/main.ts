import { Command } from "@cliffy/command";
import { uuidCmd } from "./commands/uuid.ts";
import { secretCmd } from "./commands/secret.ts";

const main = new Command().name("genid")
  .version("0.1.0")
  .description("Generate uuid and secret strings");

main.command("uuid", uuidCmd);
main.command("secret", secretCmd);

await main.parse();
