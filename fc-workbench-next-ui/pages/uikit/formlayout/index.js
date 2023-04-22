import React, {useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import CodeMirror from '@uiw/react-codemirror';
import Editor from '@monaco-editor/react';


const FormLayoutDemo = () => {
    const [dropdownItem, setDropdownItem] = useState(null);
    const dropdownItems = [
        {name: 'Option 1', code: 'Option 1'},
        {name: 'Option 2', code: 'Option 2'},
        {name: 'Option 3', code: 'Option 3'}
    ];
    const sampleObject = {
        x: 1,
        y: [1, 2, 3, 4],
        z: "ferhat"
    }

    return (
        <div className="grid">
            <Editor
                width={"550px"}
                height={"200px"}

                defaultLanguage="json"
                defaultValue={JSON.stringify(sampleObject, null, 4)}
                options={
                    {
                        "acceptSuggestionOnCommitCharacter": true,
                        "acceptSuggestionOnEnter": "on",
                        "accessibilitySupport": "auto",
                        "autoIndent": false,
                        "automaticLayout": true,
                        "codeLens": true,
                        "colorDecorators": true,
                        "contextmenu": true,
                        "cursorBlinking": "blink",
                        "cursorSmoothCaretAnimation": false,
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
                        "mouseWheelZoom": false,
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
                        "smoothScrolling": false,
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
                        minimap: { enabled: false },
                    }
                }
            />

            <CodeMirror value={JSON.stringify(sampleObject, null, 4)} height="200px"/>;

            <JSONInput
                id='a_unique_id'
                placeholder={sampleObject}
                locale={locale}
                height='550px'
            />
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Vertical</h5>
                    <div className="field">
                        <label htmlFor="name1">Name</label>
                        <InputText id="name1" type="text"/>
                    </div>
                    <div className="field">
                        <label htmlFor="email1">Email</label>
                        <InputText id="email1" type="text"/>
                    </div>
                    <div className="field">
                        <label htmlFor="age1">Age</label>
                        <InputText id="age1" type="text"/>
                    </div>
                </div>

                <div className="card p-fluid">
                    <h5>Vertical Grid</h5>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name2">Name</label>
                            <InputText id="name2" type="text"/>
                        </div>
                        <div className="field col">
                            <label htmlFor="email2">Email</label>
                            <InputText id="email2" type="text"/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Horizontal</h5>
                    <div className="field grid">
                        <label htmlFor="name3" className="col-12 mb-2 md:col-2 md:mb-0">
                            Name
                        </label>
                        <div className="col-12 md:col-10">
                            <InputText id="name3" type="text"/>
                        </div>
                    </div>
                    <div className="field grid">
                        <label htmlFor="email3" className="col-12 mb-2 md:col-2 md:mb-0">
                            Email
                        </label>
                        <div className="col-12 md:col-10">
                            <InputText id="email3" type="text"/>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h5>Inline</h5>
                    <div className="formgroup-inline">
                        <div className="field">
                            <label htmlFor="firstname1" className="p-sr-only">
                                Firstname
                            </label>
                            <InputText id="firstname1" type="text" placeholder="Firstname"/>
                        </div>
                        <div className="field">
                            <label htmlFor="lastname1" className="p-sr-only">
                                Lastname
                            </label>
                            <InputText id="lastname1" type="text" placeholder="Lastname"/>
                        </div>
                        <Button label="Submit"></Button>
                    </div>
                </div>

                <div className="card">
                    <h5>Help Text</h5>
                    <div className="field p-fluid">
                        <label htmlFor="username">Username</label>
                        <InputText id="username" type="text"/>
                        <small>Enter your username to reset your password.</small>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <h5>Advanced</h5>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="firstname2">Firstname</label>
                            <InputText id="firstname2" type="text"/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="lastname2">Lastname</label>
                            <InputText id="lastname2" type="text"/>
                        </div>
                        <div className="field col-12">
                            <label htmlFor="address">Address</label>
                            <InputTextarea id="address" rows="4"/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="city">City</label>
                            <InputText id="city" type="text"/>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">State</label>
                            <Dropdown id="state" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)}
                                      options={dropdownItems} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="zip">Zip</label>
                            <InputText id="zip" type="text"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormLayoutDemo;