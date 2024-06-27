import * as vscode from "vscode";

export class HoverProvider implements vscode.HoverProvider {

    selection : vscode.Selection;

    constructor(selection : vscode.Selection){
        this.selection = selection;
    }

    /**
     * Provides a hover on the selection/
     * @param document The document in which the command was invoked.
     * @param position The position at which the command was invoked.
     * @param selection The selected text over which the hovering is done
     */
    public provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | undefined {
        // Get the word at the hovered position
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
                    
        // Returning a Hover object with content is optional
        if(position.line >= this.selection.start.line && position.line <= this.selection.end.line )
            return new vscode.Hover(`You hovered over the word: ${position.line}`);
    }
}