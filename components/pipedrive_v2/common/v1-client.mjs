import { v1 } from "pipedrive@33.5.0";

// Pipedrive has no v2 endpoints for Users or Mailbox. Every Pipedrive v1 call
// in pipedrive_v2 goes through this file and nowhere else, so it's the one
// place to retire once Pipedrive ships v2 equivalents.
function api($auth, model) {
  const config = new v1.Configuration({
    accessToken: $auth.oauth_access_token,
    basePath: $auth.api_domain
      ? `${$auth.api_domain}/api/v1`
      : undefined,
  });
  return new v1[model](config);
}

export default {
  getUser($auth, id) {
    return api($auth, "UsersApi").getUser({
      id,
    });
  },
  getUsers($auth) {
    return api($auth, "UsersApi").getUsers();
  },
  getMailThreads($auth, opts = {}) {
    return api($auth, "MailboxApi").getMailThreads(opts);
  },
};
