#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Generating gRPC PHP files...${NC}"

# Clean previous generation
rm -rf generated/GPBMetadata generated/Proto

# Generate all proto files
protoc \
  --proto_path=./protos \
  --php_out=./generated \
  --grpc_out=./generated \
  --plugin=protoc-gen-grpc=$(which grpc_php_plugin) \
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
