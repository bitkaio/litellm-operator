# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] - 2026-04-01

### Added

- **LiteLLMInstance CRD** — deploy production-ready LiteLLM proxy instances with Deployment, ConfigMap, Service, Ingress, HPA, PDB, NetworkPolicy, and database migration Job management
- **LiteLLMModel CRD** — register AI models (OpenAI, Anthropic, Azure, etc.) with the LiteLLM proxy via the REST API
- **LiteLLMTeam CRD** — create and manage teams with budget limits, rate limits, and three member management modes (`crd`, `sso`, `mixed`)
- **LiteLLMUser CRD** — manage users for non-SSO environments (service accounts, bot users) with team memberships
- **LiteLLMVirtualKey CRD** — generate scoped API keys stored in Kubernetes Secrets with owner references for automatic garbage collection
- LiteLLM REST API client with interface-based design and mock implementation for testing
- Finalizer-based cleanup on CRD deletion (calls LiteLLM API delete endpoints)
- Spec hash annotations (`litellm.palena.ai/sync-hash`) for change detection to avoid unnecessary API calls
- Auto-generation of master key and salt key Secrets
- Database migration Job support (runs before Deployment rollout)
- SSO configuration support (Azure Entra ID, Okta, Google, generic OIDC)
- SCIM v2 provisioning configuration
- Redis configuration for caching and routing
- Callback configuration (Langfuse, etc.)
- Observability support (ServiceMonitor for Prometheus)
- Resource generators for all Kubernetes resources (Deployment, ConfigMap, Service, Ingress, HPA, PDB, NetworkPolicy, migration Job)
- Sample CRs for all 5 CRDs in `config/samples/`
- GitHub Actions workflows for tests, linting, and releases
- OLM bundle and catalog manifests for OperatorHub distribution

[Unreleased]: https://github.com/bitkaio/litellm-operator/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/bitkaio/litellm-operator/releases/tag/v0.5.0
