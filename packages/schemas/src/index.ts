import { initContract } from "@ts-rest/core";
import { membersContract } from "./members.schema.js";
import { inventoryContract } from "./inventory.schema.js";
import { transactionsContract } from "./transactions.schema.js";
import { treasuriesContract } from "./treasuries.schema.js";
import { builderContract } from "./builder.schema.js";
import { postsContract } from "./posts.schema.js";
import { optionsContract } from "./options.schema.js";
import { websitesContract } from "./websites.schema.js";
import { churchesContract } from "./churches.schema.js";
import { dashboardContract } from "./dashboard.schema.js";
import { usersContract } from "./users.schema.js";
import { permissionsContract } from "./permissions.schema.js";
import { paymentsContract } from "./payments.schema.js";
import { certificatesContract } from "./certificates.schema.js";
import { presentationsContract } from "./presentations.schema.js";

export * from "./members.schema.js";
export * from "./transactions.schema.js";
export * from "./payments.schema.js";
export * from "./users.schema.js";
export * from "./posts.schema.js";
export * from "./websites.schema.js";
export * from "./builder.schema.js";
export * from "./classes.schema.js";
export * from "./inventory.schema.js";
export * from "./permissions.schema.js";
export * from "./churches.schema.js";
export * from "./treasuries.schema.js";
export * from "./certificates.schema.js";
export * from "./general.schema.js";
export * from "./options.schema.js";
export * from "./dashboard.schema.js";
export * from "./presentations.schema.js";
export * from "./errors.js";

const c = initContract();

export const contract = c.router({
  members: membersContract,
  certificates: certificatesContract,
  inventory: inventoryContract,
  transactions: transactionsContract,
  treasuries: treasuriesContract,
  builder: builderContract,
  posts: postsContract,
  websites: websitesContract,
  options: optionsContract,
  churches: churchesContract,
  dashboard: dashboardContract,
  users: usersContract,
  permissions: permissionsContract,
  payments: paymentsContract,
  presentations: presentationsContract,
});
