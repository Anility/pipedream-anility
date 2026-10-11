import { v2 } from "pipedrive@33.5.0";
import constants from "./common/constants.mjs";
import v1Client from "./common/v1-client.mjs";

export default {
  type: "app",
  app: "pipedrive",
  propDefinitions: {
    userId: {
      type: "integer",
      label: "User ID",
      description: "ID of the user who will be marked as the owner of this deal. If omitted, the authorized user ID will be used.",
      optional: true,
      async options() {
        const { data: users } = await this.getUsers();
        return users.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    personId: {
      type: "integer",
      label: "Person ID",
      description: "ID of the person this deal will be associated with",
      optional: true,
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          resourceFn: this.getPersons,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
    organizationId: {
      type: "integer",
      label: "Organization ID",
      description: "ID of the organization this deal will be associated with",
      optional: true,
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          resourceFn: this.getOrganizations,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
    probability: {
      type: "integer",
      label: "Probability",
      description: "Deal success probability percentage. Used/shown only when `deal_probability` for the pipeline of the deal is enabled.",
      optional: true,
    },
    lostReason: {
      type: "string",
      label: "Lost Reason",
      description: "Optional message about why the deal was lost (to be used when status=lost)",
      optional: true,
    },
    visibleTo: {
      type: "integer",
      label: "Visible To",
      description: "Visibility of the deal. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.",
      optional: true,
      options: constants.VISIBLE_TO_OPTIONS,
    },
    addTime: {
      type: "string",
      label: "Add Time",
      description: "Optional creation date & time in UTC, in RFC 3339 format, e.g. `2024-07-01T05:46:33Z`. Requires admin user API token.",
      optional: true,
    },
    dealTitle: {
      type: "string",
      label: "Title",
      description: "Deal title",
    },
    dealValue: {
      type: "string",
      label: "Value",
      description: "Value of the deal. If omitted, value will be set to 0.",
      optional: true,
    },
    dealCurrency: {
      type: "string",
      label: "Currency",
      description: "Currency of the deal. Accepts a 3-character currency code. If omitted, currency will be set to the default currency of the authorized user.",
      optional: true,
    },
    stageId: {
      type: "integer",
      label: "Stage ID",
      description: "ID of the stage this deal will be placed in a pipeline (note that you can't supply the ID of the pipeline as this will be assigned automatically based on `stage_id`). If omitted, the deal will be placed in the first stage of the default pipeline.",
      optional: true,
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          resourceFn: this.getStages,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
    pipelineId: {
      type: "integer",
      label: "Pipeline ID",
      description: "ID of the pipeline this deal will be placed in. If omitted, the deal will be placed in the first stage of the default pipeline.",
      optional: true,
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          resourceFn: this.getPipelines,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "open = Open, won = Won, lost = Lost, deleted = Deleted. If omitted, status will be set to open.",
      optional: true,
      options: constants.STATUS_OPTIONS,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor. Use `additional_data.next_cursor` from a previous response to get the next page.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Items shown per page.",
      optional: true,
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "ID of the deal this activity will be associated with",
      optional: true,
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          resourceFn: this.getDeals,
          mapper: ({
            id, title,
          }) => ({
            label: title,
            value: id,
          }),
        });
      },
    },
    orgCustomFieldKey: {
      type: "string",
      label: "Custom Field Key",
      description: "Key of the custom field for organization in Pipedrive",
      optional: true,
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          resourceFn: this.getOrganizationFields,
          mapper: this.fieldOption,
          limit: constants.FIELDS_PAGE_LIMIT,
        });
      },
    },
    personCustomFieldKey: {
      type: "string",
      label: "Custom Field Key",
      description: "Key of the custom field for person in Pipedrive",
      optional: true,
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          resourceFn: this.getPersonFields,
          mapper: this.fieldOption,
          limit: constants.FIELDS_PAGE_LIMIT,
        });
      },
    },
    dealCustomFieldKey: {
      type: "string",
      label: "Anility Id Field Key",
      description: "Key of the custom field for deal in Pipedrive",
      optional: true,
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          resourceFn: this.getDealFields,
          mapper: this.fieldOption,
          limit: constants.FIELDS_PAGE_LIMIT,
        });
      },
    },
  },
  methods: {
    api(model) {
      const config = new v2.Configuration({
        accessToken: this.$auth.oauth_access_token,
        basePath: this.$auth.api_domain
          ? `${this.$auth.api_domain}/api/v2`
          : undefined,
      });
      return new v2[model](config);
    },
    fieldOption({
      field_code: key, field_name: name,
    }) {
      return {
        label: name,
        value: key,
      };
    },
    async paginateOptions({
      prevContext, resourceFn, mapper, limit = constants.DEFAULT_PAGE_LIMIT,
    }) {
      if (prevContext?.cursor === false) {
        return [];
      }
      const {
        data,
        additional_data: additionalData,
      } = await resourceFn.call(this, {
        cursor: prevContext?.cursor,
        limit,
      });
      return {
        options: (data || []).map(mapper),
        context: {
          cursor: additionalData?.next_cursor || false,
        },
      };
    },
    // v2 rejects ids sent as strings ("must be integer"), and workflow
    // expressions like {{steps.x.$return_value.data.id}} can produce strings.
    numericIds(data) {
      const result = {
        ...data,
      };
      for (const key of constants.NUMERIC_BODY_FIELDS) {
        if (result[key] === "") {
          // An empty expression result means "not set"
          result[key] = undefined;
        } else if (result[key] !== undefined && result[key] !== null) {
          const number = Number(result[key]);
          if (Number.isNaN(number)) {
            throw new Error(`${key} must be a number, got "${result[key]}"`);
          }
          result[key] = number;
        }
      }
      return result;
    },
    addDeal(data = {}) {
      return this.api("DealsApi").addDeal({
        AddDealRequest: this.numericIds(data),
      });
    },
    updateDeal({
      dealId, ...data
    } = {}) {
      return this.api("DealsApi").updateDeal({
        id: dealId,
        UpdateDealRequest: this.numericIds(data),
      });
    },
    getDeals(opts = {}) {
      return this.api("DealsApi").getDeals(opts);
    },
    searchDeals(opts = {}) {
      return this.api("DealsApi").searchDeals(opts);
    },
    addOrganization(data = {}) {
      return this.api("OrganizationsApi").addOrganization({
        AddOrganizationRequest: this.numericIds(data),
      });
    },
    updateOrganization({
      organizationId, ...data
    } = {}) {
      return this.api("OrganizationsApi").updateOrganization({
        id: organizationId,
        UpdateOrganizationRequest: this.numericIds(data),
      });
    },
    getOrganizations(opts = {}) {
      return this.api("OrganizationsApi").getOrganizations(opts);
    },
    searchOrganization(opts = {}) {
      return this.api("OrganizationsApi").searchOrganization(opts);
    },
    addPerson(data = {}) {
      return this.api("PersonsApi").addPerson({
        AddPersonRequest: this.numericIds(data),
      });
    },
    getPerson(id) {
      return this.api("PersonsApi").getPerson({
        id,
      });
    },
    getPersons(opts = {}) {
      return this.api("PersonsApi").getPersons(opts);
    },
    searchPersons(opts = {}) {
      return this.api("PersonsApi").searchPersons(opts);
    },
    getActivities(opts = {}) {
      return this.api("ActivitiesApi").getActivities(opts);
    },
    getStages(opts = {}) {
      return this.api("StagesApi").getStages(opts);
    },
    getPipelines(opts = {}) {
      return this.api("PipelinesApi").getPipelines(opts);
    },
    getDealFields(opts = {}) {
      return this.api("DealFieldsApi").getDealFields(opts);
    },
    getPersonFields(opts = {}) {
      return this.api("PersonFieldsApi").getPersonFields(opts);
    },
    getOrganizationFields(opts = {}) {
      return this.api("OrganizationFieldsApi").getOrganizationFields(opts);
    },
    getActivityFields(opts = {}) {
      return this.api("ActivityFieldsApi").getActivityFields(opts);
    },
    // Pipedrive v1 only; see common/v1-client.mjs
    getUser(id) {
      return v1Client.getUser(this.$auth, id);
    },
    getUsers() {
      return v1Client.getUsers(this.$auth);
    },
    getMailThreads(folder, opts = {}) {
      return v1Client.getMailThreads(this.$auth, {
        folder,
        ...opts,
      });
    },
    // Every field definition for a resource (deal, person, organization),
    // following v2's cursor pagination. Used to convert custom field values.
    async getAllFields(resourceFn) {
      const fields = [];
      for await (const field of this.getResourcesStream({
        resourceFn,
        limit: constants.FIELDS_PAGE_LIMIT,
        max: Infinity,
      })) {
        fields.push(field);
      }
      return fields;
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      limit = constants.DEFAULT_PAGE_LIMIT,
      max = constants.DEFAULT_MAX_ITEMS,
    }) {
      let cursor;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn.call(this, {
            ...resourceFnArgs,
            limit,
            cursor,
          });

        const nextResources = response?.data || [];
        cursor = response?.additional_data?.next_cursor;

        if (!nextResources.length) {
          console.log("No more records to fetch.");
          return;
        }

        for (const resource of nextResources) {
          resourcesCount += 1;
          yield resource;
        }

        if (!cursor || resourcesCount >= max) {
          return;
        }
      }
    },
  },
};
