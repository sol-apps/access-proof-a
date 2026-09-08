/// <reference path="../../pb_data/types.d.ts" />
/*
 * lib/proof.js — the one place the two protected routes work out who is calling.
 *
 * Required INSIDE each handler (handlers run in isolated pooled VMs, so nothing at
 * the top level of main.pb.js reaches them).
 */

/**
 * The calling person's role in this app, or null if there is no app user behind the
 * request.
 *
 * Read from the request's own auth record, which PocketBase resolves from the signed
 * token — never from a header, query parameter or body the browser chose. `role`
 * itself is written server-side from the identity provider's claim on every login
 * (pb_hooks/identity.pb.js) and the users update rule forbids anyone setting their
 * own, so branching on it here is safe.
 *
 * A token from any other auth collection (a superuser, say) is not a user of this
 * app and gets null rather than being waved through: being an operator of the server
 * is not the same grant as being an admin of this app.
 */
function callerRole(e) {
  const record = e.auth;
  if (!record) return null;
  if (record.collection().name !== "users") return null;
  return record.getString("role") === "admin" ? "admin" : "user";
}

module.exports = { callerRole };
