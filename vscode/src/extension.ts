
import * as vscode from 'vscode';
import { subscribeToDocumentChanges } from './diagnostics';

export function activate(context: vscode.ExtensionContext) {
	const parseAndTypeErrors = vscode.languages.createDiagnosticCollection("parseAndTypeErrors");
	context.subscriptions.push(parseAndTypeErrors);
	subscribeToDocumentChanges(context, parseAndTypeErrors);
}
