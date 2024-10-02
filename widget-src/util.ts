import "./type.d.ts";
// @ts-ignore
import dayjs from "dayjs";

export function setPanelCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < 16; i += 1) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

function getTargetValueAndFunction({ type, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList }: GetPannelStructure) {
    let targetFunction: any;
    let targetValue: any;

    switch (type) {
        case "visible":
            targetFunction = setVisibleList;
            targetValue = visibleList;
            break;
        case "invisible":
            targetFunction = setInvisibleList;
            targetValue = invisibleList;
            break;
        case "tracking":
            targetFunction = setTrackingList;
            targetValue = trackingList;
            break;
        case "design":
            targetFunction = setDesignList;
            targetValue = designList;
            break;
    }

    return {
        targetFunction: targetFunction as Function,
        targetValue: targetValue as PannelData[],
    };
}

export function getScale(fontSize: number) {
    return ((100 / 14) * fontSize) / 100;
}

export function getLayoutSize(widgetData: WidgetData, widgetOption: WidgetOption) {
    const percent: number = getScale(widgetOption.fontSize);
    let isEmpty: boolean = true;
    let width: number = 100;

    for (let [key, value] of Object.entries(widgetData)) {
        if (value.length > 0) {
            isEmpty = false;
            width += 500 * percent;
            width += 20 * percent;
        }
    }

    if (isEmpty === true) {
        width += 500 * percent;
        width += 20 * percent;
    }

    width -= 20 * percent;

    return Math.floor(width);
}

export function isEmptyList(data: WidgetData) {
    let isEmpty: boolean = true;

    for (let [key, value] of Object.entries(data)) {
        if (value !== undefined && value.length > 0) {
            isEmpty = false;
        }
    }

    return isEmpty;
}

// 링크 수정 모달
export function openLinkEditModal(type: string, isChild: boolean, data: PannelData | ChildPannelData, widgetOption: WidgetOption) {
    figma.showUI(__uiFiles__.link, { width: 450, height: 600 });
    figma.ui.postMessage({
        type: type,
        isChild: isChild,
        data: data,
        widgetOption: widgetOption,
    });
}

// 뷰어 모달 오픈
export function openViewModal(viewNumber: string, pannelType: string, content: string, linkList: LinkItem[], bgColor: string, textColor: string) {
    let width = 900;

    if (linkList.length === 0) {
        width = 450;
    }

    figma.showUI(__uiFiles__.view, { width: width, height: 600 });
    figma.ui.postMessage({
        viewNumber: viewNumber,
        pannelType: pannelType,
        content: content,
        linkList: linkList,
        bgColor: bgColor,
        textColor: textColor,
    });
}

// 자식 패널 정보 추가 함수
export function addChildPannelData({ widgetData, setWidgetData, widgetOption, data }: { widgetData: WidgetData; setWidgetData: Function; widgetOption: WidgetOption; data: AddChildPannelArgument }) {
    const tempData: WidgetData = JSON.parse(JSON.stringify(widgetData));

    tempData[data.pannelType][data.pannelData.index].childList.push({
        code: setPanelCode(),
        index: tempData[data.pannelType][data.pannelData.index].childList.length,
        complete: false,
        content: "",
        linkList: [],
        pointerList: [],
        parentIndex: data.pannelData.index,
        parentCode: data.pannelData.code,
        date: dayjs().format("YYYY-MM-DD"),
        showUrl: false,
        writer: figma.activeUsers[0].name,
    });

    setWidgetData(tempData);
}

// 포인터 생성 함수
export function createPinter({ widgetData, setWidgetData, widgetOption, data, widgetId }: { widgetData: WidgetData; setWidgetData: Function; widgetOption: WidgetOption; data: CreatePinterArgument; widgetId: string }) {
    const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
    const parentNode = widgetNode?.parent as BaseNode;
    const panelOption = widgetOption.panelList.find((item) => item.code === data.pannelType);
    let viewText: string = "";

    if (data.isChild === true) {
        viewText = `${(data.pannelData as ChildPannelData).parentIndex + 1}-${data.pannelData.index + 1}`;
    } else {
        viewText = String(data.pannelData.index + 1);
    }

    const cloneWidgetNode = widgetNode.cloneWidget({
        widgetMode: "pointer",
        pointerData: {
            viewText: viewText,
            type: panelOption?.name,
            code: data.pannelType,
            bgColor: panelOption?.bgColor,
            textColor: panelOption?.textColor,
            content: data.pannelData.content,
            linkList: data.pannelData.linkList,
            index: data.pannelData.index,
            parentIndex: data.isChild ? (data.pannelData as ChildPannelData).parentIndex : null,
            parentWidgetId: widgetId,
        },
    });

    cloneWidgetNode.x -= 60;

    if (data.isChild === true) {
        widgetData[data.pannelType][(data.pannelData as ChildPannelData).parentIndex].childList[data.pannelData.index].pointerList.push(cloneWidgetNode.id);
    } else {
        widgetData[data.pannelType][data.pannelData.index].pointerList.push(cloneWidgetNode.id);
    }

    setWidgetData(widgetData);

    if (parentNode.type === "SECTION" || parentNode.type === "GROUP" || parentNode.type === "FRAME") {
        parentNode.appendChild(cloneWidgetNode);
    }
}

// 포인터 이동 함수
export function goToNumber(list: string[]) {
    const nodeList: WidgetNode[] = [];

    list.forEach((id) => {
        const node = figma.getNodeById(id) as WidgetNode | null;

        if (node !== null) {
            nodeList.push(node);
        }
    });

    figma.viewport.scrollAndZoomIntoView(nodeList);
}

// 패널 완료 토글
export function setPannelComplete({ widgetData, setWidgetData, data }: { widgetData: WidgetData; setWidgetData: Function; data: CompletePinterArgument }) {
    const tempData: WidgetData = JSON.parse(JSON.stringify(widgetData));

    if (data.isChild === true) {
        tempData[data.pannelType][(data.pannelData as ChildPannelData).parentIndex].childList[data.pannelData.index].complete = !data.pannelData.complete;
    } else {
        tempData[data.pannelType][data.pannelData.index].complete = !data.pannelData.complete;
    }

    setWidgetData(tempData);
}

// 전채 패널 상태 변경
export function setAllPannelCompleteStatus({ status, widgetData, setWidgetData }: { status: boolean; widgetData: WidgetData; setWidgetData: Function }) {
    for (let [key, value] of Object.entries(widgetData)) {
        value.forEach((item, i) => {
            widgetData[key][i].complete = status;

            item.childList.forEach((child, j) => {
                widgetData[key][i].childList[j].complete = status;
            });
        });
    }

    setWidgetData(widgetData);
}

// 패널 순서 이동
export function movePannelItem({ widgetData, setWidgetData, data, move }: { widgetData: WidgetData; setWidgetData: Function; data: MovePannelArgument; move: "up" | "down" }) {
    let suitable = true;

    if (data.pannelData.index === 0 && move === "up") {
        figma.notify("Panel is already the first item.");
        suitable = false;
    }

    if (move === "down") {
        if (data.isChild === true) {
            if (data.pannelData.index === widgetData[data.pannelType][(data.pannelData as ChildPannelData).parentIndex].childList.length - 1) {
                figma.notify("Panel is already the last item.");
                suitable = false;
            }
        } else {
            if (data.pannelData.index === widgetData[data.pannelType].length - 1) {
                figma.notify("Panel is already the last item.");
                suitable = false;
            }
        }
    }

    if (suitable === true) {
        if (data.isChild === true) {
            const childData = data.pannelData as ChildPannelData;

            if (move === "up") {
                let preData = widgetData[data.pannelType][childData.parentIndex].childList[childData.index - 1];
                let curruntData = widgetData[data.pannelType][childData.parentIndex].childList[childData.index];

                widgetData[data.pannelType][childData.parentIndex].childList[childData.index - 1] = curruntData;
                widgetData[data.pannelType][childData.parentIndex].childList[childData.index] = preData;
                widgetData[data.pannelType][childData.parentIndex].childList = arrangementChildPannel(widgetData[data.pannelType][childData.parentIndex]);
            } else {
                let nextData = widgetData[data.pannelType][childData.parentIndex].childList[childData.index + 1];
                let curruntData = widgetData[data.pannelType][childData.parentIndex].childList[childData.index];

                widgetData[data.pannelType][childData.parentIndex].childList[childData.index + 1] = curruntData;
                widgetData[data.pannelType][childData.parentIndex].childList[childData.index] = nextData;
                widgetData[data.pannelType][childData.parentIndex].childList = arrangementChildPannel(widgetData[data.pannelType][childData.parentIndex]);
            }
        } else {
            if (move === "up") {
                let preData = widgetData[data.pannelType][data.pannelData.index - 1];
                let curruntData = widgetData[data.pannelType][data.pannelData.index];

                widgetData[data.pannelType][data.pannelData.index - 1] = curruntData;
                widgetData[data.pannelType][data.pannelData.index] = preData;
                widgetData[data.pannelType] = arrangementPannel(widgetData[data.pannelType]);
            } else {
                let nextData = widgetData[data.pannelType][data.pannelData.index + 1];
                let curruntData = widgetData[data.pannelType][data.pannelData.index];

                widgetData[data.pannelType][data.pannelData.index + 1] = curruntData;
                widgetData[data.pannelType][data.pannelData.index] = nextData;
                widgetData[data.pannelType] = arrangementPannel(widgetData[data.pannelType]);
            }
        }

        setWidgetData(widgetData);
    }
}

// 패널 데이터 정리
function arrangementPannel(list: PannelData[]) {
    list.forEach((pannel, index) => {
        pannel.index = index;
        pannel.childList = arrangementChildPannel(pannel);
        pannel.pointerList.forEach((nodeId) => {
            const widgetNode = figma.getNodeById(nodeId) as WidgetNode | null;

            if (widgetNode !== null) {
                let defaultData = widgetNode.widgetSyncedState["pointerData"] as PointerData;

                defaultData.viewText = String(pannel.index + 1);

                widgetNode.setWidgetSyncedState({
                    widgetMode: "pointer",
                    pointerData: defaultData,
                    arrowType: widgetNode.widgetSyncedState["arrowType"],
                });
            }
        });
    });

    return list;
}

// 자식 패널 정리
function arrangementChildPannel(list: PannelData) {
    list.childList.forEach((child, index) => {
        child.index = index;
        child.parentIndex = list.index;

        child.pointerList.forEach((nodeId) => {
            const widgetNode = figma.getNodeById(nodeId) as WidgetNode | null;

            if (widgetNode !== null) {
                let defaultData = widgetNode.widgetSyncedState["pointerData"] as PointerData;

                defaultData.viewText = `${child.parentIndex + 1}-${child.index + 1}`;

                widgetNode.setWidgetSyncedState({
                    widgetMode: "pointer",
                    pointerData: defaultData,
                    arrowType: widgetNode.widgetSyncedState["arrowType"],
                });
            }
        });
    });

    return list.childList;
}

// 패널 삭제
export function deletePannelItem({ visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList, data }: CompletePinterArgument) {
    let { targetFunction, targetValue } = getTargetValueAndFunction({ type: data.pannelType, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList });

    if (data.isChild === true) {
        const pannelData = data.pannelData as ChildPannelData;

        targetValue[pannelData.parentIndex].childList.splice(pannelData.index, 1);
    } else {
        const pannelData = data.pannelData as PannelData;

        targetValue.splice(pannelData.index, 1);

        pannelData.childList.forEach((child: ChildPannelData) => {
            child.pointerList.forEach((nodeId: string) => {
                const widgetNode = figma.getNodeById(nodeId) as WidgetNode | null;

                if (widgetNode !== null) {
                    widgetNode.remove();
                }
            });
        });
    }

    data.pannelData.pointerList.forEach((nodeId: string) => {
        const widgetNode = figma.getNodeById(nodeId) as WidgetNode | null;

        if (widgetNode !== null) {
            widgetNode.remove();
        }
    });

    targetValue.forEach((row, i) => {
        row.index = i;
        row.pointerList.forEach((nodeId: string) => {
            const widgetNode = figma.getNodeById(nodeId) as WidgetNode | null;

            if (widgetNode !== null) {
                widgetNode.setWidgetSyncedState({
                    widgetMode: "pointer",
                    pointerData: {
                        ...widgetNode.widgetSyncedState["pointerData"],
                        index: i,
                        viewText: i + 1,
                    },
                    arrowType: widgetNode.widgetSyncedState["arrowType"],
                });
            }
        });

        row.childList.forEach((child, j) => {
            child.index = j;
            child.parentIndex = i;

            child.pointerList.forEach((nodeId: string) => {
                const widgetNode = figma.getNodeById(nodeId) as WidgetNode | null;

                if (widgetNode !== null) {
                    widgetNode.setWidgetSyncedState({
                        widgetMode: "pointer",
                        pointerData: {
                            ...widgetNode.widgetSyncedState["pointerData"],
                            index: j,
                            parentIndex: i,
                            viewText: `${i + 1}-${j + 1}`,
                        },
                        arrowType: widgetNode.widgetSyncedState["arrowType"],
                    });
                }
            });
        });
    });

    targetFunction(targetValue);
}

// 데이터 내보내기
export function dataExport({ widgetTitle, visibleList, invisibleList, trackingList, designList }: { widgetTitle: string; visibleList: PannelData[]; invisibleList: PannelData[]; trackingList: PannelData[]; designList: PannelData[] }) {
    if (isEmptyList({ visibleList, invisibleList, trackingList, designList }) === false) {
        let data: { [key: string]: PannelData[] } = {};

        if (visibleList.length > 0) {
            visibleList = clearPointerList(visibleList);
            data["visibleList"] = visibleList;
        }

        if (invisibleList.length > 0) {
            invisibleList = clearPointerList(invisibleList);
            data["invisibleList"] = invisibleList;
        }

        if (trackingList.length > 0) {
            trackingList = clearPointerList(trackingList);
            data["trackingList"] = trackingList;
        }

        if (designList.length > 0) {
            designList = clearPointerList(designList);
            data["designList"] = designList;
        }

        figma.showUI(__uiFiles__.export, { width: 400, height: 300 });
        figma.ui.postMessage(JSON.stringify(data));
    } else {
        figma.notify("You didn't have any Pannel data.");
    }
}

function clearPointerList(list: PannelData[]) {
    list.forEach((item) => {
        item.pointerList = [];

        item.childList.forEach((child) => {
            child.pointerList = [];
        });
    });

    return list;
}

// 데이터 불러오기
export function setImportData({ data, setVisibleList, setInvisibleList, setTrackingList, setDesignList }: { data: any; setVisibleList: Function; setInvisibleList: Function; setTrackingList: Function; setDesignList: Function }) {
    if (data.visibleList !== undefined) {
        setVisibleList(data.visibleList);
    }

    if (data.invisibleList !== undefined) {
        setInvisibleList(data.invisibleList);
    }

    if (data.trackingList !== undefined) {
        setTrackingList(data.trackingList);
    }

    if (data.designList !== undefined) {
        setDesignList(data.designList);
    }
}

// 새 데이터 넣기
export function addNewData({ type, widgetData, widgetOption, setWidgetData }: { type: string; widgetData: WidgetData; widgetOption: WidgetOption; setWidgetData: Function }) {
    // TODO : 지원하면 변경하기
    // const data = structuredClone(widgetData);
    const data: WidgetData = JSON.parse(JSON.stringify(widgetData));
    let sutable: boolean = false;

    if (data[type] === undefined) {
        data[type] = [];
    }

    if (data[type].length > 5) {
        if (figma.payments?.status.type === "PAID") {
            sutable = true;
        } else {
            sutable = false;
        }
    } else {
        sutable = true;
    }

    if (widgetOption.isChanged === false) {
        sutable = true;
    } else {
        if (figma.payments?.status.type === "PAID") {
            sutable = true;
        } else {
            sutable = false;
        }
    }

    if (sutable === true) {
        data[type].push({
            index: data[type].length,
            code: setPanelCode(),
            complete: false,
            linkList: [],
            content: "",
            pointerList: [],
            childList: [],
            date: dayjs().format("YYYY-MM-DD"),
            showUrl: false,
            writer: figma.activeUsers[0].name,
        });

        setWidgetData(data);
    } else {
        figma.payments?.initiateCheckoutAsync();
    }
}

// 링크정보 할당
export function setLinkData({ widgetData, setWidgetData, widgetOption, data }: { widgetData: WidgetData; setWidgetData: Function; widgetOption: WidgetOption; data: EditLinkArgument }) {
    if (data.pannelData.isChild === true) {
        // 자식의 경우
        widgetData[data.pannelData.type][(data.pannelData.data as ChildPannelData).parentIndex].childList[data.pannelData.data.index].linkList = data.linkList;

        widgetData[data.pannelData.type][(data.pannelData.data as ChildPannelData).parentIndex].childList[data.pannelData.data.index].pointerList.forEach((nodeId, i) => {
            const widgetNode = figma.getNodeById(nodeId) as WidgetNode | null;

            if (widgetNode !== null) {
                let defaultData = {
                    ...(widgetNode.widgetSyncedState["pointerData"] as PointerData),
                    linkList: data.linkList,
                };

                widgetNode.setWidgetSyncedState({
                    widgetMode: "pointer",
                    pointerData: defaultData,
                    arrowType: widgetNode.widgetSyncedState["arrowType"],
                });
            } else {
                widgetData[data.pannelData.type][data.pannelData.data.index].pointerList.splice(i, 1);
            }
        });
    } else {
        // 자식이 아닌 경우
        widgetData[data.pannelData.type][data.pannelData.data.index].linkList = data.linkList;

        widgetData[data.pannelData.type][data.pannelData.data.index].pointerList.forEach((nodeId, i) => {
            const widgetNode = figma.getNodeById(nodeId) as WidgetNode | null;

            if (widgetNode !== null) {
                let defaultData = {
                    ...(widgetNode.widgetSyncedState["pointerData"] as PointerData),
                    linkList: data.linkList,
                };

                widgetNode.setWidgetSyncedState({
                    widgetMode: "pointer",
                    pointerData: defaultData,
                    arrowType: widgetNode.widgetSyncedState["arrowType"],
                });
            } else {
                widgetData[data.pannelData.type][data.pannelData.data.index].pointerList.splice(i, 1);
            }
        });
    }

    setWidgetData(widgetData);
}

// 뎁스에 의한 메뉴 위치 연산
export function getMenuPosition(widget: WidgetNode, event: WidgetClickEvent, widgetOption: WidgetOption) {
    const parentNode = widget.parent;
    let x = 0;
    let y = 0;

    if (parentNode !== null && parentNode.type !== "PAGE") {
        const { nodeX, nodeY } = getParentPosition(parentNode);

        x = Math.floor(event.canvasX) - nodeX - Math.floor(widget.x) - (Math.round(157 * getScale(widgetOption.fontSize)) + Math.round(10 * getScale(widgetOption.fontSize)));
        y = Math.floor(event.canvasY) - nodeY - Math.floor(widget.y) + Math.round(10 * getScale(widgetOption.fontSize));
    } else {
        x = Math.floor(event.canvasX) - Math.floor(widget.x) - (Math.round(157 * getScale(widgetOption.fontSize)) + Math.round(10 * getScale(widgetOption.fontSize)));
        y = Math.floor(event.canvasY) - Math.floor(widget.y) + Math.round(10 * getScale(widgetOption.fontSize));
    }

    return {
        x: x,
        y: y,
    };
}

function getParentPosition(node: BaseNode, x: number = 0, y: number = 0) {
    if (node.parent !== null && node.type !== "PAGE") {
        if (node.type === "SECTION" || node.type === "FRAME") {
            return getParentPosition(node.parent, Math.floor(node.x + x), Math.floor(node.y + y));
        } else {
            return getParentPosition(node.parent, x, y);
        }
    } else {
        if (node.type === "SECTION" || node.type === "FRAME") {
            return {
                nodeX: Math.floor(node.x) + x,
                nodeY: Math.floor(node.y) + y,
            };
        } else {
            return {
                nodeX: 0 + x,
                nodeY: 0 + y,
            };
        }
    }
}

export function dateFormat(value: Date) {
    const year = value.getFullYear();
    let month = String(value.getMonth() + 1);
    let day = String(value.getDate());

    if (month.length === 1) {
        month = "0" + month;
    }

    if (day.length === 1) {
        day = "0" + day;
    }

    return `${year}-${month}-${day}`;
}
