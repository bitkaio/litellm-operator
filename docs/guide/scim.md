# SCIM Provisioning

The operator supports configuring SCIM v2 provisioning endpoints on LiteLLM instances. SCIM enables your Identity Provider (Okta, Azure AD, etc.) to automatically provision and deprovision users and groups.

## How It Works

1. The operator enables SCIM on the LiteLLM Deployment
2. A bearer token is generated (or provided) for authenticating SCIM requests
3. LiteLLM exposes SCIM endpoints:
   - `POST /scim/v2/Users` — create user
   - `GET /scim/v2/Users` — list users
   - `PATCH /scim/v2/Users/:id` — update user
   - `DELETE /scim/v2/Users/:id` — deactivate user
   - `POST /scim/v2/Groups` — create group/team
   - `GET /scim/v2/Groups` — list groups
   - `PATCH /scim/v2/Groups/:id` — update group membership
4. Your IdP calls these endpoints to sync users and groups

## Configuration

### Auto-Generated Token

The simplest setup — the operator generates a SCIM token and stores it in a Secret:

```yaml
apiVersion: litellm.bitkaio.com/v1alpha1
kind: LiteLLMInstance
metadata:
  name: my-gateway
spec:
  scim:
    enabled: true
    generatedTokenSecretName: litellm-scim-token
```

Retrieve the generated token to configure your IdP:

```bash
kubectl get secret litellm-scim-token -o jsonpath='{.data.scim-token}' | base64 -d
```

### Existing Token

If you prefer to manage the token yourself:

```bash
kubectl create secret generic my-scim-token \
  --from-literal=token='your-scim-bearer-token'
```

```yaml
spec:
  scim:
    enabled: true
    tokenSecretRef:
      name: my-scim-token
      key: token
```

## IdP Setup

### Azure Entra ID

1. In Azure portal, go to your Enterprise Application
2. Navigate to **Provisioning** > **Automatic**
3. Set the **Tenant URL** to `https://your-litellm-domain/scim/v2`
4. Set the **Secret Token** to the SCIM token from the Secret
5. Click **Test Connection**, then **Save**
6. Set the provisioning scope and start provisioning

### Okta

1. In Okta admin, go to your Application
2. Navigate to the **Provisioning** tab
3. Enable **SCIM connector**
4. Set the **SCIM connector base URL** to `https://your-litellm-domain/scim/v2`
5. Set **Authentication Mode** to **HTTP Header** with the SCIM token
6. Enable the desired provisioning features (Create, Update, Deactivate)

## SCIM + Team Management

SCIM-provisioned users and groups appear in LiteLLM's database. When using `LiteLLMTeam` CRDs alongside SCIM:

- Set `memberManagement: sso` to let SCIM handle all memberships
- Set `memberManagement: mixed` to add CRD-managed members alongside SCIM-provisioned ones

## Status

```yaml
status:
  scim:
    configured: true
    tokenSecretName: litellm-scim-token
```
