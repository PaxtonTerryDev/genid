import { generateKey } from "node:crypto";
import { Command, EnumType } from "@cliffy/command";
import { handleError } from "../lib.ts";

const encryptionMethod = new EnumType(["hmac", "aes"]);
const validLength = new EnumType([128, 192, 256]);

export const secretCmd = new Command()
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
