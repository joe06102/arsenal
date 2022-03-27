#!/usr/bin/env ts-node

import { Arsenal } from "jsouee-arsenal";
import { InitCommand } from "./command/init";

const arsenal = new Arsenal()
  .ConfigRC((options) => (options.Module = "demo"))
  .ConfigVersion("1.0.0")
  .ConfigService((container) => {})
  .ConfigCommand(InitCommand)
  .Run();
