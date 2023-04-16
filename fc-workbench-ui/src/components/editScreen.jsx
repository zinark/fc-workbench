import * as PropTypes from "prop-types";

export function EditScreen(props) {
    let data = props.screen;

    const RenderItem = (ix, item) => {
        if (item.type === "Label") {
            return <div className={"screenLabelItem"} key={"item_" + ix}> {item.text} </div>
        }
        if (item.type === "Link") {
            return <div
                className={"screenLinkItem"}
                key={"item_" + ix}>
                {item.text}
            </div>
        }
        if (item.type === "Input") {
            return <>
                <div for={"item_" + ix}>{item.text}</div>
                <div>
                    <input name={"item_" + ix} className={"screenInputItem"} key={"item_" + ix}/>
                </div>

            </>
        }
        if (item.type === "Button") {
            return <>
                <div className={"screenButtonItem"} key={"item_" + ix}>{item.text}</div>
            </>
        }

        return <div key={"item_" + ix}> {item.text} [{item.type}] </div>
    };

    return <div className={"screenBox"} style={{textAlign: "center"}}>
        <h2>{data.title}</h2>
        {data.items.map(x => RenderItem(data.items.indexOf(x), x))}
    </div>;
}

EditScreen.propTypes = {screen: PropTypes.func};
