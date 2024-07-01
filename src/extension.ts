import * as vscode from 'vscode';
import { DomainHoverProvider } from './domainHoverProvider';
import { get_domain } from './client/client';
import { assert } from 'console';

export function activate(context: vscode.ExtensionContext) {

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active');
        return;
    }

    // Retrieve selected code
    const selection = editor.selection;
    const sourceCode = editor.document.getText(selection);
    // console.log(selection)
    // console.log(sourceCode)

    const checkFunction = async() => {
        const domainVariables = await get_domain(sourceCode);

        // Register a domain hover provider 
        let hoverProvider = new DomainHoverProvider(selection,domainVariables);
        let hoverLog = vscode.languages.registerHoverProvider('php', hoverProvider);
        
        context.subscriptions.push(hoverLog);
    }

    checkFunction();

    const codeLensProvider = new CodeLensProvider(sourceCode);
    const selector: vscode.DocumentSelector = { scheme: 'file', language: 'php' };
    
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(selector, codeLensProvider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.runCommand', (line: number) => {
            vscode.window.showInformationMessage(`Command executed on line ${line}`);
        })
    );

    
}

class CodeLensProvider implements vscode.CodeLensProvider {
    onDidChangeCodeLenses?: vscode.Event<void> | undefined;

    private selection : string;

    constructor(selection){
        this.selection = selection;
    }

    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {

        const codeLenses: vscode.CodeLens[] = [];
        const regex = /(sqlite_query|mysql_query|mysqli_query|pg_query)\([^)]*\)/g;
        const regex2 = /(sqlite_query|mysql_query|mysqli_query|pg_query)\([^)]*\)/g;

        const text = document.getText();
        // console.log(text)
        
        let matches;
        
        while ((matches = regex.exec(this.selection)) !== null) {
            console.log(matches)
            // regex.lastIndex = 0;
    

            let matchWholeCode = regex2.exec(text);

            if(matchWholeCode == null){
                console.log("Problem regex");
                return;
            }

            const line = document.lineAt(document.positionAt(matchWholeCode.index).line);
           
            const range = new vscode.Range(line.range.start, line.range.end);

            const codeLens = new vscode.CodeLens(range, {
                title: 'Launch security audit',
                command: 'extension.runCommand',
                arguments: [line.lineNumber]
            });
            codeLenses.push(codeLens);
        }

        console.log(codeLenses.length)

        // console.log(codeLenses.length)
        return codeLenses;
    }
}
