import {ScreenItem} from "./screenItem";

export function ScreenContainer(props) {
    let screens = props.screens;

    return <div className={'container'}>
        {screens.map(x => <ScreenItem key={x.title} screen={x} onClick={props.onClick}/>)}
    </div>

}