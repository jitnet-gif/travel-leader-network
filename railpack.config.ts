import { Config } from "@railpack/core";

export default Config.node({
  packages: ["backend"],
  startCommand: "cd backend && npm start",
});