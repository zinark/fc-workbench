import React from "react";
import {InputText} from "primereact/inputtext";
import {Chip} from "primereact/chip";
import {Button} from "primereact/button";

const ScreenItem = (props) => {
    let data = props.data;
    let editMode = props.editMode

    if (!data) return <div>Screen.items alani verilmeli ! </div>

    const typeIcons = {
        "Label": "pi-info",
        "Link": "pi-link",
        "Input": "pi-pencil",
        "Button": "pi-external-link"
    }

    const LabelScrenItem = () => {
        return <div className="line-height-1 text-800 text-2xl font-bold m-4"> {data.text} </div>
    }

    const LinkScreenItem = () => {
        return <div
            className="flex align-items-center justify-content-center align-self-center align-self-center p-5 m-1"
            style={{height: '4.2rem', width: '200px', borderRadius: '10px'}}
        > {data.text} </div>
    }

    const InputScreenItem = () => {
        return <div className="grid col-12" style={{width:'300px'}}>
            <div className="col-3">{data.text}</div>
            <InputText className="col-9" placeholder={data.text}/>
        </div>
    }
    const ButtonScreenItem = () => {
        return <div
            className="flex align-items-center justify-content-center bg-purple-200 align-self-center align-self-center"> Button </div>
    }
    const elements = {
        "Label": <LabelScrenItem/>,
        "Link": <LinkScreenItem/>,
        "Input": <InputScreenItem/>,
        "Button": <ButtonScreenItem/>
    }

    function EditMode() {
        return <div className="grid col-12">
            <div className="col-1">
                <Chip label={data.type} icon={"pi text-2xl " + typeIcons[data.type]}/>
            </div>
            <InputText className="col-6" value={data.text}/>
            <div className="col-2">
                Properties
            </div>
            <div className="col-2">
                Scripts
            </div>
            <div className="col-1">
                <Button outlined onClick={e => props.onDelete(data.refNo)} label={"Delete"}></Button>
            </div>
        </div>

    }

    function ViewMode() {

        // <div
        //     className="flex align-items-center justify-content-center bg-purple-200 align-self-center align-self-center"
        //     style={{width: '4.2rem', height: '4.2rem', borderRadius: '10px'}}>
        //     <i className="pi pi-fw pi-mobile text-5xl text-purple-700"></i>
        // </div>

        // <h2 className="line-height-1 text-900 text-4xl font-normal">Title</h2>
        // <span className="text-700 text-2xl line-height-3 ml-0 md:ml-2" style={{maxWidth: '650px'}}>
        //     Detail
        //     </span>

        return <div> {elements[data.type]}</div>

    }

    if (editMode) {
        return EditMode()
    } else {
        return ViewMode()
    }
}
export default ScreenItem;