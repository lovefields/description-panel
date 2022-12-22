const { widget } = figma;
const { useWidgetId, useSyncedState, usePropertyMenu, AutoLayout, Text, Input, useEffect } = widget;

type descriptionType = "visible" | "invisible" | "tracking" | "design";

interface descriptionItem {
    id: number;
    type: descriptionType;
    content: string;
}

function plannerWidget() {
    const [widgetType] = useSyncedState("widgetType", "parent");
    const [parentId] = useSyncedState("parentId", "");
    const [dataId] = useSyncedState("dataId", "");
    const [dataType] = useSyncedState("dataType", "");
    const [dataContent] = useSyncedState("dataContent", "");
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

    // data arrangement
    function arrangementData(data: { [key: string]: descriptionItem[] }) {
        let keyList = Object.keys(data);

        keyList.map((key) => {
            data[key].map((value: descriptionItem, i: number) => {
                data[key][i].id = i + 1;
            });
        });

        return data;
    }

    function deleteData(id: number, type: string) {
        const allNode: any[] = figma.currentPage.findAll();
        const allWidgetNodes: WidgetNode[] = allNode.filter((node) => {
            return node.type === "WIDGET";
        });

        const myWidgetNodes: WidgetNode[] = allWidgetNodes.filter((node) => {
            return node.widgetId === figma.widgetId;
        });

        const childWidgetNode: WidgetNode[] = myWidgetNodes.filter((node) => {
            return node.widgetSyncedState.parentId === widgetId;
        });

        widgetDataJson[type].splice(id - 1, 1);
        setData();

        childWidgetNode.forEach((child) => {
            let childType = child.widgetSyncedState.dataType;
            let childId = child.widgetSyncedState.dataId;

            if (childId == id && childType == type) {
                child.remove();
            }

            if (childId > id && childType == type) {
                child.setWidgetSyncedState({
                    widgetType: "child",
                    parentId: widgetId,
                    dataId: childId - 1,
                    dataType: childType,
                    dataContent: widgetDataJson[childType][childId - 2].content,
                });
            }
        });
    }

    function setData() {
        widgetDataJson = arrangementData(widgetDataJson);
        setWidgetData(JSON.stringify(widgetDataJson));
    }

    let count = 0;
    let keyList = Object.keys(widgetDataJson);

    keyList.map((key) => {
        if (widgetDataJson[key].length > 0) {
            count += 1;
        }
    });

    if (count == 0) {
        count = 1;
    }

    let widgetWidth = 450 * count;

    function listStructure() {
        let noData = true;
        let keyList = Object.keys(widgetDataJson);
        let column = keyList.map((key) => {
            if (widgetDataJson[key].length > 0) {
                noData = false;
                let item = widgetDataJson[key].map((row: descriptionItem) => {
                    return itemStructure(row);
                });

                return (
                    <AutoLayout name={`${key}-column`} width={"fill-parent"} direction="vertical" spacing={10} key={key}>
                        {item}
                    </AutoLayout>
                );
            }
        });

        if (noData == true) {
            return (
                <AutoLayout
                    onClick={(e) => {
                        return new Promise((resolve) => {
                            figma.showUI(__html__, { width: 420, height: 500 });
                            figma.ui.postMessage(
                                JSON.stringify({
                                    mode: "new",
                                    id: null,
                                    type: "",
                                    content: "",
                                })
                            );
                        });
                    }}
                    fill={"#6436EA"}
                    width={"fill-parent"}
                    height={35}
                    horizontalAlignItems={"center"}
                    verticalAlignItems={"center"}
                    cornerRadius={5}
                >
                    <Text fill={"#fff"} fontSize={14} fontWeight={700} fontFamily={"Noto Sans"}>
                        Add New Description
                    </Text>
                </AutoLayout>
            );
        } else {
            return (
                <AutoLayout name="list-area" width={"fill-parent"} spacing={20}>
                    {column}
                </AutoLayout>
            );
        }
    }

    function itemStructure(data: descriptionItem) {
        let bgColor = "";
        let textColor = "";

        switch (data.type) {
            case "visible":
                bgColor = "#F0EBFD";
                textColor = "#6436EA";
                break;
            case "invisible":
                bgColor = "#FFEFEA";
                textColor = "#F66134";
                break;
            case "tracking":
                bgColor = "#ECF7FF";
                textColor = "#47B6FE";
                break;
            case "design":
                bgColor = "#E9FAEF";
                textColor = "#38C66B";
                break;
        }

        return (
            <AutoLayout
                name="item"
                width={"fill-parent"}
                direction="vertical"
                key={data.id}
                fill={"#fff"}
                stroke={"#E0E0E0"}
                strokeAlign={"inside"}
                strokeWidth={1}
                spacing={20}
                cornerRadius={10}
                padding={10}
            >
                <AutoLayout name="top-area" width={"fill-parent"} spacing={"auto"}>
                    <AutoLayout name="pointer" width={28} height={28} fill={textColor} cornerRadius={30} horizontalAlignItems={"center"} verticalAlignItems={"center"}>
                        <Text name="number" fill={"#fff"} fontSize={16} fontWeight={700}>
                            {data.id}
                        </Text>
                    </AutoLayout>

                    <AutoLayout
                        name="type-wrap"
                        width={"hug-contents"}
                        fill={bgColor}
                        padding={{
                            vertical: 4,
                            horizontal: 8,
                        }}
                        cornerRadius={5}
                    >
                        <Text name="type" fill={textColor} fontSize={14} fontWeight={700}>
                            {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                        </Text>
                    </AutoLayout>
                </AutoLayout>

                <AutoLayout
                    name="text-area"
                    fill={"#fafafa"}
                    width={"fill-parent"}
                    padding={{
                        vertical: 4,
                        horizontal: 8,
                    }}
                    cornerRadius={5}
                >
                    <Text name="description" width={"fill-parent"} fill={"#616161"} fontSize={16} lineHeight={"150%"}>
                        {data.content}
                    </Text>
                </AutoLayout>

                <AutoLayout name="btn-area" width={"fill-parent"} spacing={10}>
                    <AutoLayout
                        width={"fill-parent"}
                        height={35}
                        fill={"#F0EBFD"}
                        cornerRadius={5}
                        horizontalAlignItems={"center"}
                        verticalAlignItems={"center"}
                        onClick={(e) => {
                            deleteData(data.id, data.type);
                        }}
                    >
                        <Text fill={"#B29BF5"} fontSize={14}>
                            Delete
                        </Text>
                    </AutoLayout>

                    <AutoLayout
                        width={"fill-parent"}
                        height={35}
                        fill={"#6436EA"}
                        cornerRadius={5}
                        horizontalAlignItems={"center"}
                        verticalAlignItems={"center"}
                        onClick={(e) => {
                            return new Promise((resolve) => {
                                figma.showUI(__html__, { width: 420, height: 350 });
                                figma.ui.postMessage(
                                    JSON.stringify(
                                        Object.assign(
                                            {
                                                mode: "edit",
                                            },
                                            widgetDataJson[data.type][data.id - 1]
                                        )
                                    )
                                );
                            });
                        }}
                    >
                        <Text fill={"#fff"} fontSize={14}>
                            Edit
                        </Text>
                    </AutoLayout>

                    <AutoLayout
                        width={"fill-parent"}
                        height={35}
                        fill="#6436EA"
                        cornerRadius={5}
                        horizontalAlignItems={"center"}
                        verticalAlignItems={"center"}
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
                        <Text fill={"#fff"} fontSize={14}>
                            Make Pointer
                        </Text>
                    </AutoLayout>
                </AutoLayout>
            </AutoLayout>
        );
    }

    useEffect(() => {
        figma.ui.onmessage = (msg) => {
            if (msg.type === "add") {
                let data = JSON.parse(msg.data);
                widgetDataJson[data.type].push(data);
                setData();
            }

            if (msg.type === "edit") {
                let data = JSON.parse(msg.data);
                widgetDataJson[data.type][data.id - 1] = data;
                setData();

                const allNode: any[] = figma.currentPage.findAll();
                const allWidgetNodes: WidgetNode[] = allNode.filter((node) => {
                    return node.type === "WIDGET";
                });

                const myWidgetNodes: WidgetNode[] = allWidgetNodes.filter((node) => {
                    return node.widgetId === figma.widgetId;
                });

                const childWidgetNode: WidgetNode[] = myWidgetNodes.filter((node) => {
                    return node.widgetSyncedState.parentId === widgetId;
                });

                childWidgetNode.forEach((child) => {
                    let childId = child.widgetSyncedState.dataId;
                    let childType = child.widgetSyncedState.dataType;

                    child.setWidgetSyncedState({
                        widgetType: "child",
                        parentId: widgetId,
                        dataId: childId,
                        dataType: childType,
                        dataContent: widgetDataJson[childType][childId - 1].content,
                    });
                });
            }

            if (msg.type === "pointer") {
                let data = JSON.parse(msg.data);
                const allNode: any[] = figma.currentPage.findAll();
                const allWidgetNodes: WidgetNode[] = allNode.filter((node) => {
                    return node.type === "WIDGET";
                });

                const myWidgetNodes: WidgetNode[] = allWidgetNodes.filter((node) => {
                    return node.widgetId === figma.widgetId;
                });

                const thisWidgetNode: WidgetNode = myWidgetNodes.filter((node) => {
                    return node.id === widgetId;
                })[0];

                let childNode = thisWidgetNode.cloneWidget({
                    widgetType: "child",
                    parentId: widgetId,
                    dataType: data.type,
                    dataId: data.id,
                    dataContent: data.content,
                });

                childNode.x -= 38;
            }

            figma.closePlugin();
        };
    });

    if (widgetType == "parent") {
        usePropertyMenu(
            [
                {
                    itemType: "action",
                    propertyName: "add",
                    tooltip: "Add New Description",
                },
                {
                    itemType: "action",
                    propertyName: "new",
                    tooltip: "New Widget",
                },
            ],
            ({ propertyName, propertyValue }) => {
                if (propertyName == "add") {
                    return new Promise((resolve) => {
                        figma.showUI(__html__, { width: 420, height: 500 });
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

                if (propertyName == "new") {
                    const allNode: any[] = figma.currentPage.findAll();
                    const allWidgetNodes: WidgetNode[] = allNode.filter((node) => {
                        return node.type === "WIDGET";
                    });

                    const myWidgetNodes: WidgetNode[] = allWidgetNodes.filter((node) => {
                        return node.widgetId === figma.widgetId;
                    });

                    const thisWidgetNode: WidgetNode = myWidgetNodes.filter((node) => {
                        return node.id === widgetId;
                    })[0];

                    let cloneWidget = thisWidgetNode.cloneWidget({
                        widgetType: "parent",
                        pageTitle: "",
                        pageCaption: "",
                        widgetData: JSON.stringify({
                            visible: [],
                            invisible: [],
                            tracking: [],
                            design: [],
                        }),
                    });

                    cloneWidget.x += widgetWidth + 50;
                }
            }
        );
    }

    if (widgetType == "parent") {
        return (
            <AutoLayout
                name="wrap"
                width={widgetWidth}
                direction={"vertical"}
                spacing={60}
                padding={{ top: 50, left: 50, right: 50, bottom: 200 }}
                cornerRadius={10}
                stroke={"#E0D7FB"}
                strokeAlign={"inside"}
                strokeWidth={1}
                fill={"#FFFFFF"}
                effect={{
                    type: "drop-shadow",
                    color: { r: 0.04, g: 0.012, b: 0.121, a: 0.1 },
                    offset: { x: 0, y: 4 },
                    blur: 48,
                }}
            >
                <AutoLayout name="Page information" width={"fill-parent"} direction={"vertical"} spacing={10}>
                    <Input
                        value={pageTitle}
                        placeholder="Page Title"
                        onTextEditEnd={(e) => {
                            setPageTitle(e.characters);
                        }}
                        fontSize={24}
                        fontWeight={700}
                        fontFamily={"Noto Sans"}
                        width={"fill-parent"}
                        fill="#333"
                        inputBehavior="multiline"
                    />
                    <AutoLayout
                        width={"fill-parent"}
                        fill={"#FAFAFA"}
                        cornerRadius={10}
                        padding={{
                            vertical: 10,
                            horizontal: 20,
                        }}
                    >
                        <Input
                            value={pageCaption}
                            placeholder="Page Description"
                            onTextEditEnd={(e) => {
                                setPageCaption(e.characters);
                            }}
                            fontSize={16}
                            fontFamily={"Noto Sans"}
                            width={"fill-parent"}
                            fill="#616161"
                            inputBehavior="multiline"
                        />
                    </AutoLayout>
                </AutoLayout>
                {listStructure()}
            </AutoLayout>
        );
    } else {
        let bgColor = "";

        switch (dataType) {
            case "visible":
                bgColor = "#6436EA";
                break;
            case "invisible":
                bgColor = "#F66134";
                break;
            case "tracking":
                bgColor = "#47B6FE";
                break;
            case "design":
                bgColor = "#38C66B";
                break;
        }

        return (
            <AutoLayout
                name="wrap"
                width={28}
                height={28}
                fill={bgColor}
                cornerRadius={30}
                horizontalAlignItems={"center"}
                verticalAlignItems={"center"}
                onClick={(e) => {
                    return new Promise((resolve) => {
                        figma.showUI(__html__, { width: 420, height: 400 });
                        figma.ui.postMessage(
                            JSON.stringify({
                                mode: "view",
                                id: dataId,
                                type: dataType,
                                content: dataContent,
                            })
                        );
                    });
                }}
            >
                <Text fill={"#fff"} fontSize={16} fontWeight={700}>
                    {dataId}
                </Text>
            </AutoLayout>
        );
    }
}

widget.register(plannerWidget);
