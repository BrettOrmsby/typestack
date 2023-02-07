import * as vscode from "vscode";
import { subscribeToDocumentChanges } from "./diagnostics";
import codeCompletion from "./codeCompletion";
import codeRunning from "./codeRunning";

export function activate(context: vscode.ExtensionContext) {
  const parseAndTypeErrors =
    vscode.languages.createDiagnosticCollection("parseAndTypeErrors");
  context.subscriptions.push(parseAndTypeErrors);
  subscribeToDocumentChanges(context, parseAndTypeErrors);
  codeCompletion(context);
  codeRunning(context);
}
