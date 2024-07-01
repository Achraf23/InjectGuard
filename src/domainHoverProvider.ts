import * as vscode from "vscode";
import { Variable } from "./variable";

export class DomainHoverProvider implements vscode.HoverProvider {

    selection : vscode.Selection;
    domain_variables : string [];

    private createVariableArray() : Array<Variable> {
        
        let variables: Array<Variable> = [];

        this.domain_variables.forEach(function(value){
            variables.push(new Variable("iban",value));
        });

        return variables;
    }

    constructor(selection : vscode.Selection, domains: any){
        this.selection = selection;
        this.domain_variables = domains;
    }

    /**
     * Provides a hover on the selection/
     * @param document The document in which the command was invoked.
     * @param position The position at which the command was invoked.
     */
    public provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | undefined {
        

        // Get the word at the hovered position
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        let variables = this.createVariableArray();
        // // console.log(variables.length)

        
                    
        // // Returning a Hover object with content is optional
        if(position.line >= this.selection.start.line && position.line <= this.selection.end.line ){
            const selectionLine = position.line - this.selection.start.line;
            if(word.indexOf('$') > -1){
                const hover_variable = variables.filter((variable) => word.indexOf(variable.name) > -1);
                if(hover_variable.length > 0){
                    const markdown = new vscode.MarkdownString();
                    markdown.appendMarkdown('<span style="color:#ff0;background-color:#000;">&nbsp;&nbsp;**Domain**&nbsp;&nbsp;</span>');
                    markdown.appendMarkdown("  " + hover_variable[0].domain)
                    markdown.supportHtml = true;
                    markdown.isTrusted = true;
                    // return new vscode.Hover(`domain: ${hover_variable[0].domain}`);
                    return new vscode.Hover(markdown, new vscode.Range(position, position));
                }
                    
            }
        }

    }
}