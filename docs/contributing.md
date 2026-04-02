# Contributing to LiteLLM Operator

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

Be respectful and constructive. We are committed to providing a welcoming and inclusive experience for everyone.

## Getting Started

### Prerequisites

- Go 1.24+
- Docker 17.03+
- kubectl v1.28+
- Access to a Kubernetes v1.28+ cluster (or [Kind](https://kind.sigs.k8s.io/) for local development)
- [Operator SDK](https://sdk.operatorframework.io/docs/installation/) v1.42+

### Fork and Clone

```sh
git clone https://github.com/<your-username>/litellm-operator.git
cd litellm-operator
```

### Install Dependencies

```sh
go mod download
```

### Install CRDs on Your Cluster

```sh
make install
```

### Run the Operator Locally

```sh
make run
```

## Development Workflow

### 1. Create a Branch

```sh
git checkout -b feat/my-feature
```

Use conventional branch prefixes: `feat/`, `fix/`, `docs/`, `refactor/`, `test/`.

### 2. Make Your Changes

- Follow existing code patterns and conventions (see below)
- Add or update tests for any new or changed functionality

### 3. Regenerate and Test

After modifying CRD types or RBAC markers:

```sh
make generate    # Regenerate DeepCopy methods
make manifests   # Regenerate CRD YAMLs, RBAC, webhooks
```

Run the full test suite:

```sh
make test        # Unit + integration tests (envtest)
```

Run the linter:

```sh
make lint
```

### 4. Commit and Push

Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
feat(controller): add budget reset support to team reconciler
fix(api-client): handle 429 rate limit responses with retry
docs: update CRD specification for new fields
test(model): add integration tests for model deletion
refactor(resources): extract common label builder
```

### 5. Open a Pull Request

- Fill in the PR template
- Reference any related issues
- Ensure CI passes (tests, lint)
- Keep PRs focused — one feature or fix per PR

## Coding Conventions

### Go Style

- Follow standard Go conventions and [Effective Go](https://go.dev/doc/effective_go)
- Use `controller-runtime` idioms: `client.Client`, `ctrl.Result`, `ctrl.Request`
- Use `logr` for structured logging — never `fmt.Println` or `log`
- Wrap errors with context: `fmt.Errorf("reconciling model %s: %w", name, err)`

### Naming

- CRD type files: `litellm<resource>_types.go`
- Controller files: `litellm<resource>_controller.go`
- Constants use PascalCase with the `litellm.palena.ai/` prefix for annotations and labels

### Reconciliation Pattern

Every controller follows the standard pattern:

1. Fetch the CR (return early if not found)
2. Handle deletion via finalizer
3. Ensure finalizer is present
4. Resolve `instanceRef` to get LiteLLM endpoint and master key
5. Reconcile the resource against the LiteLLM API
6. Update status conditions

### Error Handling

- Transient errors (network, API 5xx): requeue with `RequeueAfter: 30 * time.Second`
- Permanent errors (invalid spec, 400): set a status condition, do not requeue
- Always update status conditions on both success and failure
- Never silently swallow errors

### Testing

- Unit tests: individual functions, resource generation, diff logic
- Integration tests: use `envtest` (controller-runtime's test environment)
- E2E tests: run against a real cluster with `make test-e2e`
- Mock the `litellm.Client` interface for unit and integration tests

## Project Structure

```text
api/v1alpha1/          CRD type definitions
internal/controller/   Reconciliation controllers
internal/litellm/      LiteLLM REST API client
internal/resources/    Kubernetes resource generators
config/crd/bases/      Generated CRD manifests
config/samples/        Example custom resources
bundle/                OLM bundle manifests
deploy/charts/         Helm chart
```

## Adding a New CRD

1. Scaffold with Operator SDK:
   ```sh
   operator-sdk create api --group litellm --version v1alpha1 --kind LiteLLMNewResource --resource --controller
   ```
2. Define types in `api/v1alpha1/litellmnewresource_types.go`
3. Implement the controller in `internal/controller/litellmnewresource_controller.go`
4. Add API client methods in `internal/litellm/` if the CRD syncs with the LiteLLM API
5. Add mock methods in `internal/litellm/mock_client.go`
6. Add a sample CR in `config/samples/`
7. Run `make generate manifests test`

## Reporting Issues

- Use [GitHub Issues](https://github.com/bitkaio/litellm-operator/issues)
- Include steps to reproduce, expected vs actual behavior, and relevant logs
- For security vulnerabilities, email security@bitkai.io instead of opening a public issue

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).
