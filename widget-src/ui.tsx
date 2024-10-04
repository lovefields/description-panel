import "./type.d.ts";
import { isEmptyList, openViewModal, goToNumber, openLinkEditModal, getMenuPosition, getScale } from "./util";
// @ts-ignore
import dayjs from "dayjs";

const { widget } = figma;
const { useWidgetNodeId, AutoLayout, Text, Rectangle, SVG, Input } = widget;

export function getListStructure({ widgetOption, widgetData, setWidgetData, menuData, setMenuData }: { widgetOption: WidgetOption; widgetData: WidgetData; menuData: MenuData; setWidgetData: Function; setMenuData: Function }) {
    if (isEmptyList(widgetData) === true) {
        // 값 없는 경우

        return (
            <AutoLayout direction="vertical" spacing={Math.round(5 * getScale(widgetOption.fontSize))} padding={{ vertical: Math.round(12 * getScale(widgetOption.fontSize)), horizontal: Math.round(20 * getScale(widgetOption.fontSize)) }} fill={"#FAFAFA"} width={"fill-parent"} horizontalAlignItems={"center"} verticalAlignItems={"center"} cornerRadius={Math.round(10 * getScale(widgetOption.fontSize))}>
                <Text fill={"#333"} fontSize={Math.round(widgetOption.fontSize * 1.12)} fontWeight={700} fontFamily={"Inter"}>
                    This widget didn't have List.
                </Text>

                <Text fill={"#333"} fontSize={Math.round(widgetOption.fontSize * 1.12)} fontWeight={700} fontFamily={"Inter"}>
                    Add some Description please.
                </Text>
            </AutoLayout>
        );
    } else {
        // 값 있는 경우

        const panelListStructure: any = createPannelListStructure({ widgetOption, widgetData, setWidgetData, menuData, setMenuData });

        return (
            <AutoLayout name="content-area" width={"fill-parent"} spacing={Math.round(20 * getScale(widgetOption.fontSize))} padding={{ bottom: Math.round(200 * getScale(widgetOption.fontSize)) }} direction="vertical" overflow="visible">
                {/* <AutoLayout
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
                </AutoLayout> */}

                <AutoLayout name="list-area" width={"fill-parent"} spacing={Math.round(20 * getScale(widgetOption.fontSize))} overflow="visible">
                    {...panelListStructure}
                </AutoLayout>
            </AutoLayout>
        );
    }

    //     const visibleStructure: any = createPannelColList(visibleList, setVisibleList, "visible", menuData, setMenuData);
    //     const invisibleStructure: any = createPannelColList(invisibleList, setInvisibleList, "invisible", menuData, setMenuData);
    //     const trackingStructure: any = createPannelColList(trackingList, setTrackingList, "tracking", menuData, setMenuData);
    //     const designStructure: any = createPannelColList(designList, setDesignList, "design", menuData, setMenuData);
}

function createPannelListStructure({ widgetOption, widgetData, setWidgetData, menuData, setMenuData }: { widgetOption: WidgetOption; widgetData: WidgetData; menuData: MenuData; setWidgetData: Function; setMenuData: Function }) {
    let structure: any[] = [];

    for (let [key, value] of Object.entries(widgetData)) {
        structure.push(createPannelColList({ widgetData: widgetData, listData: value, setWidgetData: setWidgetData, type: key, menuData: menuData, setMenuData: setMenuData, widgetOption: widgetOption }));
    }

    return structure;
}

function createPannelColList({ widgetData, listData, setWidgetData, type, menuData, setMenuData, widgetOption }: { widgetData: WidgetData; listData: PannelData[]; setWidgetData: Function; type: string; menuData: MenuData; setMenuData: Function; widgetOption: WidgetOption }) {
    if (listData.length > 0) {
        const row = listData.map((pannel: PannelData, i: number) => {
            const childList = pannel.childList.map((item) => {
                return createPannel({ widgetData: widgetData, data: item, type: type, isChild: true, menuData: menuData, setMenuData: setMenuData, setWidgetData: setWidgetData, listData: listData, widgetOption: widgetOption });
            });

            return (
                <AutoLayout name="row" width={"fill-parent"} direction="vertical" spacing={Math.round(10 * getScale(widgetOption.fontSize))} key={i} overflow="visible">
                    {createPannel({ widgetData: widgetData, data: pannel, type: type, isChild: false, menuData: menuData, setMenuData: setMenuData, setWidgetData: setWidgetData, listData: listData, widgetOption: widgetOption })}
                    {pannel.childList.length > 0 ? (
                        <AutoLayout
                            name="chld-row"
                            width={"fill-parent"}
                            direction="vertical"
                            spacing={Math.round(10 * getScale(widgetOption.fontSize))}
                            padding={{
                                left: Math.round(20 * getScale(widgetOption.fontSize)),
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
            <AutoLayout name="column" width={"fill-parent"} direction="vertical" spacing={Math.round(10 * getScale(widgetOption.fontSize))} overflow="visible">
                {row}
            </AutoLayout>
        );
    } else {
        return null;
    }
}

function createPannel({ widgetData, data, type, isChild, menuData, setMenuData, setWidgetData, listData, widgetOption }: { widgetData: WidgetData; data: PannelData | ChildPannelData; type: string; isChild: boolean; menuData: MenuData; setMenuData: Function; setWidgetData: Function; listData: PannelData[]; widgetOption: WidgetOption }) {
    const widgetId = useWidgetNodeId();
    const linkListStructure = getLinkListStructure(data.linkList);
    const panelOptionData = widgetOption.panelList.find((item) => item.code === type);
    const bgColor: string = panelOptionData!.bgColor;
    const textColor: string = panelOptionData!.textColor;

    if (panelOptionData !== undefined) {
        return (
            <AutoLayout name="item" width={"fill-parent"} direction="vertical" key={data.code} fill={"#fff"} stroke={"#E0E0E0"} strokeAlign={"inside"} strokeWidth={Math.round(1 * getScale(widgetOption.fontSize))} spacing={Math.round(20 * getScale(widgetOption.fontSize))} cornerRadius={Math.round(10 * getScale(widgetOption.fontSize))} padding={Math.round(10 * getScale(widgetOption.fontSize))} overflow="visible">
                <AutoLayout name="top-area" width={"fill-parent"} spacing={"auto"} opacity={data.complete ? 0.3 : 1} overflow="visible">
                    <AutoLayout name="pointer-wrap" spacing={Math.round(5 * getScale(widgetOption.fontSize))} verticalAlignItems="center">
                        <AutoLayout
                            name="pointer"
                            width={"hug-contents"}
                            height={Math.round(24 * getScale(widgetOption.fontSize))}
                            padding={{ horizontal: Math.round(10 * getScale(widgetOption.fontSize)), vertical: 0 }}
                            fill={bgColor}
                            cornerRadius={Math.round(8 * getScale(widgetOption.fontSize))}
                            horizontalAlignItems={"center"}
                            verticalAlignItems={"center"}
                            onClick={(event) => {
                                goToNumber(data.pointerList);
                            }}
                        >
                            <Text name="number" fill={textColor} fontFamily="Inter" fontSize={Math.round(widgetOption.fontSize * 1.15)} fontWeight={700}>
                                {isChild ? `${(data as ChildPannelData).parentIndex + 1}-${data.index + 1}` : String(data.index + 1)}
                            </Text>
                        </AutoLayout>

                        <AutoLayout
                            padding={{
                                horizontal: 4,
                                vertical: 2,
                            }}
                            fill={bgColor}
                            opacity={0}
                            hoverStyle={{
                                opacity: 1,
                            }}
                            onClick={(event) => {
                                goToNumber(data.pointerList);
                            }}
                        >
                            <Text fill={textColor} fontFamily="Inter" fontSize={Math.round(widgetOption.fontSize * 0.8)} fontWeight={700}>
                                Click To Go
                            </Text>
                        </AutoLayout>
                    </AutoLayout>

                    <AutoLayout name="right-aerae" width={"hug-contents"} spacing={Math.round(5 * getScale(widgetOption.fontSize))} verticalAlignItems={"center"} overflow="visible">
                        <AutoLayout name="type" width={"hug-contents"}>
                            <Text name="type" fill={textColor} fontSize={widgetOption.fontSize} fontWeight={700} fontFamily={"Inter"}>
                                {panelOptionData.name}
                            </Text>
                        </AutoLayout>

                        <AutoLayout
                            name="btn-menu"
                            direction="vertical"
                            width={Math.round(24 * getScale(widgetOption.fontSize))}
                            height={Math.round(24 * getScale(widgetOption.fontSize))}
                            horizontalAlignItems={"center"}
                            verticalAlignItems={"center"}
                            spacing={Math.round(2 * getScale(widgetOption.fontSize))}
                            onClick={async (event) => {
                                let openLogic = true;

                                if (menuData.active === true) {
                                    if (menuData.lastCode === data.code) {
                                        openLogic = false;
                                    }
                                }

                                if (openLogic === true) {
                                    const widget = await figma.getNodeByIdAsync(widgetId) as WidgetNode;
                                    const { x: clientX, y: clientY } = getMenuPosition(widget, event, widgetOption);

                                    setMenuData({
                                        active: true,
                                        x: clientX,
                                        y: clientY,
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
                            <Rectangle width={Math.round(4 * getScale(widgetOption.fontSize))} height={Math.round(4 * getScale(widgetOption.fontSize))} fill={"#a4a4a4"} cornerRadius={Math.round(4 * getScale(widgetOption.fontSize))} />
                            <Rectangle width={Math.round(4 * getScale(widgetOption.fontSize))} height={Math.round(4 * getScale(widgetOption.fontSize))} fill={"#a4a4a4"} cornerRadius={Math.round(4 * getScale(widgetOption.fontSize))} />
                            <Rectangle width={Math.round(4 * getScale(widgetOption.fontSize))} height={Math.round(4 * getScale(widgetOption.fontSize))} fill={"#a4a4a4"} cornerRadius={Math.round(4 * getScale(widgetOption.fontSize))} />
                        </AutoLayout>
                    </AutoLayout>
                </AutoLayout>

                <AutoLayout
                    name="text-area"
                    fill={"#fafafa"}
                    width={"fill-parent"}
                    padding={{
                        vertical: Math.round(4 * getScale(widgetOption.fontSize)),
                        horizontal: Math.round(8 * getScale(widgetOption.fontSize)),
                    }}
                    cornerRadius={Math.round(5 * getScale(widgetOption.fontSize))}
                    opacity={data.complete ? 0.3 : 1}
                >
                    {data.complete ? (
                        <Text name="description" width={"fill-parent"} fill={"#616161"} fontSize={Math.round(widgetOption.fontSize * 1.15)} lineHeight={"150%"} fontFamily={"Inter"}>
                            {data.content}
                        </Text>
                    ) : (
                        <Input
                            name="description"
                            width={"fill-parent"}
                            fill={"#616161"}
                            fontSize={Math.round(widgetOption.fontSize * 1.15)}
                            lineHeight={"150%"}
                            fontFamily={"Inter"}
                            value={data.content}
                            placeholder="Write Description"
                            onTextEditEnd={async (e) => {
                                const textData = e.characters.replaceAll("\n", "\u2028");

                                if (isChild === true) {
                                    listData[(data as ChildPannelData).parentIndex].childList[data.index].content = textData;
                                    listData[(data as ChildPannelData).parentIndex].childList[data.index].date = dayjs().format("YYYY-MM-DD");
                                    listData[(data as ChildPannelData).parentIndex].childList[data.index].writer = figma.activeUsers[0].name;
                                } else {
                                    listData[data.index].content = textData;
                                    listData[data.index].date = dayjs().format("YYYY-MM-DD");
                                    listData[data.index].writer = figma.activeUsers[0].name;
                                }

                                data.pointerList.forEach(async (nodeId, i) => {
                                    const widgetNode = await figma.getNodeByIdAsync(nodeId) as WidgetNode | null;

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
                                    } else {
                                        if (isChild === true) {
                                            listData[(data as ChildPannelData).parentIndex].childList[data.index].pointerList.splice(i, 1);
                                        } else {
                                            listData[data.index].pointerList.splice(i, 1);
                                        }
                                    }
                                });

                                widgetData[type] = listData;
                                setWidgetData(widgetData);
                            }}
                        ></Input>
                    )}
                </AutoLayout>

                {linkListStructure}

                <AutoLayout name="info" width={"fill-parent"} direction={"horizontal"} spacing={"auto"} opacity={data.complete ? 0.3 : 1}>
                    <AutoLayout verticalAlignItems="center" spacing={Math.round(5 * getScale(widgetOption.fontSize))}>
                        <SVG
                            src={
                                data.showUrl === true
                                    ? `<svg width="${Math.round(20 * getScale(widgetOption.fontSize))}" height="${Math.round(20 * getScale(widgetOption.fontSize))}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="#835EEE" stroke="#835EEE"/><path d="M5 9.5L9 13.5L15 7.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
                                    : `<svg width="${Math.round(20 * getScale(widgetOption.fontSize))}" height="${Math.round(20 * getScale(widgetOption.fontSize))}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#E0D7FB"/></svg>`
                            }
                            onClick={() => {
                                if (isChild === true) {
                                    listData[(data as ChildPannelData).parentIndex].childList[data.index].showUrl = !data.showUrl;
                                } else {
                                    listData[data.index].showUrl = !data.showUrl;
                                }

                                widgetData[type] = listData;
                                setWidgetData(widgetData);
                            }}
                        />
                        <Text fill="#949494" fontFamily="Inter" fontSize={Math.round(widgetOption.fontSize * 0.9)}>
                            Show Link URL
                        </Text>
                    </AutoLayout>

                    <AutoLayout verticalAlignItems="center" spacing={Math.round(5 * getScale(widgetOption.fontSize))}>
                        <Text fill="#949494" fontFamily="Inter" fontSize={Math.round(widgetOption.fontSize * 0.9)}>
                            {data.date}
                        </Text>
                        <Text fill="#949494" fontFamily="Inter" fontSize={Math.round(widgetOption.fontSize * 0.9)}>
                            {data.writer}
                        </Text>
                    </AutoLayout>
                </AutoLayout>
            </AutoLayout>
        );
    } else {
        return null;
    }

    function getLinkListStructure(list: LinkItem[]) {
        if (list.length > 0) {
            const listStructure = list.map((item, i) => {
                return (
                    <AutoLayout
                        width={"hug-contents"}
                        height={"hug-contents"}
                        padding={{
                            horizontal: Math.round(10 * getScale(widgetOption.fontSize)),
                            vertical: Math.round(2 * getScale(widgetOption.fontSize)),
                        }}
                        fill="#E3F4FF"
                        cornerRadius={Math.round(4 * getScale(widgetOption.fontSize))}
                        onClick={() => {
                            return new Promise((resolve) => {
                                figma.showUI(`<script>window.onmessage = (event) => {
                                    window.open(event.data.pluginMessage);
                                    parent.postMessage({ pluginMessage: { type: "close" } }, "*");
                                }</script>`);
                                figma.ui.postMessage(item.value);
                            });
                        }}
                        key={i}
                    >
                        <SVG
                            src={`<svg width="${Math.round(18 * getScale(widgetOption.fontSize))}" height="${Math.round(
                                18 * getScale(widgetOption.fontSize)
                            )}" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.8146 10.53L5.81684 10.5261L5.96902 10.2625C6.12435 9.99347 6.03217 9.64945 5.76313 9.49412C5.49409 9.33879 5.15007 9.43097 4.99474 9.70001L4.8403 9.9675L4.83785 9.97179C3.91687 11.5723 4.46399 13.6096 6.06371 14.5332C7.66486 15.4577 9.70503 14.911 10.6295 13.3099L10.6338 13.3022L10.6347 13.3006L11.3941 11.9853C11.3967 11.9811 11.3992 11.9768 11.4017 11.9724C12.2397 10.521 11.7428 8.66652 10.2914 7.82858C10.0224 7.67325 9.67836 7.76543 9.52303 8.03447C9.3677 8.30351 9.45988 8.64753 9.72892 8.80286C10.6384 9.32795 10.9521 10.4869 10.434 11.3985C10.4328 11.4004 10.4317 11.4023 10.4305 11.4043C10.4294 11.4061 10.4283 11.408 10.4272 11.4099L9.65506 12.7474L9.65039 12.7556C9.03441 13.8123 7.68652 14.1711 6.62621 13.559C5.56314 12.9452 5.20084 11.5931 5.8146 10.53ZM6.8481 6.49011C6.84636 6.49313 6.84465 6.49617 6.84296 6.49921C6.01232 7.94921 6.51019 9.79775 7.95852 10.6339C8.22755 10.7893 8.57157 10.6971 8.7269 10.4281C8.88223 10.159 8.79005 9.815 8.52102 9.65967C7.60774 9.13239 7.29518 7.9659 7.82246 7.05263L7.82711 7.04443L8.59238 5.71895L8.59458 5.71515C9.20835 4.65208 10.5605 4.28978 11.6235 4.90354C12.6835 5.51549 13.0468 6.86144 12.4406 7.92306C12.4394 7.92496 12.4383 7.92687 12.4372 7.92879C12.4364 7.93003 12.4357 7.93127 12.435 7.93251L12.2806 8.2C12.1252 8.46904 12.2174 8.81306 12.4865 8.96839C12.7555 9.12372 13.0995 9.03154 13.2548 8.7625L13.4032 8.50556L13.4047 8.50298L13.4094 8.49501C14.3339 6.89386 13.7872 4.85369 12.186 3.92927C10.5863 3.00564 8.54826 3.55056 7.62271 5.1485L7.62029 5.15265L6.8481 6.49011Z" fill="#5176F8"/></svg>`}
                        ></SVG>
                        <Text fill="#5176F8" fontFamily="Inter" fontWeight={700} textDecoration="underline" fontSize={widgetOption.fontSize}>
                            {item.name}
                        </Text>
                        {data.showUrl === true ? (
                            <Text fill="#5176F8" fontFamily="Inter" textDecoration="underline" fontSize={widgetOption.fontSize}>
                                - {item.value}
                            </Text>
                        ) : null}
                    </AutoLayout>
                );
            });

            return (
                <AutoLayout name="link-list" wrap={!data.showUrl} direction={data.showUrl ? "vertical" : "horizontal"} width="fill-parent" spacing={Math.round(4 * getScale(widgetOption.fontSize))} opacity={data.complete ? 0.3 : 1}>
                    {listStructure}
                </AutoLayout>
            );
        } else {
            return null;
        }
    }
}

export function getMenuStructure({ menuData, setMenuData, widgetData, widgetOption }: { menuData: MenuData; setMenuData: Function; widgetData: WidgetData; widgetOption: WidgetOption }) {
    if (menuData.active === true) {
        let menuList: any = [];
        let targetData: PannelData | ChildPannelData;

        if (widgetData[menuData.targetType] !== undefined) {
            if (menuData.isChild === true) {
                targetData = widgetData[menuData.targetType][menuData.targetParentIdx as number].childList[menuData.targetIdx];
            } else {
                targetData = widgetData[menuData.targetType][menuData.targetIdx];
            }
        }

        // 링크 편집
        menuList.push(
            <AutoLayout
                name="btn"
                width={"fill-parent"}
                verticalAlignItems="center"
                height={Math.round(30 * getScale(widgetOption.fontSize))}
                fill={"#fff"}
                cornerRadius={Math.round(5 * getScale(widgetOption.fontSize))}
                hoverStyle={{
                    fill: "#6436EA",
                }}
                onClick={() => {
                    return new Promise((resolve) => {
                        openLinkEditModal(menuData.targetType, menuData.isChild, targetData, widgetOption);
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
                    fontSize={widgetOption.fontSize}
                    fontWeight={700}
                    lineHeight={"auto"}
                    horizontalAlignText="center"
                    fontFamily={"Noto Sans"}
                    hoverStyle={{
                        fill: "#fff",
                    }}
                >
                    Link Edit
                </Text>
            </AutoLayout>
        );

        // 포인터 생성 버튼
        menuList.push(
            <AutoLayout
                name="btn"
                width={"fill-parent"}
                verticalAlignItems="center"
                height={Math.round(30 * getScale(widgetOption.fontSize))}
                fill={"#fff"}
                cornerRadius={Math.round(5 * getScale(widgetOption.fontSize))}
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
                    fontSize={widgetOption.fontSize}
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
                    height={Math.round(30 * getScale(widgetOption.fontSize))}
                    fill={"#fff"}
                    cornerRadius={Math.round(5 * getScale(widgetOption.fontSize))}
                    hoverStyle={{
                        fill: "#6436EA",
                    }}
                    onClick={() => {
                        if (figma.payments?.status.type === "UNPAID") {
                            figma.payments.initiateCheckoutAsync();
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
                        } else {
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
                        }
                    }}
                    key={2}
                >
                    <Text
                        width={"fill-parent"}
                        fill={"#616161"}
                        fontSize={widgetOption.fontSize}
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
                height={Math.round(30 * getScale(widgetOption.fontSize))}
                fill={"#fff"}
                cornerRadius={Math.round(5 * getScale(widgetOption.fontSize))}
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
                    fontSize={widgetOption.fontSize}
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
                height={Math.round(30 * getScale(widgetOption.fontSize))}
                fill={"#fff"}
                cornerRadius={Math.round(5 * getScale(widgetOption.fontSize))}
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
                    fontSize={widgetOption.fontSize}
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
                height={Math.round(30 * getScale(widgetOption.fontSize))}
                fill={"#fff"}
                cornerRadius={Math.round(5 * getScale(widgetOption.fontSize))}
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
                    fontSize={widgetOption.fontSize}
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
                height={Math.round(30 * getScale(widgetOption.fontSize))}
                fill={"#fff"}
                cornerRadius={Math.round(5 * getScale(widgetOption.fontSize))}
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
                    fontSize={widgetOption.fontSize}
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
                width={Math.round(157 * getScale(widgetOption.fontSize))}
                x={menuData.x}
                y={menuData.y}
                padding={Math.round(10 * getScale(widgetOption.fontSize))}
                direction="vertical"
                spacing={Math.round(5 * getScale(widgetOption.fontSize))}
                fill={"#fff"}
                cornerRadius={Math.round(5 * getScale(widgetOption.fontSize))}
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

    if (arrowType === "top" || arrowType === "bottom") {
        isVertical = true;
    }

    if (arrowType === "top") {
        structure.push(
            <SVG
                src={`<svg viewBox="0 0 14 7" fill="none">
                <path d="M7 0 14 7 0 7Z7 0" fill="${pointerData.bgColor}" />
            </svg>`}
                key="arrow"
            ></SVG>
        );
    }

    if (arrowType === "left") {
        structure.push(
            <SVG
                src={`<svg viewBox="0 0 7 14" fill="none">
            <path d="M7 0 7 14 0 7Z7 0" fill="${pointerData.bgColor}" />
        </svg>`}
                key="arrow"
            ></SVG>
        );
    }

    // 포인터
    structure.push(
        <AutoLayout
            name="pointer"
            height={28}
            fill={pointerData.bgColor}
            padding={{
                horizontal: 10,
                vertical: 0,
            }}
            cornerRadius={8}
            horizontalAlignItems={"center"}
            verticalAlignItems={"center"}
            onClick={(e) => {
                return new Promise((resolve) => {
                    openViewModal(pointerData.viewText, pointerData.type, pointerData.content, pointerData.linkList, pointerData.bgColor, pointerData.textColor);
                });
            }}
            key="pointer"
        >
            <Text name="number" fill={pointerData.textColor} fontSize={16} fontWeight={700}>
                {pointerData.viewText}
            </Text>
        </AutoLayout>
    );

    if (arrowType === "right") {
        structure.push(
            <SVG
                src={`<svg viewBox="0 0 7 14" fill="none">
            <path d="M0 0 7 7 0 14Z0 0" fill="${pointerData.bgColor}" />
        </svg>`}
                key="arrow"
            ></SVG>
        );
    }

    if (arrowType === "bottom") {
        structure.push(
            <SVG
                src={`<svg viewBox="0 0 14 7" fill="none">
            <path d="M0 0 7 7 14 0Z0 0" fill="${pointerData.bgColor}" />
        </svg>`}
                key="arrow"
            ></SVG>
        );
    }

    return (
        <AutoLayout name="wrap" width="hug-contents" direction={isVertical ? "vertical" : "horizontal"} horizontalAlignItems={"center"} verticalAlignItems={"center"}>
            {structure}
        </AutoLayout>
    );
}
