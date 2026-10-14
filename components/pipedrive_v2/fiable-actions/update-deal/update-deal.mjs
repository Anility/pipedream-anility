import errors from "../../common/errors.mjs";
import fields from "../../common/fields.mjs";
import pipedriveApp from "../../pipedrive_v2.app.mjs";

export default {
  key: "fiable-pipedrive-update-deal-v2",
  name: "Update Deal V2 (Fiable)",
  description: "Updates the properties of a deal. With optional custom field. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal)",
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
    title: {
      propDefinition: [
        pipedriveApp,
        "dealTitle",
      ],
      optional: true,
    },
    value: {
      propDefinition: [
        pipedriveApp,
        "dealValue",
      ],
    },
    currency: {
      propDefinition: [
        pipedriveApp,
        "dealCurrency",
      ],
    },
    userId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
    },
    stageId: {
      propDefinition: [
        pipedriveApp,
        "stageId",
      ],
    },
    status: {
      propDefinition: [
        pipedriveApp,
        "status",
      ],
    },
    probability: {
      propDefinition: [
        pipedriveApp,
        "probability",
      ],
    },
    lostReason: {
      propDefinition: [
        pipedriveApp,
        "lostReason",
      ],
    },
    visibleTo: {
      propDefinition: [
        pipedriveApp,
        "visibleTo",
      ],
    },
    customFieldKey: {
      propDefinition: [
        pipedriveApp,
        "dealCustomFieldKey",
      ],
      label: "Custom field key",
      description: "Custom field in Pipedrive",
    },
    customFieldValue: {
      type: "string",
      label: "Custom field value",
      description: "Custom field value",
    },

  },
  async run({ $ }) {
    const {
      dealId,
      title,
      value,
      currency,
      userId,
      personId,
      organizationId,
      stageId,
      status,
      probability,
      lostReason,
      visibleTo,
      customFieldKey,
      customFieldValue,
    } = this;

    try {
      const customFields = customFieldKey
        ? fields.customFields(
          await this.pipedriveApp.getAllFields(this.pipedriveApp.getDealFields),
          {
            [customFieldKey]: customFieldValue,
          },
        )
        : undefined;

      const resp =
        await this.pipedriveApp.updateDeal({
          dealId,
          title,
          value,
          currency,
          owner_id: userId,
          person_id: personId,
          org_id: organizationId,
          stage_id: stageId,
          status,
          probability,
          lost_reason: lostReason,
          visible_to: visibleTo,
          custom_fields: customFields,
        });

      $.export("$summary", "Successfully updated deal");

      return resp;

    } catch (error) {
      errors.log(error);
      throw new Error(errors.message(error, "Failed to update deal"));
    }
  },
};
