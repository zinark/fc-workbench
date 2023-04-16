export function ScreenItem(props) {
    let screen = props.screen;

    const handleScreenClick = () => {
        if (props.onClick) props.onClick(screen);
        console.log("click", screen);
    };
    return <div className={'screen'} onClick={handleScreenClick}>
        <h3>
            {screen.title} <br/>
        </h3>
        <div>
            Items : {screen.items.length} <br/>
        </div>
    </div>
}