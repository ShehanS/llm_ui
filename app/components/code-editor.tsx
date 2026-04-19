"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
});

const CodeEditor = () => {
    const [code, setCode] = useState(`def hello() {
  println "Hello from Groovy!"
}`);

    const handleChange = (value: string | undefined) => {
        setCode(value || "");
    };

    const handleEditorDidMount = (editor: any, monaco: any) => {
        // ✅ Register Groovy language
        monaco.languages.register({ id: "groovy" });

        // ✅ Syntax highlighting
        monaco.languages.setMonarchTokensProvider("groovy", {
            tokenizer: {
                root: [
                    [/\b(def|class|if|else|for|while|return|new|try|catch)\b/, "keyword"],
                    [/"([^"\\]|\\.)*$/, "string.invalid"],
                    [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
                    [/[a-zA-Z_$][\w$]*/, "identifier"],
                    [/[{}()\[\]]/, "@brackets"],
                    [/\d+/, "number"],
                ],
                string: [
                    [/[^\\"]+/, "string"],
                    [/\\./, "string.escape"],
                    [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
                ],
            },
        });

        // ✅ Theme
        monaco.editor.defineTheme("groovyTheme", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "keyword", foreground: "C586C0" },
                { token: "string", foreground: "CE9178" },
                { token: "number", foreground: "B5CEA8" },
            ],
            colors: {},
        });

        monaco.editor.setTheme("groovyTheme");

        // ✅ Autocomplete
        monaco.languages.registerCompletionItemProvider("groovy", {
            provideCompletionItems: () => {
                return {
                    suggestions: [
                        {
                            label: "println",
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'println("${1}")',
                            insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        },
                        {
                            label: "if",
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: "if (${1:condition}) {\n\t$0\n}",
                        },
                        {
                            label: "workflowVar",
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: "workflowVar",
                        },
                    ],
                };
            },
        });
    };

    return (
        <div
            style={{
                height: "500px",
                border: "1px solid #ccc",
                borderRadius: "8px",
            }}
        >
            <Editor
                height="100%"
                language="groovy"
                value={code}
                onChange={handleChange}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    wordWrap: "on",
                }}
            />
        </div>
    );
};

export default CodeEditor;
