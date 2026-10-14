import errors from "../../common/errors.mjs";
import fields from "../../common/fields.mjs";
import pipedriveApp from "../../pipedrive_v2.app.mjs";

export default {
  key: "fiable-pipedrive-add-organization-if-missing-v2",
  name: "Add Organization V2 (Fiable)",
  description: "Adds a new organization. See the Pipedrive API docs for Organizations [here](https://developers.pipedrive.com/docs/api/v1/Organizations#addOrganization)",
  version: "0.0.3",
  type: "action",
  props: {
    pipedriveApp,
    name: {
      type: "string",
      label: "Name",
      description: "Organization name",
    },
    ownerId: {
      label: "Owner ID",
      description: "ID of the user who will be marked as the owner of this organization. When omitted, the authorized user ID will be used.",
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
    },
    visibleTo: {
      propDefinition: [
        pipedriveApp,
        "visibleTo",
      ],
      description: "Visibility of the organization. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.",
    },
    addTime: {
      propDefinition: [
        pipedriveApp,
        "addTime",
      ],
      description: "Optional creation date & time of the organization in UTC, in RFC 3339 format, e.g. `2024-07-01T05:46:33Z`. Requires admin user API token.",
    },
    anilityIdFieldKey: {
      propDefinition: [
        pipedriveApp,
        "orgCustomFieldKey",
      ],
      description: "Anility Id custom field in Pipedrive",
    },
    anilityIdFieldValue: {
      type: "string",
      label: "AnilityId field value",
      description: "Anility Id custom field value in Pipedrive",
    },
    label: {
      type: "string",
      label: "label",
      description: "Organization label",
    },
  },
  async run({ $ }) {
    const {
      name,
      ownerId,
      visibleTo,
      addTime,
      anilityIdFieldKey,
      anilityIdFieldValue,
      label,
    } = this;

    try {
      const orgFields = await this.pipedriveApp
        .getAllFields(this.pipedriveApp.getOrganizationFields);

      const searchResp = await this.pipedriveApp.searchOrganization({
        term: anilityIdFieldValue,
        fields: "custom_fields",
        exact_match: true,
        limit: 1,
      });
      if (searchResp.data.items.length === 0) {
        const resp = await this.pipedriveApp.addOrganization({
          name,
          owner_id: ownerId,
          visible_to: visibleTo,
          add_time: addTime,
          label_ids: fields.labelIds(orgFields, label, {
            exact: true,
          }),
          custom_fields: fields.customFields(orgFields, {
            [anilityIdFieldKey]: anilityIdFieldValue,
          }),
        });
        $.export("$summary", "Successfully added organization");
        return resp;
      }
      else {
        $.export("$summary", "Organization already exists");
        return {
          data: searchResp.data.items[0].item,
        };
      }

    } catch (error) {
      errors.log(error);
      throw new Error(errors.message(error, "Failed to add organization"));
    }
  },
};
