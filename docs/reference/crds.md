# CRD Reference

The LiteLLM Operator defines five Custom Resource Definitions in the `litellm.bitkaio.com/v1alpha1` API group.

## Overview

| CRD | Short Name | Scope | Description |
| --- | --- | --- | --- |
| [LiteLLMInstance](/reference/litellminstance) | `li` | Namespaced | Primary CRD. Deploys LiteLLM proxy infrastructure |
| [LiteLLMModel](/reference/litellmmodel) | `lm` | Namespaced | Registers an AI model with the proxy |
| [LiteLLMTeam](/reference/litellmteam) | `lt` | Namespaced | Creates a team with budget and member management |
| [LiteLLMUser](/reference/litellmuser) | `lu` | Namespaced | Creates a user (non-SSO environments) |
| [LiteLLMVirtualKey](/reference/litellmvirtualkey) | `lk` | Namespaced | Generates a scoped API key |

## Relationship Diagram

```
LiteLLMInstance
├── LiteLLMModel      (instanceRef → LiteLLMInstance)
├── LiteLLMTeam       (instanceRef → LiteLLMInstance)
├── LiteLLMUser       (instanceRef → LiteLLMInstance, teamRef → LiteLLMTeam)
└── LiteLLMVirtualKey (instanceRef → LiteLLMInstance, teamRef → LiteLLMTeam, userRef → LiteLLMUser)
```

All secondary CRDs reference a `LiteLLMInstance` in the same namespace via `spec.instanceRef`. The operator resolves this to find the LiteLLM API endpoint and master key.

## Common Types

These types are shared across multiple CRDs:

### SecretKeyRef

References a specific key within a Kubernetes Secret.

```yaml
secretRef:
  name: my-secret    # Secret name
  key: my-key        # Key within the Secret
```

### InstanceRef

References a `LiteLLMInstance` in the same namespace.

```yaml
instanceRef:
  name: my-gateway   # LiteLLMInstance name
```

## Quick Reference

```bash
# List all resources
kubectl get li,lm,lt,lu,lk

# Watch a specific type
kubectl get litellmmodels -w

# Describe a resource
kubectl describe litellminstance my-gateway
```
