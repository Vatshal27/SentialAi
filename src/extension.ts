/// <reference types="node" />
import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {

    const command = vscode.commands.registerCommand('secure-dev-tool.scan', async () => {

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No file open");
            return;
        }

        // Language awareness (for future upgrades)
        const language = editor.document.languageId;
        console.log("Scanning language:", language);

        vscode.window.setStatusBarMessage("🔍 Scanning for vulnerabilities...", 2000);

        const code = editor.document.getText();
        const lines = code.split("\n");

        // 🔴 Highlight setup
        const decoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255,0,0,0.3)'
        });

        let ranges: vscode.Range[] = [];

        lines.forEach((line, index) => {
            if (
                // SQL Injection (generic)
                (line.includes("SELECT") && line.includes("+")) ||

                // Hardcoded secrets
                /API_KEY|SECRET|password|token/i.test(line) ||

                // Command execution (multi-language)
                line.includes("os.system") ||
                line.includes("exec(") ||
                line.includes("system(") ||

                // Dangerous eval
                line.includes("eval(")
            ) {
                ranges.push(
                    new vscode.Range(
                        new vscode.Position(index, 0),
                        new vscode.Position(index, line.length)
                    )
                );
            }
        });

        editor.setDecorations(decoration, []);
        editor.setDecorations(decoration, ranges);

        try {
            const res = await axios.post('http://localhost:3000/analyze', { code });

            const vulnerabilities = res.data.vulnerabilities;

            if (!vulnerabilities || vulnerabilities.length === 0) {
                vscode.window.showInformationMessage("No vulnerabilities found");
                return;
            }

            vscode.window.setStatusBarMessage(
                `⚠️ ${vulnerabilities.length} issues found`,
                3000
            );

            const panel = vscode.window.createWebviewPanel(
                'securityAnalysis',
                'Security Analysis',
                vscode.ViewColumn.Beside,
                {}
            );

            // 📊 Risk summary
            const highCount = vulnerabilities.filter((v: any) => v.severity === "High").length;

            // 🎨 Build HTML
            const htmlContent = vulnerabilities.map((v: any) => {

                const color =
                    v.severity === "High" ? "red" :
                    v.severity === "Medium" ? "orange" : "blue";

                return `
                    <div style="
                        margin-bottom: 25px;
                        padding: 12px;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                    ">
                        <h2 style="color:${color}">⚠️ ${v.type}</h2>
                        <p><b>Severity:</b> ${v.severity}</p>
                        <p>${v.explanation}</p>

                        <h3>🧪 Simulation</h3>
                        <ol>
                            ${v.simulation.map((s: string) => `<li>${s}</li>`).join("")}
                        </ol>

                        <h3>🔧 Fix</h3>
                        <p>${v.fix}</p>
                    </div>
                `;
            }).join("");

            panel.webview.html = `
                <html>
                <body style="font-family: sans-serif; padding: 15px; line-height: 1.6;">
                    
                    <h1>🔍 Security Report (${vulnerabilities.length} issues)</h1>
                    <h2 style="color:red">⚠️ High Risk: ${highCount}</h2>

                    ${htmlContent}

                </body>
                </html>
            `;

        } catch (err) {
            vscode.window.showErrorMessage("Backend not running or request failed");
        }

    });

    context.subscriptions.push(command);
}

export function deactivate() {}