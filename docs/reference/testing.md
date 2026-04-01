# Testing

## Test Layers

```
┌─────────────────────────────────────┐
│    Scorecard Tests (bundle/)        │  OLM bundle validation
├─────────────────────────────────────┤
│         E2E Tests (test/e2e/)       │  Real cluster + real LiteLLM
├─────────────────────────────────────┤
│   Integration Tests (envtest)       │  Kubernetes API + mock LiteLLM
├─────────────────────────────────────┤
│       Unit Tests (*_test.go)        │  Pure Go, no dependencies
└─────────────────────────────────────┘
```

## Running Tests

```bash
# Unit + integration tests (envtest)
make test

# End-to-end tests (requires Kind cluster)
make test-e2e

# Linting
make lint

# OLM scorecard
operator-sdk scorecard bundle/
```

## Unit Tests

Pure Go tests for individual functions:

- **Resource generation** — `internal/resources/*_test.go`: verify Deployments, ConfigMaps, Services match spec
- **API client** — `internal/litellm/*_test.go`: verify request/response marshaling
- **Config sync** — diff computation, merge strategies
- **Spec hashing** — deterministic hash output
- **Member set operations** — set difference logic for team members

## Integration Tests

Use `envtest` from controller-runtime, which runs a real Kubernetes API server and etcd in-process. The LiteLLM API is mocked.

Tests live in `internal/controller/*_test.go` and use Ginkgo/Gomega:

```go
var _ = Describe("LiteLLMModel Controller", func() {
    It("should successfully reconcile the resource", func() {
        reconciler := &LiteLLMModelReconciler{
            Client: k8sClient,
            Scheme: k8sClient.Scheme(),
            LiteLLMClientFactory: func(endpoint, masterKey string) litellm.Client {
                return litellm.NewMockClient()
            },
        }
        _, err := reconciler.Reconcile(ctx, reconcile.Request{...})
        Expect(err).NotTo(HaveOccurred())
    })
})
```

## E2E Tests

Run against a real Kubernetes cluster (Kind) with a real LiteLLM deployment.

Key scenarios:
1. Full instance lifecycle (create, update, delete)
2. Model CRUD synced to LiteLLM API
3. Team member management with all three modes
4. Config sync with preserve/prune policies
5. VirtualKey Secret creation and garbage collection
6. Instance upgrade with migration Job

## Mock Client

The `litellm.MockClient` enables testing controllers without a real LiteLLM instance:

```go
mock := litellm.NewMockClient()

// Default behavior: returns sensible defaults
// Custom behavior: set Func fields
mock.MockModels.CreateFunc = func(ctx context.Context, req ModelCreateRequest) (*ModelCreateResponse, error) {
    return &ModelCreateResponse{ModelID: "test-id"}, nil
}
```

Each mock service has configurable `Func` fields (e.g., `CreateFunc`, `UpdateFunc`, `DeleteFunc`) with sensible defaults that return success responses.
