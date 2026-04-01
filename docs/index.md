---
layout: home

hero:
  name: LiteLLM Operator
  text: Kubernetes-native AI Gateway Management
  tagline: Deploy and manage production-ready LiteLLM instances with declarative custom resources. Bidirectional config sync lets you use both GitOps and the Admin UI.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/bitkaio/litellm-operator

features:
  - title: Declarative CRDs
    details: Manage LiteLLM instances, models, teams, users, and API keys as Kubernetes custom resources. Full GitOps compatibility.
  - title: Bidirectional Config Sync
    details: Changes made via CRDs or the Admin UI are kept in sync. Three policies for unmanaged resources — preserve, prune, or adopt.
  - title: SSO-Aware Team Management
    details: Three member management modes — CRD authoritative, SSO authoritative, or mixed. Never accidentally destroy SSO-provisioned memberships.
  - title: Automatic Secret Management
    details: Virtual keys are generated via the LiteLLM API and stored in Kubernetes Secrets with owner references for automatic garbage collection.
  - title: Production Ready
    details: HPA, PDB, NetworkPolicy, health probes, security contexts, resource limits, and database migrations out of the box.
  - title: Multiple Install Methods
    details: OLM bundles for OperatorHub and OpenShift, Helm chart for vanilla Kubernetes, or direct Makefile-based install.
---
