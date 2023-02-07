import * as vscode from "vscode";

export default function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("typestack.run", async () => {
      try {
        vscode.window.terminals[0].show();
        const trySave = await vscode.window.activeTextEditor?.document?.save();
        if (!trySave) {
          throw new Error();
        }
        (
          vscode.window.activeTerminal || vscode.window.createTerminal()
        ).sendText(
          "typestack " + vscode.window.activeTextEditor?.document?.fileName
        );
      } catch (e) {
        vscode.window.showErrorMessage("Unable to run code.");
      }
    })
  );
}
