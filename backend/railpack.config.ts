import { Config } from "@railpack/core";

export default Config.node({
  installCommand: "npm ci",
  buildCommand: null,
  startCommand: "npm start",
});