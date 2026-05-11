import { bgRed, red } from "@std/fmt/colors";

export async function readStdin(): Promise<string | null> {
  if (!Deno.stdin.isTerminal()) {
    const buf = await Deno.stdin.readable
      .getReader()
      .read();
    return new TextDecoder().decode(buf.value).trim();
  }
  return null;
}

export function handleError(message: string): void {
  console.log(
    `${bgRed(" ERROR ")} ${
      red(
        message,
      )
    }`,
  );
  Deno.exit();
}
