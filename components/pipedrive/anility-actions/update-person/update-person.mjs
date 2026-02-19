import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-update-person",
  name: "Update Person (Anility)",
  description: "Updates an existing person's details in Pipedrive. See the Pipedrive API docs for People [here](https://developers.pipedrive.com/docs/api/v1/Persons#updatePerson)",
  version: "0.0.2",
  type: "action",
  props: {
    pipedriveApp,
    personId: {
      type: "integer",
      label: "Person ID",
      description: "The ID of the person to update",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Person name",
      optional: true,
    },
    ownerId: {
      label: "Owner ID",
      description: "ID of the user who will be marked as the owner of this person.",
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      optional: true,
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "ID of the organization this person belongs to.",
      optional: true,
    },
    email: {
      type: "any",
      label: "Email",
      description: "Email addresses (one or more) associated with the person.",
      optional: true,
    },
    phone: {
      type: "any",
      label: "Phone",
      description: "Phone numbers (one or more) associated with the person.",
      optional: true,
    },
    visibleTo: {
      propDefinition: [
        pipedriveApp,
        "visibleTo",
      ],
      description: "Visibility of the person.",
      optional: true,
    },
    label: {
      type: "string",
      label: "Label",
      description: "Person label",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      personId,
      name,
      ownerId,
      organizationId,
      email,
      phone,
      visibleTo,
      label,
    } = this;

    try {
      // Helper to only include provided fields
      const updateData = Object.fromEntries(
        Object.entries({
          name,
          owner_id: ownerId,
          org_id: organizationId,
          email,
          phone,
          visible_to: visibleTo,
        }).filter((
          [
            ,
            value,
          ],
        ) => value !== undefined && value !== null),
      );

      // Handle label conversion if provided
      if (label !== undefined && label !== null) {
        const { data: stages } = await this.pipedriveApp.getPersonFields();
        const option = stages.find((stage) => stage.key === "label")
          ?.options.find((opt) => opt.label.toLowerCase() === label.toLowerCase());

        if (option) {
          updateData.label = option.id;
        }
      }

      if (Object.keys(updateData).length === 0) {
        $.export("$summary", "No fields to update, returning existing person data");
        return await this.pipedriveApp.getPerson(personId);
      }

      const resp = await this.pipedriveApp.updatePerson({
        id: personId,
        ...updateData,
      });

      $.export("$summary", "Successfully updated person");
      return resp;

    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to update person";
    }
  },
};
