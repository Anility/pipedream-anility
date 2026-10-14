import errors from "../../common/errors.mjs";
import pipedriveApp from "../../pipedrive_v2.app.mjs";

export default {
  key: "fiable-pipedrive-get-user-v2",
  name: "Get User V2 (Fiable)",
  description: "Returns data about a specific user within the company.",
  version: "0.0.4",
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

    try {
      const user = await this.pipedriveApp.getUser(userId);

      $.export("$summary", `Successfully found user with id ${userId}`);

      return user;
    } catch (error) {
      errors.log(error);
      throw new Error(errors.message(error, "Failed to get user"));
    }
  },
};
