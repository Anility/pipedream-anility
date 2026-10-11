import errors from "../../common/errors.mjs";
import pipedriveApp from "../../pipedrive_v2.app.mjs";

export default {
  key: "fiable-pipedrive-get-person-v2",
  name: "Get Person V2 (Fiable)",
  description:
    "Returns the details of a person. Custom fields are returned under `custom_fields`, keyed by their field code (the long hash).",
  version: "0.0.2",
  type: "action",
  props: {
    pipedriveApp,
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
    },
  },
  async run({ $ }) {
    const { personId } = this;

    try {
      const person = await this.pipedriveApp.getPerson(personId);

      $.export(
        "$summary",
        `Successfully found person with id ${personId}`,
      );

      return person;
    } catch (error) {
      console.error(error);
      throw new Error(errors.message(error, "Failed to get person"));
    }
  },
};
