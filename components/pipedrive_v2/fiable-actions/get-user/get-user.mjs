import pipedriveApp from "../../pipedrive_v2.app.mjs";

export default {
  key: "fiable-pipedrive-get-user-v2",
  name: "Get User V2 (Fiable)",
  description: "Returns data about a specific user within the company.",
  version: "0.0.1",
  type: "action",
  props: {
    pipedriveApp,
    userId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const { userId } = this;

    const user = await this.pipedriveApp.getUser(userId);

    try {
      $.export("$summary", `Successfully found user with id ${userId}`);

      return user;
    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to get user";
    }
  },
};
