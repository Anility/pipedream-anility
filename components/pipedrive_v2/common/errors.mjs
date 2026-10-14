// The SDK rejects with Pipedrive's response body ({ success, error, error_info })
// for API errors, and with the raw axios error otherwise (network, timeouts).
export default {
  message(error, fallback) {
    if (error?.error) {
      return error.error_info
        ? `${error.error} (${error.error_info})`
        : error.error;
    }
    return error?.message || fallback;
  },
  // Never log the raw axios error: its config holds the request headers,
  // including the bearer token.
  log(error) {
    console.error(error?.error
      ? error
      : error?.message ?? error);
  },
};
