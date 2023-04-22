import {useRouter} from "next/router";
import {BreadCrumb} from "primereact/breadcrumb";
import React, {useEffect, useRef, useState} from "react";
import {Menubar} from "primereact/menubar";
import {WorkbenchService} from "../../fc-workbench/service/WorkbenchService";
import Link from "next/link";
import {TabPanel, TabView} from "primereact/tabview";
import Editor from "@monaco-editor/react";

const Screen = () => {
    const [bench, setBench] = useState([]);
    const [screen, setScreen] = useState({})
    const [editorJson, setEditorJson] = useState("")
    const router = useRouter()
    const {ids} = router.query
    if (!ids) return;
    let wid = ids[0]
    let id = ids[1]

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
        minimap: {enabled: false},
    };

    const change_current_screen = (given_id) => {
        for (let ix in bench.screens) {
            let screen = bench.screens[ix];
            if (screen.id !== given_id) continue;
            setScreen(screen)
            break;
        }
    }
    const refresh_workbenchs = async (given_id) => {
        let data = await WorkbenchService.getWorkbench(given_id)
        await setBench(data)
    }

    useEffect(() => {
            change_current_screen(id)
        },
        [bench, change_current_screen, id]);

    useEffect(() => {
        refresh_workbenchs(wid)
    }, [wid]);


    const breadcrumbHome = {icon: 'pi pi-home', to: '/'};
    const breadcrumbItems = [
        {label: <Link href={"/workbenchs"}> Workbenchs </Link>},
        {label: <Link href={"/workbench/" + wid}> {bench && bench.name} </Link>},
        {label: <Link href={"/screen/" + wid + "/" + id}> {screen && screen.title} </Link>}
    ];
    const screenEditMenuItems = [
        {
            label: 'New',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'Label',
                    icon: 'pi pi-fw pi-plus',
                },
                {
                    label: 'Link',
                    icon: 'pi pi-fw pi-plus',
                },
                {
                    label: 'Button',
                    icon: 'pi pi-fw pi-plus',
                },
                {
                    label: 'Input',
                    icon: 'pi pi-fw pi-plus',
                }
            ]
        },
        {
            label: 'Save',
            icon: 'pi pi-fw pi-save'
        }
    ];

    const ScreenLink = (props) => {
        let data = props.screens;
        if (!data) return
        return <div>
            <Link href={`/screen/${wid}/${data.id}`}>
                {data.title}
            </Link>
        </div>
    }

    const ScreenItem = (props) => {
        let item = props.item
        let style = {
            position: "relative",
            zIndex: 10000,
            backgroundColor: "yellow",
            left: `${item.x * 10}px`,
            top: `${item.y * 10}px`,
            width: `${item.width * 10}px`,
            height: `${item.height * 10}px`,
        }

        return <div className="fc"> {item.text} </div>
    }
    const ScreenEditor = () => {
        if (!screen) return
        if (!screen.items) return
        return <div>
            {screen.items.map(x => <ScreenItem key={x.id} item={x}/>)}
        </div>
    }

    const ScreenPanel = () => {
        if (!bench) return
        if (!bench.screens) return
        if (!screen) return

        const editorRef = useRef(null);
        return <div className="card">
            <div className="grid">
                <div className="col-11">
                    <h2>{screen.title}</h2>

                    <TabView>
                        <TabPanel header="Screen">
                            <ScreenEditor/>
                        </TabPanel>
                        <TabPanel header="Json">
                            <Editor
                                ref={editorRef}
                                height={"60vh"}
                                //onChange={e => setEditorJson(e)}
                                defaultLanguage="json"
                                value={JSON.stringify(screen, null, 2)}
                                options={editorOptions}
                            />
                        </TabPanel>
                    </TabView>
                </div>
                <div className="col-1">
                    {bench.screens.map(x => <ScreenLink key={x.id} screens={x}/>)}
                </div>
            </div>
        </div>

    }

    return <div>
        <BreadCrumb home={breadcrumbHome} model={breadcrumbItems}/>
        <Menubar model={screenEditMenuItems}></Menubar>

        {screen && <ScreenPanel/>}
    </div>
}


export default Screen