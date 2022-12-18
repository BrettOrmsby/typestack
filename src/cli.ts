#!/usr/bin/env node

import typeStack from "./index.js";
import { consoleEffect, ConsoleEffects } from "./utils/consoleEffect.js";
import { resolve } from "path";
import fs from "fs";

const [, , filepath] = process.argv;

const absPath = resolve(process.cwd(), filepath);

fs.readFile(absPath, "utf8", function (err, data) {
  if (err) {
    console.log(
      consoleEffect("error", ConsoleEffects.FgRed, ConsoleEffects.Bright) +
        ":" +
        consoleEffect(
          ` unable to read file at ${absPath}`,
          ConsoleEffects.Bright
        )
    );
  } else {
    typeStack(data);
  }
});
