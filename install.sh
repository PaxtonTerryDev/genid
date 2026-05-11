#!/usr/bin/env sh
set -e

REPO="PaxtonTerryDev/genid"
BIN_DIR="${HOME}/.local/bin"
BIN_NAME="genid"

OS=$(uname -s)
ARCH=$(uname -m)

case "$OS" in
  Linux)  os="linux" ;;
  Darwin) os="macos" ;;
  *) echo "Unsupported OS: $OS" && exit 1 ;;
esac

case "$ARCH" in
  x86_64)          arch="x86_64" ;;
  arm64|aarch64)   arch="aarch64" ;;
  *) echo "Unsupported architecture: $ARCH" && exit 1 ;;
esac

ASSET="${BIN_NAME}-${os}-${arch}"
URL="https://github.com/${REPO}/releases/latest/download/${ASSET}"

mkdir -p "$BIN_DIR"
curl -fsSL "$URL" -o "${BIN_DIR}/${BIN_NAME}"
chmod +x "${BIN_DIR}/${BIN_NAME}"

case ":${PATH}:" in
  *":${BIN_DIR}:"*) ;;
  *)
    echo ""
    echo "Add the following to your shell profile to use ${BIN_NAME}:"
    echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
    ;;
esac

echo "Installed ${BIN_NAME} to ${BIN_DIR}/${BIN_NAME}"
