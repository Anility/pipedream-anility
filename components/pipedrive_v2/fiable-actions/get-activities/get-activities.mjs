import errors from "../../common/errors.mjs";
import pipedriveApp from "../../pipedrive_v2.app.mjs";

// v1 had no way to filter activities by deal inline, so the old action rewrote
// a shared Pipedrive filter (by the deal's Anility Id custom field) on every run.
// v2 filters by deal_id directly: find the deal by its Anility Id, then fetch
// its activities. No filter is created or changed.
export default {
  key: "fiable-pipedrive-get-activities-v2",
  name: "Get Activities V2 (Fiable)",
  description:
    "Returns the activities of the deal with the given Anility Id. Activities are appointments/tasks/events on a calendar that can be associated with a deal, a lead, a person and an organization. See the Pipedrive API docs [here](https://developers.pipedrive.com/docs/api/v1/Activities#getActivities)",
  version: "0.0.2",
  type: "action",
  props: {
    pipedriveApp,
    anilityIdFieldValue: {
      type: "string",
      label: "AnilityId field value",
      description: "Anility Id custom field value of the deal in Pipedrive",
    },
    userId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      description: "Only return activities owned by this user. If omitted, activities of all users are returned.",
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
      anilityIdFieldValue,
      userId,
      cursor,
      limit,
    } = this;

    try {
      const searchResp = await this.pipedriveApp.searchDeals({
        term: anilityIdFieldValue,
        fields: "custom_fields",
        exact_match: true,
        limit: 1,
      });
      const deal = searchResp.data?.items?.[0]?.item;

      if (!deal) {
        $.export("$summary", "Deal does not exist");
        return {
          success: true,
          data: [],
          additional_data: {
            next_cursor: null,
          },
        };
      }

      const resp = await this.pipedriveApp.getActivities({
        deal_id: deal.id,
        // v1 treated user_id 0 as "all users"; v2 returns all users' when omitted
        owner_id: userId || undefined,
        cursor,
        limit,
      });

      $.export(
        "$summary",
        `Successfully found ${resp.data?.length || 0} activities`,
      );

      return resp;
    } catch (error) {
      console.error(error);
      throw new Error(errors.message(error, "Failed to get activities"));
    }
  },
};
