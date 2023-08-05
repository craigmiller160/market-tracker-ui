#!/bin/sh

function import {
  terraform \
    import \
    -var="onepassword_token=$ONEPASSWORD_TOKEN"\
    "$1" "$2"
}

function plan {
  terraform plan \
    -var "onepassword_token=$ONEPASSWORD_TOKEN"
}

import "keycloak_openid_client.market_tracker_ui_dev" "apps-dev/d7278238-d9f1-42b3-ae37-692c96d45ca2"
import "keycloak_openid_client.market_tracker_ui_prod" "apps-prod/f798785b-3ed1-4312-89a1-78045ac49c6f"

plan
