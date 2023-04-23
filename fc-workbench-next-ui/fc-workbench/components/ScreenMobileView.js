import ScreenItem from "./ScreenItem";
import React from "react";

const ScreenMobileView = (props) => {
    let screen = props.screen
    let zoom = props.zoom
    return <div
        className="col-12 flex flex-column align-items-center text-center bg-gray-100"
        style={{borderRadius: "50px", zoom: zoom}}>
        <div
            className="flex flex-column bg-purple-50 p-4 m-4 border-2 border-300 align-items-center align-content-center"
            style={{minWidth: "320px", minHeight: "600px", borderRadius: "30px"}}>
            {screen.items.map((scrItem, ix) => <ScreenItem key={ix} data={scrItem}/>)}
        </div>
    </div>
}

export default ScreenMobileView