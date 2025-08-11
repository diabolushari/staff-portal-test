# KSEB Staff Portal - AI Coding Assistant Instructions

## Architecture Overview

This is a **Laravel + React (Inertia.js) + gRPC microservices** application for KSEB (Kerala State Electricity Board) staff portal. The frontend is React with TypeScript, backend is Laravel PHP, and communication with external services happens via gRPC.

### Key Architectural Patterns

- **Frontend**: React + TypeScript + Inertia.js (SPA-like with server-side routing)
- **Backend**: Laravel 12 with gRPC client integration
- **Protocol Buffers**: `.proto` files in `protos/` generate PHP classes in `generated/`
- **Styling**: TailwindCSS v4 + Radix UI components
- **Testing**: Pest PHP testing framework

## Development Workflow

### gRPC Code Generation

- **Always run** `./scripts/generate-grpc.sh` after modifying `.proto` files
- Generated PHP classes go to `generated/Proto/` and `generated/GPBMetadata/`
- The script automatically refreshes Composer autoloader

### Development Server

```bash
# Start all services (server, queue, logs, vite)
composer dev

# With SSR
composer dev:ssr
```

### Frontend Development

- Pages are in `resources/js/pages/` following Inertia conventions
- Use `npm run dev` for hot reloading
- Components follow TailwindCSS + Radix UI patterns

## Critical Code Patterns

### gRPC Client Pattern

Controllers instantiate gRPC clients in `__construct()`:

```php
public function __construct()
{
    $this->client = new ParameterDefinitionServiceClient(env('GRPC_HOST'), [
        'credentials' => ChannelCredentials::createInsecure()
    ]);
}
```

### gRPC Error Handling

Use `GrpcErrorHandler::extractError($status)` to parse structured gRPC errors from `grpc-status-details-bin` metadata. Supports Google's standard error types (`ErrorInfo`, `BadRequest`).

### Inertia Data Flow

Controllers return Inertia responses:

```php
return Inertia::render('Parameters/ParameterDefinition/ParameterDefinitionIndex', [
    'parameterDefinitions' => $parameterDefinitions,
]);
```

### Proto Message Mapping

Manual mapping between Laravel requests and Protocol Buffer messages:

```php
$definition = new ParameterDefinitionProto();
$definition->setParameterName($request->parameterName);
// ... more setters
```

## File Organization

- **Controllers**: Domain-organized in `app/Http/Controllers/{Domain}/`
- **gRPC Services**: `app/Services/Grpc/`
- **Proto Definitions**: `protos/{domain}/` (e.g., `protos/parameters/`)
- **Generated Classes**: `generated/Proto/{Domain}/` and `generated/GPBMetadata/`
- **Frontend Pages**: `resources/js/pages/{Domain}/`
- **Form Requests**: `app/Http/Requests/{Domain}/`

## Key Dependencies

- **gRPC**: `grpc/grpc`, `google/protobuf`, `google/common-protos`
- **Frontend**: `@inertiajs/react`, `@radix-ui/*`, TailwindCSS v4
- **Laravel**: Inertia.js, Spatie Laravel Data, Ziggy (route helpers)
- **Testing**: Pest PHP with Laravel plugin

## Environment Requirements

- PHP 8.2+ with `ext-grpc` extension
- `protoc` compiler and `grpc_php_plugin` for code generation
- Node.js for frontend tooling

## Common Tasks

1. **Adding new gRPC service**: Create `.proto` → run `generate-grpc.sh` → create controller → create Inertia pages
2. **Frontend components**: Use existing Radix UI patterns and TailwindCSS utilities
3. **Testing**: Use Pest syntax with Laravel-specific helpers
4. **Debugging**: Check `php artisan pail` logs for real-time application logs

## Naming Conventions

- **Proto packages**: `com.kseb.consumerservice.proto.{domain}`
- **PHP namespaces**: `Proto\{Domain}` for generated classes
- **Controllers**: `{Entity}Controller` in domain folders
- **Inertia pages**: `{Domain}/{Entity}/{Action}` structure
