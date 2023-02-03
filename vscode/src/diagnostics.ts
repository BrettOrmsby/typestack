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
	// do the error parsing here
	const index = 1;

	// create range that represents, where in the document the word is
	const range = new vscode.Range(1, index, 1, index + 6);

	const diagnostic = new vscode.Diagnostic(range, error.error,
		vscode.DiagnosticSeverity.Error);
	diagnostic.code = "typestack";
    console.log(diagnostic);
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
        const scanError = scanner.scan();
        if (scanError instanceof TSError) {
            return scanError;
        }
        const parser = new Parser(scanner.tokens, standardLibraryFunctions);
        const parseError = await parser.parse();
        expect(parseError).not.toBeInstanceOf(TSError);
        if (parseError instanceof TSError) {
            return parseError;
        }
    
        return typeCheck(
            parser.program,
            standardLibraryFunctions,
            parser.newFunctions
        );
}