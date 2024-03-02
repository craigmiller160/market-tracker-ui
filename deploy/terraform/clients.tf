data "keycloak_realm" "apps_dev" {
  realm = "apps-dev"
}

data "keycloak_realm" "apps_prod" {
  realm = "apps-prod"
}

locals {
  client_common = {
    client_id = "market-tracker-ui"
    name = "market-tracker-ui"
    enabled = true
    access_type = "PUBLIC"
    standard_flow_enabled = true
  }
}

resource "keycloak_openid_client" "market_tracker_ui_dev" {
  realm_id = data.keycloak_realm.apps_dev.id
  client_id = local.client_common.client_id
  name = local.client_common.name
  enabled = local.client_common.enabled
  access_type = local.client_common.access_type
  standard_flow_enabled = local.client_common.standard_flow_enabled
  valid_redirect_uris = [
    "https://localhost:3000/*"
  ]
  valid_post_logout_redirect_uris = [
    "https://localhost:3000/*"
  ]
  web_origins = [
    "https://localhost:3000"
  ]
}

resource "keycloak_openid_client" "market_tracker_ui_prod" {
  realm_id = data.keycloak_realm.apps_prod.id
  client_id = local.client_common.client_id
  name = local.client_common.name
  enabled = local.client_common.enabled
  access_type = local.client_common.access_type
  standard_flow_enabled = local.client_common.standard_flow_enabled
  valid_redirect_uris = [
    "https://market-tracker.craigmiller160.us/*"
  ]
  valid_post_logout_redirect_uris = [
    "https://market-tracker.craigmiller160.us/*"
  ]
  web_origins = [
    "https://market-tracker.craigmiller160.us"
  ]
}