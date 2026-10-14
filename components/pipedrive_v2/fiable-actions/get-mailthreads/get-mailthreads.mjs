import errors from "../../common/errors.mjs";
import pipedriveApp from "../../pipedrive_v2.app.mjs";

// Pipedrive has no v2 Mailbox API; this runs on v1 through common/v1-client.mjs,
// which is why it still paginates with `start` instead of `cursor`.
export default {
  key: "fiable-pipedrive-get-mail-threads-v2",
  name: "Get Mail Threads V2 (Fiable)",
  description:
    "Returns mail threads in a specified folder ordered by the most recent message within.",
  version: "0.0.3",
  type: "action",
  props: {
    pipedriveApp,
    folder: {
      type: "string",
      label: "The type of folder to fetch",
      description: "The type of folder to fetch (inbox, sent, drafts, archive)",
    },
    start: {
      type: "integer",
      label: "Pagination start",
      description: "Pagination start",
      optional: true,
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
      folder, start, limit,
    } = this;

    try {
      const threads = await this.pipedriveApp.getMailThreads(folder, {
        start,
        limit,
      });

      $.export("$summary", `Successfully found mail threads in ${folder}`);

      return threads;
    } catch (error) {
      errors.log(error);
      throw new Error(errors.message(error, "Failed to get mail threads"));
    }
  },
};
