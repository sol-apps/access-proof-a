/// <reference path="../pb_data/types.d.ts" />
/*
 * main.pb.js — server-side hooks for access-proof-a. THIS FILE RUNS ON THE SERVER.
 *
 * Two read-only routes, and nothing else. Both return fixed invented text: neither
 * echoes anything about the caller, neither reads or writes a collection, and neither
 * records who called. The refusals are the point of the app, so they happen here
 * rather than in the browser, where they would be decoration.
 *
 * Handlers run in isolated pooled VMs, so the shared role check is required inside
 * each one from lib/proof.js.
 */

// Any authenticated user of this app may read this. Unauthenticated callers are
// refused by the server, whatever the page in front of it does.
routerAdd("GET", "/api/proof/message", (e) => {
  const proof = require(__hooks + "/lib/proof.js");

  if (!proof.callerRole(e)) {
    return e.json(401, {
      error: "sign in to read the protected example message",
    });
  }

  return e.json(200, {
    message: "Demonstration crate SC-1180 cleared the imaginary quarantine bay at 09:14. Invented content, no real consignment exists.",
    audience: "any signed-in user of this app",
  });
});

// Admins of this app only. Ordinary users get 403 and unauthenticated callers 401,
// and the difference between the two is decided by the server-set role on the auth
// record, not by anything the request carries.
routerAdd("GET", "/api/proof/admin", (e) => {
  const proof = require(__hooks + "/lib/proof.js");
  const role = proof.callerRole(e);

  if (!role) {
    return e.json(401, {
      error: "sign in to read the admin-only example message",
    });
  }
  if (role !== "admin") {
    return e.json(403, {
      error: "this example message is for admins of this app only",
    });
  }

  return e.json(200, {
    message: "Demonstration rota: the imaginary night shift is two people short on Thursday. Invented content, no real rota exists.",
    audience: "admins of this app only",
  });
});
