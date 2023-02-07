import * as vscode from "vscode";
import typeStack from "typestack-lang/dist/index";

export default function activate(context: vscode.ExtensionContext) {
  const command = "typestack.run";

  const commandHandler = (name = "world") => {
    (vscode.window.activeTerminal || vscode.window.createTerminal()).sendText(
      "typestack " + vscode.window.activeTextEditor?.document?.fileName
    );
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(command, commandHandler)
  );
}
