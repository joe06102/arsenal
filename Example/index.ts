#!/usr/bin/env ts-node

import { Arsenal } from "..";
import { InitCommand } from "./Command/Init";

const arsenal = new Arsenal()
  .ConfigRC((options) => (options.ConfigFile = "demorc.js"))
  .ConfigVersion("1.0.0")
  .ConfigService((container) => {})
  .ConfigCommand(InitCommand)
  .Run();
