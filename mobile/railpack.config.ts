import { Config } from "@railpack/core";

export default Config.node({
  rootDirectory: "mobile",
  startCommand: "npm run sync && npx cap serve",
});