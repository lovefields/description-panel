import type { PannelData, ChildPannelData, MenuData, LinkItem, PointerData } from "./type";
import { isEmptyList, openViewModal, goToNumber, openLinkEditModal } from "./util";

const { widget } = figma;
const { useWidgetNodeId, AutoLayout, Text, Rectangle, SVG, Input } = widget;

export function getListStructure({ visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList, menuData, setMenuData }: { visibleList: PannelData[]; invisibleList: PannelData[]; trackingList: PannelData[]; designList: PannelData[]; setVisibleList: Function; setInvisibleList: Function; setTrackingList: Function; setDesignList: Function; menuData: MenuData; setMenuData: Function }) {
    if (isEmptyList({ visibleList, invisibleList, trackingList, designList }) === true) {
        return (
            <AutoLayout direction="vertical" spacing={5} width={"fill-parent"} horizontalAlignItems={"center"} verticalAlignItems={"center"} cornerRadius={5}>
                <Text fill={"#333"} fontSize={16} fontWeight={700} fontFamily={"Inter"}>
                    No List
                </Text>
                <Text fill={"#333"} fontSize={16} fontWeight={700} fontFamily={"Inter"}>
                    Add some Description, please.
                </Text>
            </AutoLayout>
        );
    } else {
        const visibleStructure: any = createPannelColList(visibleList, setVisibleList, "visible", menuData, setMenuData);
        const invisibleStructure: any = createPannelColList(invisibleList, setInvisibleList, "invisible", menuData, setMenuData);
        const trackingStructure: any = createPannelColList(trackingList, setTrackingList, "tracking", menuData, setMenuData);
        const designStructure: any = createPannelColList(designList, setDesignList, "design", menuData, setMenuData);

        return (
            <AutoLayout name="content-area" width={"fill-parent"} spacing={20} padding={{ bottom: 200 }} direction="vertical" overflow="visible">
                <AutoLayout
                    name="text-box"
                    direction="vertical"
                    width={"hug-contents"}
                    height={"hug-contents"}
                    fill={"#fff8f8"}
                    spacing={4}
                    padding={{
                        vertical: 4,
                        horizontal: 10,
                    }}
                >
                    <Text fill={"#e84e4e"} width={"fill-parent"} fontSize={14} fontWeight={700} fontFamily={"Inter"}>
                        * Clicking on a pointer moves to that pointer's location.
                    </Text>

                    <Text fill={"#e84e4e"} width={"fill-parent"} fontSize={14} fontWeight={700} fontFamily={"Inter"}>
                        * A event that travels on a same link doesn't work twice in a row.
                    </Text>
                </AutoLayout>

                <AutoLayout name="list-area" width={"fill-parent"} spacing={20} overflow="visible">
                    {visibleStructure}
                    {invisibleStructure}
                    {trackingStructure}
                    {designStructure}
                </AutoLayout>
            </AutoLayout>
        );
    }
}

function createPannelColList(listData: PannelData[], setData: Function, type: string, menuData: MenuData, setMenuData: Function) {
    if (listData.length > 0) {
        const row = listData.map((pannel: PannelData, i: number) => {
            const childList = pannel.childList.map((item) => {
                return createPannel(item, type, true, menuData, setMenuData, setData, listData);
            });

            return (
                <AutoLayout name="row" width={"fill-parent"} direction="vertical" spacing={10} key={i} overflow="visible">
                    {createPannel(pannel, type, false, menuData, setMenuData, setData, listData)}
                    {pannel.childList.length > 0 ? (
                        <AutoLayout
                            name="chld-row"
                            width={"fill-parent"}
                            direction="vertical"
                            spacing={10}
                            padding={{
                                left: 20,
                            }}
                            overflow="visible"
                        >
                            {childList}
                        </AutoLayout>
                    ) : null}
                </AutoLayout>
            );
        });

        return (
            <AutoLayout name="column" width={"fill-parent"} direction="vertical" spacing={10} overflow="visible">
                {row}
            </AutoLayout>
        );
    } else {
        return null;
    }
}

function createPannel(data: PannelData | ChildPannelData, type: string, isChild: boolean, menuData: MenuData, setMenuData: Function, setData: Function, listData: PannelData[]) {
    const widgetId = useWidgetNodeId();
    const linkListStructure = getLinkListStructure(data.linkList);
    let bgColor = "";
    let textColor = "";

    switch (type) {
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
        <AutoLayout name="item" width={"fill-parent"} direction="vertical" key={data.code} fill={"#fff"} stroke={"#E0E0E0"} strokeAlign={"inside"} strokeWidth={1} spacing={20} cornerRadius={10} padding={10} overflow="visible">
            <AutoLayout name="top-area" width={"fill-parent"} spacing={"auto"} opacity={data.complete ? 0.3 : 1} overflow="visible">
                <AutoLayout
                    name="pointer"
                    width="hug-contents"
                    height={24}
                    fill={textColor}
                    padding={{
                        horizontal: 10,
                        vertical: 0,
                    }}
                    cornerRadius={8}
                    horizontalAlignItems={"center"}
                    verticalAlignItems={"center"}
                    onClick={(event) => {
                        goToNumber(data.pointerList);
                    }}
                >
                    <Text name="number" fill={"#fff"} fontSize={16} fontWeight={700}>
                        {isChild ? `${(data as ChildPannelData).parentIndex + 1}-${data.index + 1}` : String(data.index + 1)}
                    </Text>
                </AutoLayout>

                <AutoLayout name="right-aerae" width={"hug-contents"} spacing={5} verticalAlignItems={"center"} overflow="visible">
                    <AutoLayout
                        name="type"
                        width={"hug-contents"}
                        fill={bgColor}
                        padding={{
                            vertical: 4,
                            horizontal: 8,
                        }}
                        cornerRadius={5}
                    >
                        <Text name="type" fill={textColor} fontSize={14} fontWeight={700} fontFamily={"Inter"}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                    </AutoLayout>

                    <AutoLayout
                        name="btn-menu"
                        direction="vertical"
                        width={24}
                        height={24}
                        horizontalAlignItems={"center"}
                        verticalAlignItems={"center"}
                        spacing={2}
                        onClick={(event) => {
                            let openLogic = true;

                            if (menuData.active === true) {
                                if (menuData.lastCode === data.code) {
                                    openLogic = false;
                                }
                            }

                            if (openLogic === true) {
                                const widget = figma.getNodeById(widgetId) as WidgetNode;
                                const parentNode = widget.parent;
                                let clientX = event.canvasX;
                                let clientY = event.canvasY;

                                if (parentNode !== null) {
                                    if (parentNode.type === "SECTION" || parentNode.type === "FRAME") {
                                        clientX -= parentNode.x;
                                        clientY -= parentNode.y;
                                    }
                                }

                                setMenuData({
                                    active: true,
                                    x: clientX - widget.x - 167,
                                    y: clientY - widget.y + 10,
                                    isChild: isChild,
                                    isComplate: data.complete,
                                    lastCode: data.code,
                                    targetType: type,
                                    targetIdx: data.index,
                                    targetParentIdx: isChild ? (data as ChildPannelData).parentIndex : null,
                                });

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        setMenuData({
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
                                        resolve(true);
                                    }, 5000);
                                });
                            } else {
                                setMenuData({
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
                            }
                        }}
                        overflow="visible"
                    >
                        <Rectangle width={4} height={4} fill={"#a4a4a4"} cornerRadius={4} />
                        <Rectangle width={4} height={4} fill={"#a4a4a4"} cornerRadius={4} />
                        <Rectangle width={4} height={4} fill={"#a4a4a4"} cornerRadius={4} />
                    </AutoLayout>
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
                {data.complete ? (
                    <Text name="description" width={"fill-parent"} fill={"#616161"} fontSize={16} lineHeight={"150%"} fontFamily={"Inter"}>
                        {decodeURI(data.content)}
                    </Text>
                ) : (
                    <Input
                        name="description"
                        width={"fill-parent"}
                        fill={"#616161"}
                        fontSize={16}
                        lineHeight={"150%"}
                        fontFamily={"Inter"}
                        value={decodeURI(data.content)}
                        placeholder="Write Description"
                        onTextEditEnd={(e) => {
                            const textData = e.characters.replaceAll("\n", "\u2028");

                            if (isChild === true) {
                                listData[(data as ChildPannelData).parentIndex].childList[data.index].content = textData;
                            } else {
                                listData[data.index].content = textData;
                            }

                            data.pointerList.forEach((nodeId) => {
                                const widgetNode = figma.getNodeById(nodeId) as WidgetNode | null;

                                if (widgetNode !== null) {
                                    let defaultData = {
                                        ...(widgetNode.widgetSyncedState["pointerData"] as PointerData),
                                        content: textData,
                                    };

                                    widgetNode.setWidgetSyncedState({
                                        widgetMode: "pointer",
                                        pointerData: defaultData,
                                        arrowType: widgetNode.widgetSyncedState["arrowType"],
                                    });
                                }
                            });

                            setData(listData);
                        }}
                    ></Input>
                )}
            </AutoLayout>

            {linkListStructure}
        </AutoLayout>
    );

    function getLinkListStructure(list: LinkItem[]) {
        if (list.length > 0) {
            const listStructure = list.map((item, i) => {
                return (
                    <AutoLayout
                        width={"hug-contents"}
                        height={"hug-contents"}
                        padding={{
                            horizontal: 10,
                            vertical: 2,
                        }}
                        fill="#E3F4FF"
                        cornerRadius={4}
                        key={i}
                    >
                        <Text
                            fill="#4092C7"
                            fontSize={14}
                            onClick={() => {
                                return new Promise((resolve) => {
                                    figma.showUI(`<script>window.onmessage = (event) => {
                                    window.open(event.data.pluginMessage);
                                    parent.postMessage({ pluginMessage: { type: "close" } }, "*");
                                }</script>`);
                                    figma.ui.postMessage(item.value);
                                });
                            }}
                        >
                            {item.name}
                        </Text>
                    </AutoLayout>
                );
            });

            return (
                <AutoLayout name="link-list" wrap={true} width="fill-parent" spacing={4}>
                    {listStructure}
                </AutoLayout>
            );
        } else {
            return null;
        }
    }
}

export function getMenuStructure({ menuData, setMenuData, visibleList, invisibleList, trackingList, designList }: { menuData: MenuData; setMenuData: Function; visibleList: PannelData[]; invisibleList: PannelData[]; trackingList: PannelData[]; designList: PannelData[] }) {
    if (menuData.active === true) {
        let menuList: any = [];
        let targetData: PannelData | ChildPannelData;

        switch (menuData.targetType) {
            case "visible":
                targetData = menuData.isChild ? visibleList[menuData.targetParentIdx as number].childList[menuData.targetIdx] : visibleList[menuData.targetIdx];
                break;
            case "invisible":
                targetData = menuData.isChild ? invisibleList[menuData.targetParentIdx as number].childList[menuData.targetIdx] : invisibleList[menuData.targetIdx];
                break;
            case "tracking":
                targetData = menuData.isChild ? trackingList[menuData.targetParentIdx as number].childList[menuData.targetIdx] : trackingList[menuData.targetIdx];
                break;
            case "design":
                targetData = menuData.isChild ? designList[menuData.targetParentIdx as number].childList[menuData.targetIdx] : designList[menuData.targetIdx];
                break;
        }

        // 편집 버튼
        menuList.push(
            <AutoLayout
                name="btn"
                width={"fill-parent"}
                verticalAlignItems="center"
                height={30}
                fill={"#fff"}
                cornerRadius={5}
                hoverStyle={{
                    fill: "#6436EA",
                }}
                onClick={() => {
                    return new Promise((resolve) => {
                        openLinkEditModal(menuData.targetType, menuData.isChild, targetData);
                        setMenuData({
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
                    });
                }}
                key={0}
            >
                <Text
                    width={"fill-parent"}
                    fill={"#616161"}
                    fontSize={14}
                    fontWeight={700}
                    lineHeight={"auto"}
                    horizontalAlignText="center"
                    fontFamily={"Noto Sans"}
                    hoverStyle={{
                        fill: "#fff",
                    }}
                >
                    Link Eidt
                </Text>
            </AutoLayout>
        );

        // 포인트 생성 버튼
        menuList.push(
            <AutoLayout
                name="btn"
                width={"fill-parent"}
                verticalAlignItems="center"
                height={30}
                fill={"#fff"}
                cornerRadius={5}
                hoverStyle={{
                    fill: "#6436EA",
                }}
                onClick={(e) => {
                    return new Promise((resolve) => {
                        figma.showUI(`
                            <script>
                                window.onmessage = (event) => {
                                    const data = event.data.pluginMessage;
                                    parent.postMessage({ pluginMessage: { type: "createPointer", data: data } }, "*");
                                };
                            </script>
                        `);
                        figma.ui.postMessage({
                            pannelType: menuData.targetType,
                            isChild: menuData.isChild,
                            pannelData: targetData,
                        });
                        setMenuData({
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
                    });
                }}
                key={1}
            >
                <Text
                    width={"fill-parent"}
                    fill={"#616161"}
                    fontSize={14}
                    fontWeight={700}
                    lineHeight={"auto"}
                    horizontalAlignText="center"
                    fontFamily={"Noto Sans"}
                    hoverStyle={{
                        fill: "#fff",
                    }}
                >
                    Make Pointer
                </Text>
            </AutoLayout>
        );

        if (menuData.isChild === false) {
            // 자식 생성 버튼
            menuList.push(
                <AutoLayout
                    name="btn"
                    width={"fill-parent"}
                    verticalAlignItems="center"
                    height={30}
                    fill={"#fff"}
                    cornerRadius={5}
                    hoverStyle={{
                        fill: "#6436EA",
                    }}
                    onClick={() => {
                        return new Promise((resolve) => {
                            figma.showUI(`
                                <script>
                                    window.onmessage = (event) => {
                                        const data = event.data.pluginMessage;
                                        parent.postMessage({ pluginMessage: { type: "addChildPannel", data: data } }, "*");
                                    };
                                </script>
                            `);
                            figma.ui.postMessage({
                                pannelType: menuData.targetType,
                                pannelData: targetData as PannelData,
                            });
                            setMenuData({
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
                        });
                    }}
                    key={2}
                >
                    <Text
                        width={"fill-parent"}
                        fill={"#616161"}
                        fontSize={14}
                        fontWeight={700}
                        lineHeight={"auto"}
                        horizontalAlignText="center"
                        fontFamily={"Noto Sans"}
                        hoverStyle={{
                            fill: "#fff",
                        }}
                    >
                        Make Sub
                    </Text>
                </AutoLayout>
            );
        }

        // 완료 버튼
        menuList.push(
            <AutoLayout
                name="btn"
                width={"fill-parent"}
                verticalAlignItems="center"
                height={30}
                fill={"#fff"}
                cornerRadius={5}
                hoverStyle={{
                    fill: "#6436EA",
                }}
                onClick={(e) => {
                    return new Promise((resolve) => {
                        figma.showUI(`
                            <script>
                                window.onmessage = (event) => {
                                    const data = event.data.pluginMessage;
                                    parent.postMessage({ pluginMessage: { type: "complete", data: data } }, "*");
                                };
                            </script>
                        `);
                        figma.ui.postMessage({
                            pannelType: menuData.targetType,
                            isChild: menuData.isChild,
                            pannelData: targetData,
                        });
                        setMenuData({
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
                    });
                }}
                key={3}
            >
                <Text
                    width={"fill-parent"}
                    fill={"#616161"}
                    fontSize={14}
                    fontWeight={700}
                    lineHeight={"auto"}
                    horizontalAlignText="center"
                    fontFamily={"Noto Sans"}
                    hoverStyle={{
                        fill: "#fff",
                    }}
                >
                    {
                        // @ts-ignore: 선언 된 항목임
                        targetData.complete ? "Un-Complete" : "Complete"
                    }
                </Text>
            </AutoLayout>
        );

        // 순서 이동 (위)
        menuList.push(
            <AutoLayout
                name="btn"
                width={"fill-parent"}
                verticalAlignItems="center"
                height={30}
                fill={"#fff"}
                cornerRadius={5}
                hoverStyle={{
                    fill: "#6436EA",
                }}
                onClick={(e) => {
                    return new Promise((resolve) => {
                        figma.showUI(`
                            <script>
                                window.onmessage = (event) => {
                                    const data = event.data.pluginMessage;
                                    parent.postMessage({ pluginMessage: { type: "listUp", data: data } }, "*");
                                };
                            </script>
                        `);
                        figma.ui.postMessage({
                            pannelType: menuData.targetType,
                            isChild: menuData.isChild,
                            pannelData: targetData,
                        });
                        setMenuData({
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
                    });
                }}
                key={4}
            >
                <Text
                    width={"fill-parent"}
                    fill={"#616161"}
                    fontSize={14}
                    fontWeight={700}
                    lineHeight={"auto"}
                    horizontalAlignText="center"
                    fontFamily={"Noto Sans"}
                    hoverStyle={{
                        fill: "#fff",
                    }}
                >
                    Move up
                </Text>
            </AutoLayout>
        );

        // 순서 이동 (아래)
        menuList.push(
            <AutoLayout
                name="btn"
                width={"fill-parent"}
                verticalAlignItems="center"
                height={30}
                fill={"#fff"}
                cornerRadius={5}
                hoverStyle={{
                    fill: "#6436EA",
                }}
                onClick={(e) => {
                    return new Promise((resolve) => {
                        figma.showUI(`
                            <script>
                                window.onmessage = (event) => {
                                    const data = event.data.pluginMessage;
                                    parent.postMessage({ pluginMessage: { type: "listDown", data: data } }, "*");
                                };
                            </script>
                        `);
                        figma.ui.postMessage({
                            pannelType: menuData.targetType,
                            isChild: menuData.isChild,
                            pannelData: targetData,
                        });
                        setMenuData({
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
                    });
                }}
                key={5}
            >
                <Text
                    width={"fill-parent"}
                    fill={"#616161"}
                    fontSize={14}
                    fontWeight={700}
                    lineHeight={"auto"}
                    horizontalAlignText="center"
                    fontFamily={"Noto Sans"}
                    hoverStyle={{
                        fill: "#fff",
                    }}
                >
                    Move Down
                </Text>
            </AutoLayout>
        );

        // 삭제 버튼
        menuList.push(
            <AutoLayout
                name="btn"
                width={"fill-parent"}
                verticalAlignItems="center"
                height={30}
                fill={"#fff"}
                cornerRadius={5}
                hoverStyle={{
                    fill: "#6436EA",
                }}
                onClick={(e) => {
                    return new Promise((resolve) => {
                        figma.showUI(`
                            <script>
                                window.onmessage = (event) => {
                                    const data = event.data.pluginMessage;
                                    parent.postMessage({ pluginMessage: { type: "deletePannel", data: data } }, "*");
                                };
                            </script>
                        `);
                        figma.ui.postMessage({
                            pannelType: menuData.targetType,
                            isChild: menuData.isChild,
                            pannelData: targetData,
                        });
                        setMenuData({
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
                    });
                }}
                key={6}
            >
                <Text
                    width={"fill-parent"}
                    fill={"#616161"}
                    fontSize={14}
                    fontWeight={700}
                    lineHeight={"auto"}
                    horizontalAlignText="center"
                    fontFamily={"Noto Sans"}
                    hoverStyle={{
                        fill: "#fff",
                    }}
                >
                    Delete
                </Text>
            </AutoLayout>
        );

        return (
            <AutoLayout
                name="btn-area"
                positioning="absolute"
                width={157}
                x={menuData.x}
                y={menuData.y}
                padding={10}
                direction="vertical"
                spacing={5}
                fill={"#fff"}
                cornerRadius={10}
                effect={{
                    type: "drop-shadow",
                    color: { r: 0.04, g: 0.012, b: 0.121, a: 0.1 },
                    offset: { x: 0, y: 4 },
                    blur: 48,
                }}
                key="item-menu"
            >
                {menuList}
            </AutoLayout>
        );
    } else {
        return null;
    }
}

// 포인터 구조 생성 함수
export function makePointerStructure(pointerData: PointerData, arrowType: string) {
    const structure = [];
    let isVertical = false;
    let bgColor = "";

    switch (pointerData.type) {
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

    if (arrowType === "top" || arrowType === "bottom") {
        isVertical = true;
    }

    if (arrowType === "top") {
        const arrow = `<svg viewBox="0 0 14 7" fill="none">
            <path d="M7 0 14 7 0 7Z7 0" fill="${bgColor}" />
        </svg>`;
        structure.push(<SVG src={arrow} key="arrow"></SVG>);
    }

    if (arrowType === "left") {
        const arrow = `<svg viewBox="0 0 7 14" fill="none">
            <path d="M7 0 7 14 0 7Z7 0" fill="${bgColor}" />
        </svg>`;
        structure.push(<SVG src={arrow} key="arrow"></SVG>);
    }

    // 포인터
    structure.push(
        <AutoLayout
            name="pointer"
            height={28}
            fill={bgColor}
            padding={{
                horizontal: 10,
                vertical: 0,
            }}
            cornerRadius={8}
            horizontalAlignItems={"center"}
            verticalAlignItems={"center"}
            onClick={(e) => {
                return new Promise((resolve) => {
                    openViewModal(pointerData.viewText, pointerData.type, pointerData.content, pointerData.linkList);
                });
            }}
            key="pointer"
        >
            <Text name="number" fill={"#fff"} fontSize={16} fontWeight={700}>
                {pointerData.viewText}
            </Text>
        </AutoLayout>
    );

    if (arrowType === "right") {
        const arrow = `<svg viewBox="0 0 7 14" fill="none">
            <path d="M0 0 7 7 0 14Z0 0" fill="${bgColor}" />
        </svg>`;
        structure.push(<SVG src={arrow} key="arrow"></SVG>);
    }

    if (arrowType === "bottom") {
        const arrow = `<svg viewBox="0 0 14 7" fill="none">
            <path d="M0 0 7 7 14 0Z0 0" fill="${bgColor}" />
        </svg>`;
        structure.push(<SVG src={arrow} key="arrow"></SVG>);
    }

    return (
        <AutoLayout name="wrap" width="hug-contents" direction={isVertical ? "vertical" : "horizontal"} horizontalAlignItems={"center"} verticalAlignItems={"center"}>
            {structure}
        </AutoLayout>
    );
}
