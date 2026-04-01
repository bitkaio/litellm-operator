# Observability

## Prometheus Metrics

The operator exposes Prometheus metrics on `:8443/metrics`:

| Metric | Type | Description |
| --- | --- | --- |
| `litellm_operator_reconcile_total` | Counter | Reconciliation count per controller |
| `litellm_operator_reconcile_errors_total` | Counter | Error count per controller |
| `litellm_operator_reconcile_duration_seconds` | Histogram | Reconciliation latency |
| `litellm_operator_config_sync_total` | Counter | Config sync operations |
| `litellm_operator_config_sync_drift_detected` | Counter | Drift detection events |
| `litellm_operator_managed_instances` | Gauge | Number of managed instances |
| `litellm_operator_managed_models` | Gauge | Number of managed models |
| `litellm_operator_managed_teams` | Gauge | Number of managed teams |
| `litellm_operator_managed_users` | Gauge | Number of managed users |
| `litellm_operator_managed_keys` | Gauge | Number of managed keys |

## ServiceMonitor

If Prometheus Operator is installed, enable automatic scrape target creation:

```yaml
apiVersion: litellm.bitkaio.com/v1alpha1
kind: LiteLLMInstance
metadata:
  name: my-gateway
spec:
  observability:
    serviceMonitor:
      enabled: true
      interval: 30s
      labels:
        release: prometheus
```

## Callbacks

LiteLLM supports callback integrations for logging and observability. Configure them via the Instance CRD:

```yaml
spec:
  callbacks:
    enabled: true
    callbacks:
      - langfuse
    langfuse:
      publicKeySecretRef:
        name: langfuse-credentials
        key: public-key
      secretKeySecretRef:
        name: langfuse-credentials
        key: secret-key
      host: https://langfuse.example.com
```

The operator translates callback configuration into environment variables (`LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_HOST`) and adds the callback list to the `proxy_server_config.yaml`.

## Status Conditions

Every CRD reports health via standard `metav1.Condition` types:

```bash
# Check instance conditions
kubectl get li my-gateway -o jsonpath='{.status.conditions}' | jq

# Check if all models are synced
kubectl get lm -o custom-columns=NAME:.metadata.name,SYNCED:.status.synced
```

Condition types used:

| CRD | Condition | Meaning |
| --- | --- | --- |
| LiteLLMInstance | `Ready` | All managed resources are healthy |
| LiteLLMInstance | `DatabaseReady` | Database connection and migrations are healthy |
| LiteLLMInstance | `RedisReady` | Redis connection is healthy |
| LiteLLMInstance | `ConfigSynced` | Config sync loop is running without errors |
| Secondary CRDs | `Synced` | Resource is synced to the LiteLLM API |

## Kubernetes Events

The operator emits Kubernetes Events for important lifecycle actions:

```bash
kubectl get events --field-selector involvedObject.kind=LiteLLMInstance
```
