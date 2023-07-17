import type { DescriptionItem, WidgetData, DisplayItemData } from "./type";
import { saveAndArrangementData } from "./util";

const { widget } = figma;
const { useWidgetId, useSyncedState, usePropertyMenu, AutoLayout, Text, Input, useEffect } = widget;

function plannerWidget() {
    const [widgetType] = useSyncedState<string>("widgetType", "parent");
    const [parentWidgetId] = useSyncedState<string>("parentWidgetId", "");
    const [code] = useSyncedState<string>("code", "");
    const [displayData] = useSyncedState<DisplayItemData>("displayData", {
        displayNumber: "",
        type: "",
        content: "",
    });
    const [widgetData, setWidgetData] = useSyncedState<WidgetData>("widgetData", {
        visible: [],
        invisible: [],
        tracking: [],
        design: [],
    });
    const [pageTitle, setPageTitle] = useSyncedState<string>("pageTitle", "");
    const [pageCaption, setPageCaption] = useSyncedState<string>("pageCaption", "");
    const widgetId: string = useWidgetId();

    let count = 0;
    const keyList = Object.keys(widgetData);

    keyList.map((key) => {
        if (widgetData[key].length > 0) {
            count += 1;
        }
    });

    if (count == 0) {
        count = 1;
    }

    const widgetWidth = 500 * count;

    // 번호 포인터로 가기
    function goToNumber(id: number, type: string) {
        const allNode: BaseNode[] = figma.currentPage.findAll();
        const targetNode: BaseNode[] = allNode.filter((node: BaseNode) => {
            if (node.type === "WIDGET" && node.widgetSyncedState.parentWidgetId === widgetId) {
                const childType = node.widgetSyncedState.dataType;
                const childId = node.widgetSyncedState.dataId;

                if (childId == id && childType == type) {
                    return node;
                }
            }
        });

        if (targetNode.length == 0) {
            figma.notify("You didn't have this Description Number pointer.");
        } else {
            figma.viewport.scrollAndZoomIntoView(targetNode);
        }
    }

    // 정보 삭제
    function deleteData(id: number, type: string) {
        const allNode: BaseNode[] = figma.currentPage.findAll();
        const targetNode: any[] = allNode.filter((node: BaseNode) => {
            if (node.type === "WIDGET" && node.widgetSyncedState.parentWidgetId === widgetId) {
                const childType = node.widgetSyncedState.dataType;

                if (childType == type) {
                    return node;
                }
            }
        });

        widgetData[type].splice(id - 1, 1);
        saveAndArrangementData(widgetData, setWidgetData);

        targetNode.forEach((child) => {
            const childType = child.widgetSyncedState.dataType;
            const childId = child.widgetSyncedState.dataId;

            if (childId == id) {
                child.remove();
            }

            if (childId > id) {
                child.setWidgetSyncedState({
                    widgetType: "child",
                    parentWidgetId: widgetId,
                    dataId: childId - 1,
                    dataType: childType,
                    dataContent: widgetData[childType][childId - 2].content,
                });
            }
        });
    }

    function listStructure() {
        let noData = true;
        let keyList = Object.keys(widgetData);
        let column = keyList.map((key) => {
            if (widgetData[key].length > 0) {
                noData = false;
                let item = widgetData[key].map((row: DescriptionItem) => {
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
                            figma.ui.postMessage({
                                mode: "new",
                                id: -1,
                                type: "",
                                content: "",
                            });
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
                <AutoLayout name="content-area" width={"fill-parent"} spacing={20} direction="vertical">
                    <AutoLayout
                        name="text-box"
                        width={"fill-parent"}
                        height={"hug-contents"}
                        fill={"#fff8f8"}
                        padding={{
                            vertical: 4,
                            horizontal: 10,
                        }}
                    >
                        <Text fill={"#e84e4e"} width={"fill-parent"} fontSize={14} fontWeight={700} fontFamily={"Noto Sans"}>
                            * Clicking on a pointer moves to that pointer's location.
                        </Text>
                    </AutoLayout>

                    <AutoLayout name="list-area" width={"fill-parent"} spacing={20}>
                        {column}
                    </AutoLayout>
                </AutoLayout>
            );
        }
    }

    function itemStructure(data: DescriptionItem) {
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
            <AutoLayout name="item" width={"fill-parent"} direction="vertical" key={data.id} fill={"#fff"} stroke={"#E0E0E0"} strokeAlign={"inside"} strokeWidth={1} spacing={20} cornerRadius={10} padding={10}>
                <AutoLayout name="top-area" width={"fill-parent"} spacing={"auto"} opacity={data.complete ? 0.3 : 1}>
                    <AutoLayout
                        name="pointer"
                        width={28}
                        height={28}
                        fill={textColor}
                        cornerRadius={30}
                        horizontalAlignItems={"center"}
                        verticalAlignItems={"center"}
                        onClick={(e) => {
                            goToNumber(data.id, data.type);
                        }}
                    >
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
                    opacity={data.complete ? 0.3 : 1}
                >
                    <Text name="description" width={"fill-parent"} fill={"#616161"} fontSize={16} lineHeight={"150%"}>
                        {data.content}
                    </Text>
                </AutoLayout>

                {data.complete ? (
                    <AutoLayout name="btn-area" width={"fill-parent"} spacing={10}>
                        <AutoLayout
                            width={"fill-parent"}
                            height={35}
                            fill={"#6436EA"}
                            cornerRadius={5}
                            horizontalAlignItems={"center"}
                            verticalAlignItems={"center"}
                            opacity={0.3}
                            hoverStyle={{
                                opacity: 1,
                            }}
                            onClick={(e) => {
                                widgetData[data.type][data.id - 1].complete = false;
                                saveAndArrangementData(widgetData, setWidgetData);
                            }}
                        >
                            <Text fill={"#fff"} fontSize={14}>
                                uncomplete
                            </Text>
                        </AutoLayout>
                    </AutoLayout>
                ) : (
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
                                        Object.assign(
                                            {
                                                mode: "edit",
                                            },
                                            widgetData[data.type][data.id - 1]
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
                                    figma.ui.postMessage(widgetData[data.type][data.id - 1]);
                                });
                            }}
                        >
                            <Text fill={"#fff"} fontSize={14}>
                                Make Pointer
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
                                widgetData[data.type][data.id - 1].complete = true;
                                saveAndArrangementData(widgetData, setWidgetData);
                            }}
                        >
                            <Text fill={"#fff"} fontSize={14}>
                                complete
                            </Text>
                        </AutoLayout>
                    </AutoLayout>
                )}
            </AutoLayout>
        );
    }

    useEffect(() => {
        figma.ui.onmessage = (msg) => {
            if (msg.type === "add") {
                let data = msg.data;
                widgetData[data.type].push(data);
                saveAndArrangementData(widgetData, setWidgetData);
            }

            if (msg.type === "edit") {
                let data = msg.data;
                widgetData[data.type][data.id - 1] = data;
                saveAndArrangementData(widgetData, setWidgetData);

                const allNode: any[] = figma.currentPage.findAll();
                const allWidgetNodes: WidgetNode[] = allNode.filter((node) => {
                    return node.type === "WIDGET";
                });

                const myWidgetNodes: WidgetNode[] = allWidgetNodes.filter((node) => {
                    return node.widgetId === figma.widgetId;
                });

                const childWidgetNode: WidgetNode[] = myWidgetNodes.filter((node) => {
                    return node.widgetSyncedState.parentWidgetId === widgetId;
                });

                childWidgetNode.forEach((child) => {
                    let childId = child.widgetSyncedState.dataId;
                    let childType = child.widgetSyncedState.dataType;

                    child.setWidgetSyncedState({
                        widgetType: "child",
                        parentWidgetId: widgetId,
                        dataId: childId,
                        dataType: childType,
                        dataContent: widgetData[childType][childId - 1].content,
                    });
                });
            }

            if (msg.type === "pointer") {
                let data = msg.data;
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
                    parentWidgetId: widgetId,
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
                    propertyName: "complete",
                    tooltip: "Complete All",
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
                        figma.ui.postMessage({
                            mode: "new",
                            id: -1,
                            type: "",
                            content: "",
                        });
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
                        widgetData: {
                            visible: [],
                            invisible: [],
                            tracking: [],
                            design: [],
                        },
                    });

                    cloneWidget.x += widgetWidth + 50;
                }

                if (propertyName == "complete") {
                    for (let [key, value] of Object.entries(widgetData)) {
                        widgetData[key].forEach((row) => {
                            row.complete = true;
                        });
                    }
                    saveAndArrangementData(widgetData, setWidgetData);
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
                        figma.ui.postMessage({
                            mode: "view",
                            id: dataId,
                            type: dataType,
                            content: dataContent,
                        });
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
