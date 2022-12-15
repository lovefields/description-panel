// This is a counter widget with buttons to increment and decrement the number.

const { widget } = figma;
const { useWidgetId, useSyncedState, usePropertyMenu, AutoLayout, Text, Rectangle, Input, useEffect } = widget;

function Widget() {
    const [widgetType] = useSyncedState("widgetType", "parent");
    const [parentId] = useSyncedState("parentId", "");
    const [dataType] = useSyncedState("dataType", "");
    const [dataId] = useSyncedState("dataId", "");
    const [widgetData, setWidgetData] = useSyncedState(
        "widgetData",
        JSON.stringify({
            visible: [],
            invisible: [],
            tracking: [],
            design: [],
        })
    );
    const [pageTitle, setPageTitle] = useSyncedState("pageTitle", "");
    const [pageCaption, setPageCaption] = useSyncedState("pageCaption", "");
    let widgetDataJson = JSON.parse(widgetData);
    let widgetId = useWidgetId();

    console.log("Type : ", widgetType);
    console.log("parent ID : ", parentId);
    console.log("dataType : ", dataType);
    console.log("dataId : ", dataId);
    console.log("widget ID : ", useWidgetId());

    useEffect(() => {
        figma.ui.onmessage = (msg) => {
            let data = JSON.parse(msg.data);

            if (msg.type === "setting") {
                console.log("id?", data);
                setWidgetId(data);
            }

            if (msg.type === "add") {
                widgetDataJson[data.type].push(data);
                setData();
            }

            if (msg.type === "add") {
            }

            if (msg.type === "pointer") {
                const allWidgetNodes: WidgetNode[] = figma.currentPage.findAll((node) => {
                    return node.type === "WIDGET";
                });

                const myWidgetNodes: WidgetNode[] = allWidgetNodes.filter((node) => {
                    return node.widgetId === figma.widgetId;
                });
                console.log("make pointer !!!!");
                console.log(data);
                console.log(myWidgetNodes);

                myWidgetNodes[0].cloneWidget({
                    widgetType: "child",
                    parentId: widgetId,
                    dataType: data.type,
                    dataId: data.id,
                    widgetData: widgetData,
                });
            }

            figma.closePlugin();
        };
    });

    // data arrangement
    function arrangementData(data) {
        Object.entries(data).map(([key, value]) => {
            value.forEach((row, i) => {
                data[key][i].id = i + 1;
            });
        });

        return data;
    }

    function setData() {
        widgetDataJson = arrangementData(widgetDataJson);
        setWidgetData(JSON.stringify(widgetDataJson));
    }
    if (widgetType == "parent") {
        usePropertyMenu(
            [
                {
                    itemType: "action",
                    propertyName: "add",
                    tooltip: "Add New Description",
                },
            ],
            ({ propertyName, propertyValue }) => {
                if (propertyName == "add") {
                    return new Promise((resolve) => {
                        figma.showUI(__html__, { width: 300, height: 300 });
                        figma.ui.postMessage(
                            JSON.stringify({
                                mode: "new",
                                id: null,
                                type: "",
                                content: "",
                            })
                        );
                    });
                }
            }
        );
    }

    let count = 0;
    for (let [key, value] of Object.entries(widgetDataJson)) {
        if (value.length > 0) {
            count += 1;
        }
    }

    if (count == 0) {
        count = 1;
    }

    let widgetWidth = 400 * count;

    function listStructure() {
        let column = Object.entries(widgetDataJson).map(([key, value]) => {
            if (value.length > 0) {
                let item = value.map((row) => {
                    return itemStructure(row);
                });

                return (
                    <AutoLayout name={`${key}-column`} width={"fill-parent"} direction="vertical" spacing={10} key={key}>
                        {item}
                    </AutoLayout>
                );
            }
        });

        return column;
    }

    function itemStructure(data) {
        return (
            <AutoLayout name="item" width={"fill-parent"} direction="vertical" key={data.id}>
                <AutoLayout name="top-area">
                    <Text>{data.id}</Text>
                    <Text>{data.type}</Text>
                </AutoLayout>

                <Text>{data.content}</Text>

                <AutoLayout name="btn-area">
                    <Text
                        onClick={(e) => {
                            widgetDataJson[data.type].splice(data.id - 1, 1);
                            setData();
                        }}
                    >
                        Delete
                    </Text>
                    <Text
                        onClick={(e) => {
                            console.log("Edit", data.id, data.type);
                        }}
                    >
                        Edit
                    </Text>
                    <Text
                        onClick={(e) => {
                            return new Promise((resolve) => {
                                figma.showUI(`
                                    <script>
                                        window.onmessage = (event) => {
                                            let data = event.data.pluginMessage;
                                            parent.postMessage({ pluginMessage: { type: "pointer", data: data } }, "*");
                                        };
                                    </script>
                                `);
                                figma.ui.postMessage(JSON.stringify(widgetDataJson[data.type][data.id - 1]));
                            });
                        }}
                    >
                        Make Pointer
                    </Text>
                </AutoLayout>
            </AutoLayout>
        );
    }

    if (widgetType == "parent") {
        return (
            <AutoLayout name="wrap" width={widgetWidth} direction={"vertical"} spacing={8} padding={16} cornerRadius={8} fill={"#FFFFFF"} stroke={"#E6E6E6"}>
                <AutoLayout name="Page information" width={"fill-parent"} direction={"vertical"}>
                    <Input
                        value={pageTitle}
                        placeholder="Page Title"
                        onTextEditEnd={(e) => {
                            setPageTitle(e.characters);
                        }}
                        fontSize={24}
                        fontWeight={700}
                        width={"fill-parent"}
                        fill="#333"
                        inputBehavior="multiline"
                    />
                    <Input
                        value={pageCaption}
                        placeholder="Page Description"
                        onTextEditEnd={(e) => {
                            setPageCaption(e.characters);
                        }}
                        fontSize={16}
                        width={"fill-parent"}
                        fill="#333"
                        inputBehavior="multiline"
                    />
                </AutoLayout>
                <AutoLayout name="list-area" width={"fill-parent"} spacing={"auto"}>
                    {listStructure()}
                </AutoLayout>
            </AutoLayout>
        );
    } else {
        return (
            <AutoLayout
                name="wrap"
                width={40}
                height={40}
                fill={"#FFFFFF"}
                stroke={"#E6E6E6"}
                onClick={(e) => {
                    return new Promise((resolve) => {
                        figma.showUI(__html__, { width: 300, height: 300 });
                        figma.ui.postMessage(
                            JSON.stringify({
                                mode: "view",
                                id: null,
                                type: "",
                                content: "",
                            })
                        );
                    });
                }}
            >
                <Text>1</Text>
            </AutoLayout>
        );
    }
}

widget.register(Widget);
