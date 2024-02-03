const vscode = require('vscode');

/**
 * Activa la extensión.
 * @param {vscode.ExtensionContext} context - El contexto de la extensión.
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.addCopyrightHeader', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;

            // Comprobar si el archivo está vacío
            if (document.getText().length === 0) {
                const config = vscode.workspace.getConfiguration();
                const author = await vscode.window.showInputBox({ prompt: 'Enter the author name' });
                const year = new Date().getFullYear().toString();
                const rights = config.get('copyrightHeader.rights', 'All rights reserved.');
				const fileName = document.fileName.split(/[/\\]/).pop(); // Obtener el nombre del archivo con su extensión

				if (author && year && rights) {
					insertCopyrightHeader(editor, author, year, rights, fileName);
				}
            }
        }
    });

	context.subscriptions.push(disposable);

}

/// Inserta la cabecera de derechos de autor en el editor.
/// @param {TextEditor} editor - El editor de texto.
/// @param {string} author - El nombre del autor.
/// @param {string} year - El año.
/// @param {string} rights - Los derechos.
function insertCopyrightHeader(editor, author, year, rights, fileName) {
    const copyrightText = "/* \n * @File: "+ fileName +"\n * @Author: "+ author +" \n * @Copyright: (c) "+ year +" by "+ author +". \n * "+ rights +" \n */\n\n";
    editor.edit(editBuilder => {
        editBuilder.insert(new vscode.Position(0, 0), copyrightText);
    });
}

/**
 * Desactiva la extensión.
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};