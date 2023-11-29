import type { PannelData, MenuData, PointerData } from "./type";
import { getLayoutSize, addPannelData, openAddModal, editPannelData, createPinter, openViewModal, addChildPannelData, editChildPannelData } from "./util";
import { getListStructure, getMenuStructure, makePointerStructure } from "./ui";

const { widget } = figma;
const { useWidgetNodeId, useSyncedState, useEffect, usePropertyMenu, AutoLayout, Text, Input, Rectangle } = widget;

function plannerWidget() {
    const [widgetMode] = useSyncedState<string>("widgetMode", "list");

    let structure;

    if (widgetMode === "list") {
        const [widgetTitle, setWidgetTitle] = useSyncedState<string>("widgetTitle", "");
        const [widgetCaption, setWidgetCaption] = useSyncedState<string>("widgetCaption", "");
        const [visibleList, setVisibleList] = useSyncedState<PannelData[]>("visibleList", []);
        const [invisibleList, setInvisibleList] = useSyncedState<PannelData[]>("invisibleList", []);
        const [trackingList, setTrackingList] = useSyncedState<PannelData[]>("trackingList", []);
        const [designList, setDesignList] = useSyncedState<PannelData[]>("designList", []);
        const [menuData, setMenuData] = useSyncedState<MenuData>("menuData", {
            active: false,
            x: 0,
            y: 0,
            isChild: false,
            isComplate: false,
            lastCode: "",
            targetType: "",
            targetIdx: -1,
            targetParentIdx: null,
        });

        const widgetId: string = useWidgetNodeId();
        const widgetWidth = getLayoutSize({
            visibleList: visibleList,
            invisibleList: invisibleList,
            trackingList: trackingList,
            designList: designList,
        });
        const menuStructure = getMenuStructure({
            menuData: menuData,
            setMenuData: setMenuData,
            visibleList: visibleList,
            invisibleList: invisibleList,
            trackingList: trackingList,
            designList: designList,
        });

        useEffect(() => {
            figma.ui.onmessage = (msg) => {
                const data = msg.data;

                // 기본 패널 추가
                if (msg.type === "addPannel") {
                    addPannelData({
                        visibleList: visibleList,
                        invisibleList: invisibleList,
                        trackingList: trackingList,
                        designList: designList,
                        setVisibleList: setVisibleList,
                        setInvisibleList: setInvisibleList,
                        setTrackingList: setTrackingList,
                        setDesignList: setDesignList,
                        data: data,
                    });
                    figma.closePlugin();
                }

                // 자식 패널 추가
                if (msg.type === "addChildPannel") {
                    addChildPannelData({
                        visibleList: visibleList,
                        invisibleList: invisibleList,
                        trackingList: trackingList,
                        designList: designList,
                        setVisibleList: setVisibleList,
                        setInvisibleList: setInvisibleList,
                        setTrackingList: setTrackingList,
                        setDesignList: setDesignList,
                        data: data,
                    });
                    figma.closePlugin();
                }

                // 패널 정보 수정
                if (msg.type === "editPannel") {
                    editPannelData({
                        visibleList: visibleList,
                        invisibleList: invisibleList,
                        trackingList: trackingList,
                        designList: designList,
                        setVisibleList: setVisibleList,
                        setInvisibleList: setInvisibleList,
                        setTrackingList: setTrackingList,
                        setDesignList: setDesignList,
                        data: data,
                    });
                    figma.closePlugin();
                }

                // 자식 패널 정보 수정
                if (msg.type === "editChildPannel") {
                    editChildPannelData({
                        visibleList: visibleList,
                        invisibleList: invisibleList,
                        trackingList: trackingList,
                        designList: designList,
                        setVisibleList: setVisibleList,
                        setInvisibleList: setInvisibleList,
                        setTrackingList: setTrackingList,
                        setDesignList: setDesignList,
                        data: data,
                    });
                    figma.closePlugin();
                }

                // 포인터 생성
                if (msg.type === "createPointer") {
                    createPinter({
                        visibleList: visibleList,
                        invisibleList: invisibleList,
                        trackingList: trackingList,
                        designList: designList,
                        setVisibleList: setVisibleList,
                        setInvisibleList: setInvisibleList,
                        setTrackingList: setTrackingList,
                        setDesignList: setDesignList,
                        data: data,
                        widgetId: widgetId,
                    });
                    console.log(data);
                    figma.closePlugin();
                }

                // 메세지 표기
                if (msg.type === "message") {
                    figma.notify(data.text, {
                        error: data.error,
                    });
                }

                if (msg.type === "close") {
                    figma.closePlugin();
                }
            };
        });

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
                if (propertyName === "add") {
                    return new Promise((resolve) => {
                        openAddModal();
                    });
                }
            }
        );

        structure = (
            <AutoLayout
                name="wrap"
                width={widgetWidth}
                direction={"vertical"}
                spacing={50}
                padding={50}
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
                        value={widgetTitle}
                        placeholder="Page Title"
                        onTextEditEnd={(e) => {
                            setWidgetTitle(e.characters);
                        }}
                        fontSize={24}
                        fontWeight={700}
                        fontFamily={"Inter"}
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
                            value={widgetCaption}
                            placeholder="Page Description"
                            onTextEditEnd={(e) => {
                                setWidgetCaption(e.characters);
                            }}
                            fontSize={16}
                            fontFamily={"Inter"}
                            width={"fill-parent"}
                            fill="#616161"
                            inputBehavior="multiline"
                        />
                    </AutoLayout>
                </AutoLayout>

                {getListStructure({
                    visibleList: visibleList,
                    invisibleList: invisibleList,
                    trackingList: trackingList,
                    designList: designList,
                    menuData: menuData,
                    setMenuData: setMenuData,
                })}
                {menuStructure}
            </AutoLayout>
        );
    } else {
        const [pointerData] = useSyncedState<PointerData>("pointerData", {
            viewText: "",
            type: "",
            content: "",
            linkList: [],
            index: -1,
            parentIndex: null,
            parentWidgetId: "",
        });
        const [arrowType, setArrowType] = useSyncedState<string>("arrowType", "none");

        useEffect(() => {
            figma.ui.onmessage = (msg) => {
                figma.closePlugin();
            };
        });

        usePropertyMenu(
            [
                {
                    itemType: "action",
                    propertyName: "view",
                    tooltip: "View info",
                },
                {
                    itemType: "action",
                    propertyName: "arrow",
                    tooltip: `Arrow : ${arrowType}`,
                },
            ],
            ({ propertyName, propertyValue }) => {
                if (propertyName === "view") {
                    return new Promise((resolve) => {
                        openViewModal(pointerData.viewText, pointerData.type, pointerData.content, pointerData.linkList);
                    });
                }

                if (propertyName === "arrow") {
                    switch (arrowType) {
                        case "none":
                            setArrowType("top");
                            break;
                        case "top":
                            setArrowType("right");
                            break;
                        case "right":
                            setArrowType("bottom");
                            break;
                        case "bottom":
                            setArrowType("left");
                            break;
                        case "left":
                            setArrowType("none");
                            break;
                    }
                }
            }
        );

        structure = makePointerStructure(pointerData, arrowType);
    }

    return structure;
}

widget.register(plannerWidget);
