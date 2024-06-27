// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {injectionDetector} from './injectionDetector'
import { HoverProvider } from './hoverProvider';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "hover-log" is now active!');

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active');
        return;
    }

    // Retrieve selected code
    const selection = editor.selection;
    const sourceCode = editor.document.getText(selection);
    console.log(sourceCode)

    const securityChecker = new injectionDetector(sourceCode);
    const domains = securityChecker.get_domain_analysis();

    // HERE : the algo should be called
    const isVulnerable = /\d/.test(sourceCode);
    
    // highlight in red if there is an injection vulnerability
    const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255,0,0,0.3)' // Light red background
    });

    if (isVulnerable) {
        // Add decoration to the selected text
        editor.setDecorations(decorationType, [selection]);
        vscode.window.showInformationMessage('Code snippet vulnerable!');
        
    } else {
        // Clear decorations if there are no vulnerabilities
        editor.setDecorations(decorationType, []);
        vscode.window.showInformationMessage('Selected text is fine.');
    }

    // Register a hover provider for all languages
    let hoverProvider = new HoverProvider(selection);
    let hoverLog = vscode.languages.registerHoverProvider('*', hoverProvider);


    context.subscriptions.push(hoverLog);
}


// This method is called when your extension is deactivated
export function deactivate() {}


