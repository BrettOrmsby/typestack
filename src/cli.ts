#!/usr/bin/env node

import typeStack from "./index.js";
import { resolve } from "path";
import fs from "fs";

const [, , filepath] = process.argv;

const absPath = resolve(process.cwd(), filepath);

fs.readFile(absPath, "utf8", function (err, data) {
  if (err) throw err;
  typeStack(data);
});
