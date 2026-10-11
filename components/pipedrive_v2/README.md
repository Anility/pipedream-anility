# Pipedrive V2 (Fiable)

Fiable's custom Pipedrive actions on Pipedrive API v2. Ticket: [AM-11724](https://fiable.atlassian.net/browse/AM-11724).

This folder replaces `components/pipedrive/anility-actions/` for new and cloned workflows. It is fully separate from `components/pipedrive/`, which stays unchanged so existing workflows keep running the action versions they pin.

## Rules

- **SDK version:** Pipedream installs the version named in the import (`pipedrive@33.5.0` in `pipedrive_v2.app.mjs`), not the one in `package.json`. Keep both in sync.
- **App slug:** `pipedrive_v2.app.mjs` declares `app: "pipedrive"`, so the actions use the existing Pipedrive connected account.
- **Pipedrive v1:** everything uses v2 except calls Pipedrive has no v2 endpoint for (Users, Mailbox). Those live in one separate v1 file and nowhere else.
- **Naming:** keys are `fiable-pipedrive-<action>-v2`, display names are `<Action> V2 (Fiable)`. Never reuse an `anility-pipedrive-*` or bare `fiable-pipedrive-*` key.
- **Versions:** bump an action's `version` every time you publish a change to it.

## Publishing

```sh
pd whoami          # workspace must be ahmad-anility
./publish-all.sh   # or: pd publish ./fiable-actions/<folder>/<file>.mjs
```
