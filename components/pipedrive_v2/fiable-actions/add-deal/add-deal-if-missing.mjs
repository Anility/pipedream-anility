import errors from "../../common/errors.mjs";
import fields from "../../common/fields.mjs";
import pipedriveApp from "../../pipedrive_v2.app.mjs";

export default {
  key: "fiable-pipedrive-add-deal-v2",
  name: "Add Deal V2 (Fiable)",
  description: "Adds a new deal if missing. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#addDeal)",
  version: "0.0.3",
  type: "action",
  props: {
    pipedriveApp,
    title: {
      propDefinition: [
        pipedriveApp,
        "dealTitle",
      ],
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
    pipelineId: {
      propDefinition: [
        pipedriveApp,
        "pipelineId",
      ],
    },
    anilityIdFieldKey: {
      propDefinition: [
        pipedriveApp,
        "dealCustomFieldKey",
      ],
      description: "Anility Id custom field in Pipedrive",
    },
    anilityIdFieldValue: {
      type: "string",
      label: "AnilityId field value",
      description: "Anility Id custom field value in Pipedrive",
    },
    anilityCustomerIdFieldKey: {
      propDefinition: [
        pipedriveApp,
        "dealCustomFieldKey",
      ],
      description: "Customer Id custom field in Pipedrive",
    },
    anilityCustomerIdFieldValue: {
      type: "string",
      label: "CustomerId field key",
      description: "Pipedrive organization id  (value) for customer",
    },
    anilityOrderByIdFieldKey: {
      propDefinition: [
        pipedriveApp,
        "dealCustomFieldKey",
      ],
      description: "Order By Id custom field in Pipedrive",
    },
    anilityOrderByIdFieldValue: {
      type: "string",
      label: "Order By Id field key",
      description: "Pipedrive person id (value) who ordered the assessment",
    },
    anilityDelayRequestFieldKey: {
      propDefinition: [
        pipedriveApp,
        "dealCustomFieldKey",
      ],
      description: "Delay Request field in Pipedrive",
    },
    anilityDelayRequestFieldValue: {
      type: "string",
      label: "Delay Request field value",
      description: "Custom field to decide if the emails should be delayed",
    },
    anilityExpiryDateFieldKey: {
      propDefinition: [
        pipedriveApp,
        "dealCustomFieldKey",
      ],
      description: "Expiry date field in Pipedrive",
    },
    anilityExpiryDateFieldValue: {
      type: "string",
      label: "Expiry date field value",
      description: "Custom field to set the proposed expiry date",
    },
    label: {
      type: "string",
      label: "label",
      description: "Deal label",
    },
  },
  async run({ $ }) {
    const {
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
      pipelineId,
      anilityIdFieldKey,
      anilityIdFieldValue,
      anilityCustomerIdFieldKey,
      anilityCustomerIdFieldValue,
      anilityOrderByIdFieldKey,
      anilityOrderByIdFieldValue,
      anilityDelayRequestFieldKey,
      anilityDelayRequestFieldValue,
      anilityExpiryDateFieldKey,
      anilityExpiryDateFieldValue,
      label,
    } = this;

    try {
      const dealFields = await this.pipedriveApp.getAllFields(this.pipedriveApp.getDealFields);

      const searchResp = await this.pipedriveApp.searchDeals({
        term: anilityIdFieldValue,
        fields: "custom_fields",
        exact_match: true,
        limit: 1,
      });
      if (searchResp.data.items.length === 0) {
        // v2 has no add_time for deals: a deal's creation time is always the
        // time it's created (v1 let the workflow set it to the order date).
        const resp = await this.pipedriveApp.addDeal({
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
          pipeline_id: pipelineId,
          label_ids: fields.labelIds(dealFields, label),
          custom_fields: fields.customFields(dealFields, {
            [anilityIdFieldKey]: anilityIdFieldValue,
            [anilityCustomerIdFieldKey]: anilityCustomerIdFieldValue,
            [anilityOrderByIdFieldKey]: anilityOrderByIdFieldValue,
            [anilityDelayRequestFieldKey]: anilityDelayRequestFieldValue,
            [anilityExpiryDateFieldKey]: anilityExpiryDateFieldValue,
          }),
        });

        $.export("$summary", "Successfully added deal");

        return resp;
      }
      else {
        $.export("$summary", "Deal already exists");
        return {
          data: searchResp.data.items[0].item,
        };
      }

    } catch (error) {
      errors.log(error);
      throw new Error(errors.message(error, "Failed to add deal"));
    }
  },
};
