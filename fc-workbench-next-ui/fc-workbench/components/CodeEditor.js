import MonacoEditor from "@monaco-editor/react";
import React, {useRef} from "react";

const CodeEditor = (props) => {
    let obj = props.object
    if (!obj) obj = {}
    let code = JSON.stringify(obj, null, 2)
    const editorRef = useRef(null);

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
            run: ()=>{
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
                suggestions: [
                    {
                        label: 'admin_searchsessions_text',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'admin_searchsessions_text',
                        documentation: {
                            value: 'Bu bir örnek açıklamadır. Bu anahtar kelime örnektir. Kullanımı ile ilgili detaylı bilgi için belgelemeye bakın.',
                            isTrusted: true,
                        },
                        detail: 'admin_searchsessions_text',
                    },
                    {
                        label: 'hello',
                        kind: monaco.languages.CompletionItemKind.Enum,
                        icon: {
                            value: 'flag'
                        },
                        insertText: 'hello',
                        documentation: {
                            value: `### Hello world
1. deneme
2. deneme
3. test
4. *bold* text
5. usages
                            `,
                            isTrusted: true
                        }
                    },
                    {
                        label: 'world',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'world',
                        documentation: 'Bu anahtar kelime örnektir. Kullanımı ile ilgili detaylı bilgi için belgelemeye bakın.',
                        // icon: {
                        //     value: 'fas fa-flag'
                        // }
                        // detail: monaco.MarkerdownString(`Bu bir örnek ayrıntıdır. <span style='font-size: 20px'>Büyük boyut</span>`),
                        // detail: new monaco.MarkdownString(`**Bu bir örnek ayrıntıdır.**\n\nBüyük Boyut: <span style="font-size: 20px">myKeyword</span>`),
                    },
                ],
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