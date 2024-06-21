// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FileParser } from './fileParser';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// This line of code will only be executed once when the extension is activated
	console.log('Congratulations, your "injectguard" is now active!');

	let disposable = vscode.commands.registerCommand('injectguard.injection', async () => {

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No editor is active');
            return;
        }

        // Retrieve selected code
        const selection = editor.selection;
        const sourceCode = editor.document.getText(selection);

        const fileParser = new FileParser(sourceCode)
        const vars = fileParser.extract_elements();

        // vars.forEach( (element) => {
        //     // console.log(element)
        //     if(typeof element == "object")
        //         console.log(JSON.stringify(element));
        //     else console.log(element); 
        // });

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
        
    });

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
