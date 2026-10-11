import constants from "../../common/constants.mjs";
import errors from "../../common/errors.mjs";
import pipedriveApp from "../../pipedrive_v2.app.mjs";

export default {
  key: "fiable-pipedrive-search-deals-v2",
  name: "Search Deals V2 (Fiable)",
  description: "Searches all deals by title, notes and/or custom fields. Found deals can be filtered by Person ID and Organization ID. See the Pipedrive API docs [here](https://developers.pipedrive.com/docs/api/v1/Deals#searchDeals)",
  version: "0.0.3",
  type: "action",
  props: {
    pipedriveApp,
    term: {
      type: "string",
      label: "Search term",
      description: "The search term to look for. Minimum 2 characters (or 1 if using exact_match).",
    },
    fields: {
      type: "string",
      label: "Search field",
      description: "The field to perform the search from. Defaults to all of them. Only the following custom field types are searchable: address, varchar, text, varchar_auto, double, monetary and phone.",
      optional: true,
      options: constants.DEAL_SEARCH_FIELD_OPTIONS,
    },
    exactMatch: {
      type: "boolean",
      label: "Exact match",
      description: "When enabled, only full exact matches against the given term are returned. It is not case sensitive.",
      optional: true,
    },
    cursor: {
      propDefinition: [
        pipedriveApp,
        "cursor",
      ],
    },
    limit: {
      propDefinition: [
        pipedriveApp,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      term,
      fields,
      exactMatch,
      cursor,
      limit,
    } = this;

    try {
      const resp =
        await this.pipedriveApp.searchDeals({
          term,
          fields,
          exact_match: exactMatch,
          cursor,
          limit,
        });

      $.export("$summary", `Successfully found ${resp.data?.items.length || 0} deals`);

      return resp;

    } catch (error) {
      console.error(error);
      throw new Error(errors.message(error, "Failed to search deals"));
    }
  },
};
