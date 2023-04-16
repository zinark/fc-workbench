import {Requests} from "../Requests";
import {useEffect, useState} from "react";
import {ScreenContainer} from "./screenContainer";
import {AdapterList} from "./adapterList";
import {EditScreen} from "./editScreen";


export function Screens() {
    const REQUESTS = new Requests();
    const [adapters, setAdapters] = useState([]);
    const [screens, setScreens] = useState([]);

    const [selectedScreen, setSelectedScreen] = useState();


    const handleOnLoad = async () => {
        let workbench = await REQUESTS.getWorkbench(1);
        console.log(workbench)
        setAdapters(workbench.adapters);
        setScreens(workbench.screens);

        // let replyScreens = await REQUESTS.searchScreens(1);
        // setAdapters(replyScreens.screens);
    };

    useEffect(() => {
        handleOnLoad();
    }, [])

    const handleAddScreen = () => {
        var uid = window.URL.createObjectURL(new Blob([])).substring(31);
        let title = prompt("Ekran ismi", "Screen " + uid)
        if (title === null) return;
        let newScreen = {
            title: title,
            items: []
        }
        setScreens([...screens, newScreen])
    };

    const handleScreenClick = (screen) => {
        setSelectedScreen(screen)
    }

    return <div>
        <h1> Screens </h1>
        <button onClick={handleAddScreen}>Add Screen</button>
        <div>
            <AdapterList data={adapters}/>
            <ScreenContainer
                screens={screens}
                adapters={adapters}
                onClick={handleScreenClick}
            />
            {selectedScreen && <EditScreen screen={selectedScreen}/>}
            {!selectedScreen && <div> bir ekran secin </div>}
        </div>
    </div>
}