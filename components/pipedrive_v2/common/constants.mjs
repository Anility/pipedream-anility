const LAST_RESOURCE_PROPERTY = "lastResourceProperty";
const FILTER_ID = "filterId";
const FIELD_ID = "fieldId";
const DEFAULT_PAGE_LIMIT = 20; // max is 500 per page
const DEFAULT_MAX_ITEMS = DEFAULT_PAGE_LIMIT * 4;
const LAST_EXEC_DATE_TIME = "lastExecDataTime";

const STATUS_OPTIONS = [
  "open",
  "won",
  "lost",
  "deleted",
];

const FIELD_OPTIONS = [
  "custom_fields",
  "email",
  "notes",
  "phone",
  "name",
];

const FIELDS_PAGE_LIMIT = 500; // max page size of the v2 Fields APIs

// Request body fields that v2 requires as numbers
const NUMERIC_BODY_FIELDS = [
  "owner_id",
  "person_id",
  "org_id",
  "pipeline_id",
  "stage_id",
  "visible_to",
  "probability",
  "value",
];

// Pipedrive v2 rejects visible_to as a string
const VISIBLE_TO_OPTIONS = [
  {
    label: "Owner & followers (private)",
    value: 1,
  },
  {
    label: "Entire company (shared)",
    value: 3,
  },
];

const INCLUDE_FIELDS_OPTIONS = [
  "person.picture",
];

const EVENT_OBJECT = {
  ACTIVITY: "activity",
  ACTIVITY_TYPE: "activityType",
  DEAL: "deal",
  NOTE: "note",
  ORGANIZATION: "organization",
  PERSON: "person",
  PIPELINE: "pipeline",
  PRODUCT: "product",
  STAGE: "stage",
  USER: "user",
};

const FILTER_TYPE = {
  DEALS: "deals",
  LEADS: "leads",
  ORG: "org",
  PEOPLE: "people",
  PRODUCTS: "products",
  ACTIVITY: "activity",
};

const EVENT_ACTION = {
  ADDED: "added",
  UPDATED: "updated",
  MERGED: "merged",
  DELETED: "deleted",
};

const FIELD = {
  ADD_TIME: "add_time",
  UPDATE_TIME: "update_time",
  MARKED_AS_DONE_TIME: "marked_as_done_time",
};

export default {
  STATUS_OPTIONS,
  FIELD_OPTIONS,
  FIELDS_PAGE_LIMIT,
  NUMERIC_BODY_FIELDS,
  VISIBLE_TO_OPTIONS,
  INCLUDE_FIELDS_OPTIONS,
  LAST_RESOURCE_PROPERTY,
  LAST_EXEC_DATE_TIME,
  FILTER_ID,
  FIELD_ID,
  EVENT_OBJECT,
  EVENT_ACTION,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_MAX_ITEMS,
  FIELD,
  FILTER_TYPE,
};
