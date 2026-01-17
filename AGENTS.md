# Repository Guidelines

## Project Structure & Module Organization

- Backend lives in `app/`, with domain-based controllers in `app/Http/Controllers/{Domain}/` and services in
  `app/Services/`.
- Frontend Inertia pages are in `resources/js/pages/{Domain}/`, shared components in `resources/js/components/`, and UI
  primitives in `resources/js/components/ui/`.
- Proto files are in `protos/`, generated gRPC PHP classes in `generated/Proto/` and `generated/GPBMetadata/`.
- Tests are in `tests/` (Pest), public assets in `public/`, and build output is handled by Vite.

## Build, Test, and Development Commands

- `composer dev`: run Laravel server, queue, logs, and Vite together.
- `composer dev:ssr`: start server with Inertia SSR.
- `npm run dev`: frontend dev server only.
- `npm run build` / `npm run build:ssr`: production builds.
- `php artisan test` or `composer test`: run the full test suite.
- `./scripts/generate-grpc.sh`: regenerate PHP classes after any `.proto` change.

## Coding Style & Naming Conventions

- PHP formatting: `vendor/bin/pint` (Laravel Pint). Use form requests for validation.
- Frontend formatting: `npm run format` (Prettier), linting: `npm run lint` (ESLint).
- Naming: PascalCase React components, `{Entity}Controller` in domain folders, Inertia pages follow
  `{Domain}/{Entity}/{Action}`.
- Indentation: follow existing files (2 spaces in JS/TS, 4 in PHP).

## Testing Guidelines

- Framework: Pest PHP v3 in `tests/`.
- Use descriptive test names; keep feature tests in `tests/Feature` and unit tests in `tests/Unit`.
- Run focused tests with `php artisan test --filter=testName` or `php artisan test tests/Feature/FooTest.php`.

## Commit & Pull Request Guidelines

- Use Conventional Commits: `type(scope): summary` (e.g., `feat(ui): add meter profile filters`,
  `fix(grpc): regenerate stubs`).
- Types to prefer: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.
- PRs should include a clear summary, linked issue/ticket when applicable, and screenshots for UI changes.
- If `.proto` files change, note that `./scripts/generate-grpc.sh` was run.

## Configuration & gRPC Notes

- Requires PHP 8.2+, `ext-grpc`, `protoc`, and `grpc_php_plugin`.
- Keep `.env` values aligned with gRPC endpoints (e.g., `GRPC_HOST`).


- pestphp/pest (PEST) - v3
- phpunit/phpunit (PHPUNIT) - v11
- @inertiajs/react (INERTIA) - v2
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- eslint (ESLINT) - v9
- prettier (PRETTIER) - v3

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling
  files for the correct structure, approach, naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove it works. Unit and feature
  tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure - don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`,
  `npm run dev`, or `composer run dev`. Ask them.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.
