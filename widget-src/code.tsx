import "./type.d.ts";
import { getLayoutSize, addNewData, openViewModal, getScale, setLinkData, createPinter, addChildPannelData, setPannelComplete, setAllPannelCompleteStatus, movePannelItem, deletePannelItem, arrangementWidgetData } from "./util";
import { getListStructure, getMenuStructure, makePointerStructure } from "./ui";

const { widget } = figma;
const { useWidgetNodeId, useSyncedState, useEffect, usePropertyMenu, AutoLayout, Input } = widget;

function plannerWidget() {
    const [widgetMode] = useSyncedState<string>("widgetMode", "list");

    let structure;

    if (widgetMode === "list") {
        const [descriptionType] = useSyncedState<string>("descriptionType", "");
        const [widgetTitle, setWidgetTitle] = useSyncedState<string>("widgetTitle", "");
        const [widgetCaption, setWidgetCaption] = useSyncedState<string>("widgetCaption", "");
        const [widgetOption, setWidgetOption] = useSyncedState<WidgetOption>("widgetOption", {
            fontSize: 14,
            isChanged: false,
            panelList: [
                {
                    name: "Visible",
                    code: "a",
                    bgColor: "#f0ebfd",
                    textColor: "#6436ea",
                },
                {
                    name: "Invisible",
                    code: "b",
                    bgColor: "#ffefea",
                    textColor: "#f66134",
                },
                {
                    name: "Tracking",
                    code: "c",
                    bgColor: "#ecf7ff",
                    textColor: "#47b6fe",
                },
                {
                    name: "Design",
                    code: "d",
                    bgColor: "#e9faef",
                    textColor: "#38c66b",
                },
            ],
        });
        const [widgetData, setWidgetData] = useSyncedState<WidgetData>("widgetData", {});
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
        const widgetWidth = getLayoutSize(widgetData, widgetOption);
        const menuStructure = getMenuStructure({
            menuData: menuData,
            setMenuData: setMenuData,
            widgetData: widgetData,
            widgetOption: widgetOption,
        });

        useEffect(() => {
            figma.payments?.setPaymentStatusInDevelopment({ type: "PAID" });
            // figma.payments?.setPaymentStatusInDevelopment({ type: "UNPAID" });
            console.log("test", figma.payments?.status.type);

            if (Object.keys(widgetData).length === 0) {
                let tempData: WidgetData = JSON.parse(JSON.stringify(widgetData));

                widgetOption.panelList.forEach((item) => {
                    if (tempData[item.code] === undefined) {
                        tempData[item.code] = [];
                    }
                });

                setWidgetData(tempData);
            }

            figma.ui.onmessage = (msg) => {
                const data = msg.data;

                // 설정 수정
                if (msg.type === "setSetting") {
                    setWidgetOption({
                        fontSize: data.fontSize,
                        isChanged: true,
                        panelList: data.panelList,
                    });
                    arrangementWidgetData({
                        widgetData: widgetData,
                        setWidgetData: setWidgetData,
                        widgetOption: {
                            fontSize: data.fontSize,
                            isChanged: true,
                            panelList: data.panelList,
                        },
                    });
                    figma.closePlugin();
                }

                // 링크 정보 수정
                if (msg.type === "editLink") {
                    setLinkData({
                        widgetData: widgetData,
                        setWidgetData: setWidgetData,
                        widgetOption: widgetOption,
                        data: data,
                    });
                    figma.closePlugin();
                }

                // 포인터 생성
                if (msg.type === "createPointer") {
                    createPinter({
                        widgetData: widgetData,
                        setWidgetData: setWidgetData,
                        widgetOption: widgetOption,
                        data: data,
                        widgetId: widgetId,
                    });
                    figma.closePlugin();
                }

                // 자식 패널 추가
                if (msg.type === "addChildPannel") {
                    addChildPannelData({
                        widgetData: widgetData,
                        setWidgetData: setWidgetData,
                        widgetOption: widgetOption,
                        data: data,
                    });
                    figma.closePlugin();
                }

                // 완료 설정
                if (msg.type === "complete") {
                    setPannelComplete({
                        widgetData: widgetData,
                        setWidgetData: setWidgetData,
                        data: data,
                    });
                    figma.closePlugin();
                }

                // 순서 올리기
                if (msg.type === "listUp") {
                    movePannelItem({
                        widgetData: widgetData,
                        setWidgetData: setWidgetData,
                        widgetOption: widgetOption,
                        data: data,
                        move: "up",
                    });
                    figma.closePlugin();
                }

                // 순서 내기리
                if (msg.type === "listDown") {
                    movePannelItem({
                        widgetData: widgetData,
                        setWidgetData: setWidgetData,
                        widgetOption: widgetOption,
                        data: data,
                        move: "down",
                    });
                    figma.closePlugin();
                }

                // 삭제
                if (msg.type === "deletePannel") {
                    deletePannelItem({
                        widgetData: widgetData,
                        setWidgetData: setWidgetData,
                        widgetOption: widgetOption,
                        data: data,
                    });
                    figma.closePlugin();
                }

                //     // 데이터 불러오기
                //     if (msg.type === "importData") {
                //         setImportData({ data: data, setVisibleList: setVisibleList, setInvisibleList: setInvisibleList, setTrackingList: setTrackingList, setDesignList: setDesignList });
                //         figma.closePlugin();
                //     }

                // 메세지 표기
                if (msg.type === "message") {
                    figma.notify(data.text, {
                        error: data.error ?? false,
                    });
                }

                if (msg.type === "close") {
                    figma.closePlugin();
                }
            };
        });

        const addOptions: { option: string; label: string }[] = [];

        widgetOption.panelList.forEach((option) => {
            addOptions.push({
                option: option.code,
                label: option.name,
            });
        });

        usePropertyMenu(
            [
                {
                    itemType: "dropdown",
                    propertyName: "add",
                    tooltip: "Add New Description",
                    selectedOption: descriptionType,
                    options: [{ option: "", label: "Add New" }, ...addOptions],
                },
                {
                    itemType: "action",
                    propertyName: "setting",
                    tooltip: "Setting",
                },
                {
                    itemType: "action",
                    propertyName: "complete",
                    tooltip: "Complete All",
                },
                {
                    itemType: "action",
                    propertyName: "unComplete",
                    tooltip: "Un-Complete All",
                },
                {
                    itemType: "action",
                    propertyName: "export",
                    tooltip: "Export",
                },
                {
                    itemType: "action",
                    propertyName: "import",
                    tooltip: "Import",
                },
                {
                    itemType: "action",
                    propertyName: "clone",
                    tooltip: "New Widget",
                },
            ],
            ({ propertyName, propertyValue }) => {
                // 패널 추가
                if (propertyName === "add") {
                    if (propertyValue !== undefined && propertyValue !== "") {
                        addNewData({
                            type: propertyValue,
                            widgetData: widgetData,
                            widgetOption: widgetOption,
                            setWidgetData: setWidgetData,
                        });
                    }
                }

                if (propertyName === "setting") {
                    if (figma.payments?.status.type === "UNPAID") {
                        figma.payments?.initiateCheckoutAsync();
                    } else {
                        return new Promise((resolve) => {
                            figma.showUI(__uiFiles__.setting, { width: 400, height: 600 });
                            figma.ui.postMessage(widgetOption);
                        });
                    }
                }

                if (propertyName === "complete") {
                    setAllPannelCompleteStatus({
                        status: true,
                        widgetData: widgetData,
                        setWidgetData: setWidgetData,
                    });
                }

                if (propertyName === "unComplete") {
                    setAllPannelCompleteStatus({
                        status: false,
                        widgetData: widgetData,
                        setWidgetData: setWidgetData,
                    });
                }

                // if (propertyName === "export") {
                //     return new Promise((resolve) => {
                //         dataExport({ widgetTitle: widgetTitle, visibleList: visibleList, invisibleList: invisibleList, trackingList: trackingList, designList: designList });
                //     });
                // }
                // if (propertyName === "import") {
                //     return new Promise((resolve) => {
                //         figma.showUI(__uiFiles__.import, { width: 400, height: 300 });
                //     });
                // }

                if (propertyName === "clone") {
                    const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
                    const parentNode = widgetNode?.parent as BaseNode;
                    const cloneWidgetNode = widgetNode.cloneWidget({
                        widgetMode: "list",
                        widgetTitle: "",
                        widgetCaption: "",
                        widgetData: {},
                    });

                    cloneWidgetNode.x += widgetNode.width;
                    cloneWidgetNode.x += 100;

                    if (parentNode.type === "SECTION" || parentNode.type === "GROUP" || parentNode.type === "FRAME") {
                        parentNode.appendChild(cloneWidgetNode);
                    }
                }
            }
        );

        structure = (
            <AutoLayout
                name="wrap"
                width={widgetWidth}
                direction={"vertical"}
                spacing={Math.round(50 * getScale(widgetOption.fontSize))}
                padding={Math.round(50 * getScale(widgetOption.fontSize))}
                cornerRadius={Math.round(10 * getScale(widgetOption.fontSize))}
                stroke={"#E0D7FB"}
                strokeAlign={"inside"}
                strokeWidth={Math.round(1 * getScale(widgetOption.fontSize))}
                fill={"#FFFFFF"}
                effect={{
                    type: "drop-shadow",
                    color: { r: 0.04, g: 0.012, b: 0.121, a: 0.1 },
                    offset: { x: 0, y: 4 },
                    blur: 48,
                }}
            >
                <AutoLayout name="Page information" width={"fill-parent"} direction={"vertical"} spacing={Math.round(10 * getScale(widgetOption.fontSize))}>
                    <Input
                        value={widgetTitle}
                        placeholder="Page Title"
                        onTextEditEnd={(e) => {
                            setWidgetTitle(e.characters);
                        }}
                        fontSize={Math.round(widgetOption.fontSize * 1.75)}
                        fontWeight={700}
                        fontFamily={"Inter"}
                        width={"fill-parent"}
                        fill="#333"
                        inputBehavior="multiline"
                    />
                    <Input
                        value={widgetCaption}
                        placeholder="Page Description"
                        onTextEditEnd={(e) => {
                            setWidgetCaption(e.characters);
                        }}
                        fontSize={widgetOption.fontSize}
                        fontFamily={"Inter"}
                        width={"fill-parent"}
                        fill="#616161"
                        inputBehavior="multiline"
                    />
                </AutoLayout>

                {getListStructure({
                    menuData: menuData,
                    widgetOption: widgetOption,
                    widgetData: widgetData,
                    setWidgetData: setWidgetData,
                    setMenuData: setMenuData,
                })}
                {menuStructure}
            </AutoLayout>
        );
    } else {
        const [pointerData] = useSyncedState<PointerData>("pointerData", {
            viewText: "",
            type: "",
            code: "",
            bgColor: "",
            textColor: "",
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
                    itemType: "dropdown",
                    propertyName: "arrow",
                    tooltip: "Arrow Setting",
                    selectedOption: arrowType,
                    options: [
                        { option: "none", label: "Arrow : None" },
                        { option: "top", label: "Arrow : top" },
                        { option: "right", label: "Arrow : right" },
                        { option: "bottom", label: "Arrow : bottom" },
                        { option: "left", label: "Arrow : left" },
                    ],
                },
            ],
            ({ propertyName, propertyValue }) => {
                if (propertyName === "view") {
                    return new Promise((resolve) => {
                        openViewModal(pointerData.viewText, pointerData.type, pointerData.content, pointerData.linkList, pointerData.bgColor, pointerData.textColor);
                    });
                }

                if (propertyName === "arrow") {
                    if (propertyValue !== undefined) {
                        setArrowType(propertyValue);
                    }
                }
            }
        );

        structure = makePointerStructure(pointerData, arrowType);
    }

    return structure;
}

widget.register(plannerWidget);
