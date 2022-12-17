import { Pos } from "../scan.js";
import { ConsoleEffects, consoleEffect } from "./consoleEffect.js";

export const ErrorInputConfig: { input: string } = { input: "" };

export class TSError {
  error: string;

  constructor(
    pos: { startPos: Pos; endPos: Pos },
    msg: string,
    ...params: any[]
  ) {
    const MAX_ERROR_WIDTH = 35; // characters on each side of the start of the error

    let replaceNum = -1;
    const formattedMessage = msg.replace(/{}/g, () => {
      replaceNum += 1;
      return params[replaceNum];
    });

    let errorLine = ErrorInputConfig.input.split("\n")[pos.startPos.line - 1];
    let errorStartsAt = pos.startPos.char - 1;

    if (!(errorLine.length < MAX_ERROR_WIDTH * 2 + 1)) {
      let newErrorLine = errorLine[pos.startPos.char - 1];
      const textBefore = errorLine.substring(0, pos.startPos.char - 1);
      const textAfter = errorLine.substring(pos.startPos.char);

      if (textBefore.length >= MAX_ERROR_WIDTH) {
        // need to trim off the start
        errorStartsAt = 4 + MAX_ERROR_WIDTH;
        newErrorLine =
          consoleEffect("... ", ConsoleEffects.Bright, ConsoleEffects.FgBlue) +
          textBefore.slice(-MAX_ERROR_WIDTH) +
          newErrorLine;
      }
      if (textAfter.length >= MAX_ERROR_WIDTH) {
        // need to trim off the end
        newErrorLine =
          newErrorLine +
          textAfter.slice(0, MAX_ERROR_WIDTH) +
          consoleEffect(" ...", ConsoleEffects.Bright, ConsoleEffects.FgBlue);
      }
      errorLine = newErrorLine;
    }

    let errorLength = pos.endPos.char - pos.startPos.char;
    if (pos.startPos.line !== pos.endPos.line) {
      errorLength = MAX_ERROR_WIDTH + 1;
    }
    if (errorLength > MAX_ERROR_WIDTH + 1) {
      errorLength = MAX_ERROR_WIDTH + 1;
    }
    const underline = consoleEffect(
      "^".repeat(errorLength),
      ConsoleEffects.FgRed,
      ConsoleEffects.Bright
    );

    const error = consoleEffect(
      "error",
      ConsoleEffects.FgRed,
      ConsoleEffects.Bright
    );
    const blueArrow = consoleEffect(
      "-->",
      ConsoleEffects.FgBlue,
      ConsoleEffects.Bright
    );
    const bluePipe = consoleEffect(
      "|",
      ConsoleEffects.FgBlue,
      ConsoleEffects.Bright
    );

    const blueLineNumber = consoleEffect(
      pos.startPos.line,
      ConsoleEffects.FgBlue,
      ConsoleEffects.Bright
    );

    const lineNumberWidth = pos.startPos.line.toString().length;
    const fullMessage = `
${error}: ${consoleEffect(formattedMessage, ConsoleEffects.Bright)}
${space(lineNumberWidth + 1)}${blueArrow} ${pos.startPos.line}:${
      pos.startPos.char
    }
${space(lineNumberWidth + 1)}${bluePipe}
${blueLineNumber} ${bluePipe} ${errorLine}
${space(lineNumberWidth + 1)}${bluePipe} ${space(errorStartsAt)}${underline}`;

    this.error = fullMessage;
  }
  fire() {
    console.log(this.error);
  }
}

export function isTSError(error: TSError | void): error is TSError {
  return error instanceof TSError;
}

function space(num: number): string {
  return " ".repeat(num);
}
