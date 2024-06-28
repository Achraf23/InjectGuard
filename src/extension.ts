// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { DomainHoverProvider } from './domainHoverProvider';
import { assert } from 'console';
import { get_domain } from "./client/client";
import { findSourceMap } from 'module';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "hover-log" is now active!');

    let finish = false;

    // The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('injectguard.injection', () => {
		// The code you place here will be executed every time your command is executed

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No editor is active');
            return;
        }

        // Retrieve selected code
        const selection = editor.selection;
        const sourceCode = editor.document.getText(selection);
        console.log(sourceCode)

        const checkFunction = async() => {
            const domainVariables = await get_domain(sourceCode);

            // Register a domain hover provider 
            let hoverProvider = new DomainHoverProvider(selection,domainVariables);
            let hoverLog = vscode.languages.registerHoverProvider('*', hoverProvider);
            context.subscriptions.push(hoverLog);
        }

        checkFunction();

        finish = true;

	});


    const auditDisposable = vscode.commands.registerCommand('injectguard.injectAudit', () => {
        // Display a message box to the user
        if(finish == true)
            vscode.window.showInformationMessage('Not done yet!');
        else{
            vscode.window.showInformationMessage('Run Domain Analysis first !');
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(auditDisposable);
    

    // HERE : the algo should be called
    // const isVulnerable = /\d/.test(sourceCode);
    
    // // highlight in red if there is an injection vulnerability
    // const decorationType = vscode.window.createTextEditorDecorationType({
    //     backgroundColor: 'rgba(255,0,0,0.3)' // Light red background
    // });

    // if (isVulnerable) {
    //     // Add decoration to the selected text
    //     editor.setDecorations(decorationType, [selection]);
    //     vscode.window.showInformationMessage('Code snippet vulnerable!');
        
    // } else {
    //     // Clear decorations if there are no vulnerabilities
    //     editor.setDecorations(decorationType, []);
    //     vscode.window.showInformationMessage('Selected text is fine.');
    // }

}


// This method is called when your extension is deactivated
export function deactivate() {}


