import * as vscode from "vscode";
import { Scanner } from "typestack-lang/dist/scan";
import { Parser } from "typestack-lang/dist/parse";
import { standardLibraryFunctions } from "typestack-lang/dist/functions";

export default function activate(context: vscode.ExtensionContext) {
  const provider1 = vscode.languages.registerCompletionItemProvider(
    "typestack",
    {
      async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
      ) {
        //TODO: use position and document to provide different suggestions (functions, @int, continue/break, import ...)

        const keywords = [
          "import",
          "fn",
          "loop",
          "for",
          "while",
          "if",
          "else",
          "break",
          "continue",
          "int",
          "bool",
          "str",
          "float",
          "any",
          "@int",
          "@float",
          "@str",
          "@bool",
          "@any",
          "true",
          "false",
        ];
        const keywordCompletions = keywords.map(
          (e) => new vscode.CompletionItem(e, vscode.CompletionItemKind.Keyword)
        );

        const scanner = new Scanner(document.getText(), console.log);
        scanner.scan();
        const parser = new Parser(scanner.tokens, standardLibraryFunctions);
        await parser.parse();

        const functions = parser.functions;
        const functionNames: string[] = [];
        Object.keys(functions).forEach((e) =>
          Object.keys(functions[e as keyof typeof functions]).forEach(
            (funcName) => {
              functionNames.push(funcName);
            }
          )
        );
        const uniqueFunctionNames = [...new Set(functionNames)];
        const functionCompletions = uniqueFunctionNames.map(
          (e) =>
            new vscode.CompletionItem(e, vscode.CompletionItemKind.Function)
        );

        /*
			// a completion item that inserts its text as snippet,
			// the `insertText`-property is a `SnippetString` which will be
			// honored by the editor.
			const snippetCompletion = new vscode.CompletionItem('Good part of the day');
			snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
			const docs: any = new vscode.MarkdownString("Inserts a snippet that lets you select [link](x.ts).");
			snippetCompletion.documentation = docs;
			docs.baseUri = vscode.Uri.parse('http://example.com/a/b/c/');

			// a completion item that retriggers IntelliSense when being accepted,
			// the `command`-property is set which the editor will execute after 
			// completion has been inserted. Also, the `insertText` is set so that 
			// a space is inserted after `new`
			const commandCompletion = new vscode.CompletionItem('new');
			commandCompletion.kind = vscode.CompletionItemKind.Keyword;
			commandCompletion.insertText = 'new ';
			commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };
            */

        // return all completion items as array
        return [...keywordCompletions, ...functionCompletions];
      },
    }
  );

  context.subscriptions.push(provider1);
}
