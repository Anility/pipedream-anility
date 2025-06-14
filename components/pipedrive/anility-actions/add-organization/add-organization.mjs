import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-add-organization",
  name: "Add Organization (Anility)",
  description: "Adds a new organization. See the Pipedrive API docs for Organizations [here](https://developers.pipedrive.com/docs/api/v1/Organizations#addOrganization)",
  version: "0.0.4",
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
      description: "Optional creation date & time of the organization in UTC. Requires admin user API token. Format: `YYYY-MM-DD HH:MM:SS`",
    },
    customFieldValue: {
      type: "string",
      label: "Custom field value",
      description: "Optional custom field value. The format is JSON like value that can be parsed in javascript",
    },
  },
  async run({ $ }) {
    const {
      name,
      ownerId,
      visibleTo,
      addTime,
      customFieldValue,
    } = this;

    try {
      const fieldValues = JSON.parse(customFieldValue);
      const resp =
        await this.pipedriveApp.addOrganization({
          name,
          owner_id: ownerId,
          visible_to: visibleTo,
          add_time: addTime,
          ...fieldValues,
        });

      $.export("$summary", "Successfully added organization");

      return resp;
    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to add organization";
    }
  },
};
