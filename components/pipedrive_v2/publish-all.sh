#!/usr/bin/env bash
# Publishes every V2 action to the Pipedream workspace of the active `pd` profile.
# Run `pd whoami` first and confirm the workspace is ahmad-anility.
set -euo pipefail
cd "$(dirname "$0")"

# Pipedream installs the SDK version named in the import, not package.json.
# Refuse to publish until the app file is on the v2 SDK.
if ! grep -q 'from "pipedrive@33.5.0"' pipedrive_v2.app.mjs; then
  echo "pipedrive_v2.app.mjs does not import pipedrive@33.5.0 yet; not publishing." >&2
  exit 1
fi

pd publish ./fiable-actions/search-deals/search-deals.mjs
pd publish ./fiable-actions/add-organization/add-organization-if-missing.mjs
pd publish ./fiable-actions/add-person/add-person-if-missing.mjs
pd publish ./fiable-actions/update-deal/update-deal.mjs
pd publish ./fiable-actions/add-deal/add-deal-if-missing.mjs
pd publish ./fiable-actions/update-deal/update-watchers.mjs
pd publish ./fiable-actions/search-organization/search-organization.mjs
pd publish ./fiable-actions/update-organization/update-organization.mjs
pd publish ./fiable-actions/get-activities/get-activities.mjs
pd publish ./fiable-actions/get-person/get-person.mjs
pd publish ./fiable-actions/get-user/get-user.mjs
pd publish ./fiable-actions/get-mailthreads/get-mailthreads.mjs
