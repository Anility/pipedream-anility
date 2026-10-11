import errors from "../../common/errors.mjs";
import fields from "../../common/fields.mjs";
import pipedriveApp from "../../pipedrive_v2.app.mjs";

export default {
  key: "fiable-pipedrive-update-organization-v2",
  name: "Update Organization V2 (Fiable)",
  description: "Updates a custom field of the organization with the given Anility Id. See the Pipedrive API docs for Organizations [here](https://developers.pipedrive.com/docs/api/v1/Organizations#updateOrganization)",
  version: "0.0.2",
  type: "action",
  props: {
    pipedriveApp,
    anilityIdFieldValue: {
      type: "string",
      label: "AnilityId field value",
      description: "Anility Id custom field value in Pipedrive",
    },
    customFieldKey: {
      propDefinition: [
        pipedriveApp,
        "orgCustomFieldKey",
      ],
      description: "Custom field in Pipedrive",
    },
    customFieldValue: {
      type: "string",
      label: "Custom field value",
      description: "Anility Id custom field value in Pipedrive",
    },
  },
  async run({ $ }) {
    const {
      anilityIdFieldValue,
      customFieldKey,
      customFieldValue,
    } = this;

    try {
      const searchResp = await this.pipedriveApp.searchOrganization({
        term: anilityIdFieldValue,
        fields: "custom_fields",
        exact_match: true,
        limit: 1,
      });
      if (searchResp.data.items.length === 0) {
        $.export("$summary", "Organization does not exist");
        return searchResp;
      }
      else {
        const orgFields = await this.pipedriveApp.getAllFields(this.pipedriveApp.getOrganizationFields);
        await this.pipedriveApp.updateOrganization({
          organizationId: searchResp.data.items[0].item.id,
          custom_fields: fields.customFields(orgFields, {
            [customFieldKey]: customFieldValue,
          }),
        });
        $.export("$summary", "Successfully updated organization");
        return {
          data: searchResp.data.items[0].item,
        };
      }

    } catch (error) {
      console.error(error);
      throw new Error(errors.message(error, "Failed to update organization"));
    }
  },
};
