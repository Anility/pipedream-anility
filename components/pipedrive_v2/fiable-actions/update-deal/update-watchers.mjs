import errors from "../../common/errors.mjs";
import fields from "../../common/fields.mjs";
import pipedriveApp from "../../pipedrive_v2.app.mjs";

export default {
  key: "fiable-pipedrive-update-deal-watchers-v2",
  name: "Update Deal Watchers V2 (Fiable)",
  description: "Updates the watchers properties of a deal. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal)",
  version: "0.0.3",
  type: "action",
  props: {
    pipedriveApp,
    dealId: {
      description: "ID of the deal",
      optional: false,
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
    },
    anilityIdFieldKey: {
      propDefinition: [
        pipedriveApp,
        "personCustomFieldKey",
      ],
      description: "Anility Id custom field in Pipedrive",
    },
    watcherFieldKeys: {
      type: "string",
      label: "Watcher field keys",
      description: "Watcher field keys in Pipedrive (comma separated)",
    },
    watchersPeople: {
      type: "string",
      label: "Watchers delimited information",
      description: "Watcher person in Pipedrive (JSON array string)",
    },
    label: {
      type: "string",
      label: "label",
      description: "Person label",
    },
  },
  methods: {
    async getOrAddPersonWatcher(
      anilityIdFieldKey,
      anilityIdFieldValue,
      organizationId,
      email,
      name,
      label,
    ) {
      const personFields = await this.pipedriveApp.getAllFields(this.pipedriveApp.getPersonFields);

      const searchResp = await this.pipedriveApp.searchPersons({
        term: anilityIdFieldValue,
        fields: "custom_fields",
        exact_match: true,
        organization_id: organizationId,
        limit: 1,
      });
      if (searchResp.data.items.length === 0) {
        const resp = await this.pipedriveApp.addPerson({
          name,
          org_id: organizationId,
          emails: fields.contactList(email),
          label_ids: fields.labelIds(personFields, label),
          custom_fields: fields.customFields(personFields, {
            [anilityIdFieldKey]: anilityIdFieldValue,
          }),
        });

        return resp.data.id;
      }
      else {
        return searchResp.data.items[0].item.id;
      }
    },
  },
  async run({ $ }) {
    const {
      dealId,
      organizationId,
      watcherFieldKeys,
      watchersPeople,
      getOrAddPersonWatcher,
      anilityIdFieldKey,
      label,
    } = this;

    try {
      const customField = {};

      const watcherFieldKeysArray = watcherFieldKeys.split(",");
      const watchersPeopleArray = JSON.parse(watchersPeople);
      for (let i = 0; i < watcherFieldKeysArray.length; i++) {
        var personId = null;
        if (i < watchersPeopleArray.length) {
          const anilityIdFieldValue = watchersPeopleArray[i].anilityId;
          const email = watchersPeopleArray[i].email;
          const name = watchersPeopleArray[i].name;

          personId = await getOrAddPersonWatcher(
            anilityIdFieldKey,
            anilityIdFieldValue,
            organizationId,
            email,
            name,
            label,
          );
        }
        customField[watcherFieldKeysArray[i]] = personId;
      }
      await this.pipedriveApp.updateDeal({
        dealId,
        custom_fields: customField,
      });

      $.export("$summary", customField);

    } catch (error) {
      errors.log(error);
      throw new Error(errors.message(error, "Failed to update deal"));
    }
  },
};
