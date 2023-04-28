import MonacoEditor from "@monaco-editor/react";
import React, {useRef} from "react";
import Enumerable from 'linq'

let variables = []

const CodeEditor = (props) => {
    let obj = props.object
    let bench = props.bench ?? {}
    if (!obj) obj = {}
    let code = JSON.stringify(obj, null, 2)
    const editorRef = useRef(null);

    variables = Enumerable.from(bench.adapters)
        .selectMany(x => x.parts)
        .selectMany(x => x.variables)
        .select(x => ({
            label: x.adapterKey ?? "undefined",
            // kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: x.adapterKey,
            documentation: {
                value: "```json \n" + JSON.stringify(x, null, 4) + "\n```",
                isTrusted: true,
            },
            detail: x.adapterKey,
        }))
        .toArray();


    function handleEditorChange(value, event) {
    }

    function handleEditorDidMount(editor, monaco) {
        const myAction = {
            id: "fc-workbench-cmd",
            label: "fc-workbench-cmd",
            contextMenuOrder: 0, // choose the order
            contextMenuGroupId: "FC-WORKBENCH-COMMAND", // create a new grouping
            keybindings: [
                // eslint-disable-next-line no-bitwise
                monaco.KeyMod.Alt | monaco.KeyCode.Enter, // Ctrl + Enter or Cmd + Enter
                // eslint-disable-next-line no-bitwise
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_R, // Ctrl + R or Cmd + R
            ],
            run: () => {
                let txt = editor.getModel().getValueInRange(editor.getSelection())
                alert('selected text:' + txt)
            },
        }
        editor.addAction(myAction)
    }

    function handleEditorWillMount(monaco) {
        // Öneriler sağlama işlevi
        function provideCompletionItems(model, position) {
            return {
                suggestions: variables
            };
        }

        // Öneri sağlama işlevini kaydetme
        if (window.monacoSuggestionsLoaded) return
        monaco.languages.registerCompletionItemProvider('json', {
            provideCompletionItems,
        });
        window.monacoSuggestionsLoaded = true
    }

    function handleEditorValidation(markers) {
        // model markers
        // markers.forEach(marker => console.log('onValidate:', marker.message));
    }

    return <MonacoEditor
        ref={editorRef}
        height={"50vh"}
        defaultLanguage="json"
        value={code}
        options={editorOptions}

        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
        onValidate={handleEditorValidation}

    />
}

const editorOptions = {
    "acceptSuggestionOnCommitCharacter": true,
    "acceptSuggestionOnEnter": "on",
    "accessibilitySupport": "auto",
    "autoIndent": false,
    "automaticLayout": true,
    "codeLens": true,
    "colorDecorators": true,
    "contextmenu": true,
    "cursorBlinking": "blink",
    "cursorSmoothCaretAnimation": true,
    "cursorStyle": "line",
    "disableLayerHinting": false,
    "disableMonospaceOptimizations": false,
    "dragAndDrop": false,
    "fixedOverflowWidgets": false,
    "folding": true,
    "foldingStrategy": "auto",
    "fontLigatures": false,
    "formatOnPaste": false,
    "formatOnType": false,
    "hideCursorInOverviewRuler": false,
    "highlightActiveIndentGuide": true,
    "links": true,
    "mouseWheelZoom": true,
    "multiCursorMergeOverlapping": true,
    "multiCursorModifier": "alt",
    "overviewRulerBorder": true,
    "overviewRulerLanes": 2,
    "quickSuggestions": true,
    "quickSuggestionsDelay": 100,
    "readOnly": false,
    "renderControlCharacters": false,
    "renderFinalNewline": true,
    "renderIndentGuides": true,
    "renderLineHighlight": "all",
    "renderWhitespace": "none",
    "revealHorizontalRightPadding": 30,
    "roundedSelection": true,
    "rulers": [],
    "scrollBeyondLastColumn": 5,
    "scrollBeyondLastLine": true,
    "selectOnLineNumbers": true,
    "selectionClipboard": true,
    "selectionHighlight": true,
    "showFoldingControls": "mouseover",
    "smoothScrolling": true,
    "suggestOnTriggerCharacters": true,
    "wordBasedSuggestions": true,
    "wordSeparators": "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
    "wordWrap": "off",
    "wordWrapBreakAfterCharacters": "\t})]?|&,;",
    "wordWrapBreakBeforeCharacters": "{([+",
    "wordWrapBreakObtrusiveCharacters": ".",
    "wordWrapColumn": 80,
    "wordWrapMinified": true,
    "wrappingIndent": "none",
    minimap: {enabled: false},
    hover: {enabled: true},
    suggest: {
        // resolveCompletionItem özelliği kullanıldı
        resolveCompletionItem: (item, token) => {
            if (item.label === 'admin_searchsessions_text') {
                console.log('Seçili öneri öğesi:', item.label);
            }
            return item;
        }
    }
};
export default CodeEditor