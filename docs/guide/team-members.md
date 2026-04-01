# Team Member Management

The `LiteLLMTeam` CRD supports three member management modes to handle the coexistence of CRD-managed and SSO-provisioned team members.

## The Problem

When SSO (Azure Entra ID, Okta, etc.) is configured, LiteLLM auto-creates teams from IdP groups and provisions members. If the operator naively syncs `spec.members` as the authoritative list, it would **destroy SSO-provisioned memberships** when the CRD's members list is empty or doesn't include SSO users.

## Member Management Modes

Set the mode via `spec.memberManagement`:

```yaml
apiVersion: litellm.bitkaio.com/v1alpha1
kind: LiteLLMTeam
metadata:
  name: engineering
spec:
  instanceRef:
    name: my-gateway
  teamAlias: engineering
  memberManagement: mixed  # crd | sso | mixed
  members:
    - email: admin@example.com
      role: admin
```

### `crd` Mode

The CRD is the **single source of truth**. The reconciler syncs members exactly as listed — extra members found in the API are removed.

```
Desired = spec.members
Actual  = GET from LiteLLM API

Add:    spec.members − actual
Remove: actual − spec.members

Status: crdMembers = spec.members, ssoMembers = []
```

**Use when:** You manage all team membership via GitOps and don't use SSO.

### `sso` Mode

The Identity Provider is the **source of truth**. The operator never touches members — `spec.members` is ignored entirely. Status reports what SSO has provisioned.

```
Skip all member reconciliation.

Status: ssoMembers = GET from API, crdMembers = []
```

**Use when:** SSO/SCIM handles all membership and you only want the operator to manage team properties (budget, models, rate limits).

### `mixed` Mode (default)

CRD members are **additive**. SSO members are always preserved. The operator only removes members that it previously added via the CRD.

```
CRD members not in API          → add them
Previous CRD members not in spec → remove them
SSO-only members                 → never touch

Status: crdMembers = spec.members,
        ssoMembers = actual − spec.members
```

**Use when:** You want to add specific members via CRD (e.g., service accounts, admins) while SSO handles the rest.

## How Mixed Mode Tracks Ownership

The operator tracks which members it manages via `status.crdMembers`. On each reconciliation:

1. It reads the previous `status.crdMembers` list
2. It compares against the current `spec.members`
3. Members that were in `crdMembers` but are no longer in `spec.members` are removed
4. Members that are in `spec.members` but not in the API are added
5. Members that exist in the API but were never in `crdMembers` are classified as SSO members and left untouched

This ensures that removing a member from `spec.members` only removes them if the **operator** added them, never if SSO provisioned them.

## Status Reporting

```yaml
status:
  synced: true
  litellmTeamId: "team-abc123"
  totalMemberCount: 5
  crdMembers:
    - email: admin@example.com
      role: admin
      source: crd
      synced: true
  ssoMembers:
    - email: jane@example.com
      role: user
      source: azure-entra
      synced: true
    - email: bob@example.com
      role: user
      source: azure-entra
      synced: true
```

## Examples

### Add a Service Account to an SSO-Managed Team

```yaml
spec:
  memberManagement: mixed
  members:
    - email: ci-bot@example.com
      role: user
```

The CI bot is added via CRD. All SSO-provisioned members remain untouched.

### Full CRD Control (No SSO)

```yaml
spec:
  memberManagement: crd
  members:
    - email: alice@example.com
      role: admin
    - email: bob@example.com
      role: user
```

Any member in the API not listed here will be removed on the next reconciliation.

### Pure SSO (Operator Manages Properties Only)

```yaml
spec:
  memberManagement: sso
  # spec.members is ignored
  models:
    - gpt-4o
  maxBudgetMonthly: 5000
```
