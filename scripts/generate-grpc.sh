#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Generating gRPC PHP files...${NC}"

# Clean previous generation (all namespaces)
rm -rf generated/GPBMetadata generated/Proto generated/Com

# Ensure output directory exists
mkdir -p generated

# Generate all proto files
# Detect protoc version
PROTOC_VERSION_RAW=$(protoc --version 2>/dev/null)
if [[ $? -ne 0 ]]; then
  echo -e "${RED}❌ protoc compiler not found in PATH. Install protoc before continuing.${NC}"
  exit 1
fi

# Extract numeric version (expects: libprotoc X.Y.Z)
PROTOC_VERSION=$(echo "$PROTOC_VERSION_RAW" | awk '{print $2}')

# Locate grpc_php_plugin (allow override via GRPC_PHP_PLUGIN env)
if [[ -n "$GRPC_PHP_PLUGIN" ]]; then
  GRPC_PLUGIN_PATH="$GRPC_PHP_PLUGIN"
else
  GRPC_PLUGIN_PATH=$(which grpc_php_plugin 2>/dev/null)
fi

if [[ -z "$GRPC_PLUGIN_PATH" || ! -x "$GRPC_PLUGIN_PATH" ]]; then
  echo -e "${RED}❌ grpc_php_plugin not found (needed for --grpc_out).${NC}"
  echo -e "${BLUE}👉 Installation options:${NC}"
  echo -e "  1) PECL: sudo pecl install grpc (then ensure extension_dir contains grpc_php_plugin)"
  echo -e "  2) Build from source: git clone https://github.com/grpc/grpc && cd grpc && git submodule update --init && mkdir -p cmake/build && cd cmake/build && cmake ../.. -DgRPC_BUILD_TESTS=OFF && make -j$(nproc) grpc_php_plugin && cp grpc_php_plugin /usr/local/bin/" 
  echo -e "  3) Package (if available): sudo apt install grpc-php-plugin (Ubuntu often lacks latest)"
  echo -e "Then re-run: GRPC_PHP_PLUGIN=/full/path/to/grpc_php_plugin bash scripts/generate-grpc.sh"
  exit 1
fi

# Determine if we need experimental flag for proto3 optional (required < 3.15.0)
NEEDS_OPTIONAL_FLAG=0
MIN_OPTIONAL_VERSION="3.15.0"

version_lt() { # returns 0 (true) if $1 < $2
  [[ "$1" == "$2" ]] && return 1
  local IFS=.
  local i ver1=($1) ver2=($2)
  # Pad with zeros
  for ((i=${#ver1[@]}; i<3; i++)); do ver1[i]=0; done
  for ((i=${#ver2[@]}; i<3; i++)); do ver2[i]=0; done
  for ((i=0; i<3; i++)); do
    if ((10#${ver1[i]} < 10#${ver2[i]})); then return 0; fi
    if ((10#${ver1[i]} > 10#${ver2[i]})); then return 1; fi
  done
  return 1
}

if version_lt "$PROTOC_VERSION" "$MIN_OPTIONAL_VERSION"; then
  NEEDS_OPTIONAL_FLAG=1
fi

EXTRA_FLAGS=()
if [[ $NEEDS_OPTIONAL_FLAG -eq 1 ]]; then
  echo -e "${BLUE}ℹ️ Detected protoc $PROTOC_VERSION (< $MIN_OPTIONAL_VERSION); enabling --experimental_allow_proto3_optional${NC}"
  EXTRA_FLAGS+=(--experimental_allow_proto3_optional)
else
  echo -e "${BLUE}ℹ️ Detected protoc $PROTOC_VERSION (>= $MIN_OPTIONAL_VERSION); experimental optional flag not needed${NC}"
fi

protoc \
  "${EXTRA_FLAGS[@]}" \
  --proto_path=./protos \
  --php_out=./generated \
  --grpc_out=./generated \
  --plugin=protoc-gen-grpc=$GRPC_PLUGIN_PATH \
  $(find ./protos -name "*.proto")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ gRPC PHP files generated successfully!${NC}"

    # Count generated files
    php_files=$(find generated/ -name "*.php" | wc -l)
    echo -e "${GREEN}📁 Generated ${php_files} PHP files${NC}"

    # Refresh autoloader
    composer dump-autoload
    echo -e "${GREEN}🔄 Composer autoloader refreshed${NC}"
else
    echo -e "${RED}❌ Failed to generate gRPC PHP files${NC}"
    exit 1
fi
