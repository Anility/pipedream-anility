import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-add-deal",
  name: "Add Deal if missing (Anility)",
  description: "Adds a new deal if missing. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#addDeal)",
  version: "0.0.10",
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
    addTime: {
      propDefinition: [
        pipedriveApp,
        "addTime",
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
      addTime,
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

    const { data: stages } = await this.pipedriveApp.getDealFields();
    const option = stages.find((stage) => stage.key === "label")
      .options.find((option) => option.label.toLowerCase() === label.toLowerCase());

    let labelValue = {};
    if (option) {
      labelValue["label"] = [
        option.id,
      ];
    }

    try {
      const searchResp = await this.pipedriveApp.searchDeals({
        term: anilityIdFieldValue,
        fields: "custom_fields",
        exact_match: true,
        start: 0,
        limit: 1,
      });
      if (searchResp.data.items.length === 0) {
        let customFieldValue = {};
        customFieldValue[anilityIdFieldKey] = anilityIdFieldValue;
        customFieldValue[anilityCustomerIdFieldKey] = anilityCustomerIdFieldValue;
        customFieldValue[anilityOrderByIdFieldKey] = anilityOrderByIdFieldValue;
        customFieldValue[anilityDelayRequestFieldKey] = anilityDelayRequestFieldValue;
        customFieldValue[anilityExpiryDateFieldKey] = anilityExpiryDateFieldValue;
        const resp = await this.pipedriveApp.addDeal({
          title,
          value,
          currency,
          user_id: userId,
          person_id: personId,
          org_id: organizationId,
          stage_id: stageId,
          status,
          probability,
          lost_reason: lostReason,
          visible_to: visibleTo,
          add_time: addTime,
          pipeline_id: pipelineId,
          ...customFieldValue,
          ...labelValue,
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
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to add deal";
    }
  },
};
