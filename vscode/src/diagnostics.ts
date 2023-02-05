import * as vscode from 'vscode';
import { Scanner } from "typestack-lang/dist/scan";
import { Parser } from "typestack-lang/dist/parse";
import typeCheck from "typestack-lang/dist/typeCheck";
import { standardLibraryFunctions } from "typestack-lang/dist/functions";
import { TSError } from "typestack-lang/dist/utils/error";


export async function refreshDiagnostics(doc: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection) {
	const diagnostics: vscode.Diagnostic[] = [];
    const fileText = doc.getText();
	const errors = await getErrors(fileText);

    if(errors) {
        if(errors instanceof TSError) {
            diagnostics.push(createDiagnostic(doc, errors));
        } else {
            errors.forEach(error => {
                diagnostics.push(createDiagnostic(doc, error));
            });
        }
    }

	diagnosticCollection.set(doc.uri, diagnostics);
}

function createDiagnostic(doc: vscode.TextDocument, error: TSError): vscode.Diagnostic {
	// create range that represents, where in the document the word is
    let errorLength = error.pos.endPos.char - error.pos.startPos.char;
    if (errorLength === 0) {
      errorLength = 1;
    }
	const range = new vscode.Range(error.pos.startPos.line - 1, error.pos.startPos.char - 1, error.pos.endPos.line - 1, error.pos.startPos.char -1 + errorLength);

	const diagnostic = new vscode.Diagnostic(range, error.message,
		vscode.DiagnosticSeverity.Error);
	diagnostic.code = "typestack";
	return diagnostic;
}

export function subscribeToDocumentChanges(context: vscode.ExtensionContext, diagnosticCollection: vscode.DiagnosticCollection): void {
	if (vscode.window.activeTextEditor) {
		refreshDiagnostics(vscode.window.activeTextEditor.document, diagnosticCollection);
	}
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				refreshDiagnostics(editor.document, diagnosticCollection);
			}
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, diagnosticCollection))
	);

	context.subscriptions.push(
		vscode.workspace.onDidCloseTextDocument(doc => diagnosticCollection.delete(doc.uri))
	);

}

async function getErrors(text: string): Promise<TSError | void | TSError[]> {
        const scanner = new Scanner(text, console.log);
        const scanErrors = scanner.scan();
        
        const parser = new Parser(scanner.tokens, standardLibraryFunctions);
        const parseErrors = await parser.parse();
    
        return [...scanErrors, ...parseErrors, ...typeCheck(
            parser.program,
            standardLibraryFunctions,
            parser.newFunctions
        )];
}