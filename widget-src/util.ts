import type { PannelData, ChildPannelData, CreatePinterArgument, LinkItem, PointerData, AddChildPannelArgument, GetPannelStructure, CompletePinterArgument, CompletePannelArgument, MovePannelArgument, EditLinkArgument } from "./type";

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

export function getLayoutSize({ visibleList, invisibleList, trackingList, designList }: { visibleList: PannelData[]; invisibleList: PannelData[]; trackingList: PannelData[]; designList: PannelData[] }) {
    let isEmpty: boolean = true;
    let width: number = 100;

    if (visibleList.length > 0) {
        isEmpty = false;
        width += 520;
    }

    if (invisibleList.length > 0) {
        isEmpty = false;
        width += 520;
    }

    if (trackingList.length > 0) {
        isEmpty = false;
        width += 520;
    }

    if (designList.length > 0) {
        isEmpty = false;
        width += 520;
    }

    if (isEmpty === true) {
        width += 520;
    }

    width -= 20;

    return width;
}

export function isEmptyList({ visibleList, invisibleList, trackingList, designList }: { visibleList: PannelData[]; invisibleList: PannelData[]; trackingList: PannelData[]; designList: PannelData[] }) {
    let isEmpty: boolean = true;

    if (visibleList.length > 0) {
        isEmpty = false;
    }

    if (invisibleList.length > 0) {
        isEmpty = false;
    }

    if (trackingList.length > 0) {
        isEmpty = false;
    }

    if (designList.length > 0) {
        isEmpty = false;
    }

    return isEmpty;
}

// 링크 수정 모달
export function openLinkEditModal(type: string, isChild: boolean, data: PannelData | ChildPannelData) {
    figma.showUI(__uiFiles__.link, { width: 450, height: 600 });
    figma.ui.postMessage({
        type: type,
        isChild: isChild,
        data: data,
    });
}

// 뷰어 모달 오픈
export function openViewModal(viewNumber: string, pannelType: string, content: string, linkList: LinkItem[]) {
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
    });
}

// 자식 패널 정보 추가 함수
export function addChildPannelData({ visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList, data }: AddChildPannelArgument) {
    let { targetFunction, targetValue } = getTargetValueAndFunction({ type: data.pannelType, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList });

    targetValue[data.pannelData.index].childList.push({
        code: setPanelCode(),
        index: targetValue[data.pannelData.index].childList.length,
        complete: false,
        content: "",
        linkList: [],
        pointerList: [],
        parentIndex: data.pannelData.index,
        parentCode: data.pannelData.code,
    });
    targetFunction(targetValue);
}

// 포인터 생성 함수
export function createPinter({ visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList, data, widgetId }: CreatePinterArgument) {
    const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
    const parentNode = widgetNode?.parent as BaseNode;
    let { targetFunction, targetValue } = getTargetValueAndFunction({ type: data.pannelType, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList });
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
            type: data.pannelType,
            content: data.pannelData.content,
            linkList: data.pannelData.linkList,
            index: data.pannelData.index,
            parentIndex: data.isChild ? (data.pannelData as ChildPannelData).parentIndex : null,
            parentWidgetId: widgetId,
        },
    });

    cloneWidgetNode.x -= 60;
    data.pannelData.pointerList.push(cloneWidgetNode.id);

    if (data.isChild === true) {
        const childData = data.pannelData as ChildPannelData;

        targetValue[childData.parentIndex].childList[childData.index] = childData;
    } else {
        targetValue[data.pannelData.index] = data.pannelData as PannelData;
    }

    targetFunction(targetValue);

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
export function setPannelComplete({ visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList, data }: CompletePinterArgument) {
    let { targetFunction, targetValue } = getTargetValueAndFunction({ type: data.pannelType, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList });

    if (data.isChild === true) {
        const pannelData = data.pannelData as ChildPannelData;

        targetValue[pannelData.parentIndex].childList[pannelData.index].complete = !pannelData.complete;
    } else {
        const pannelData = data.pannelData as PannelData;

        targetValue[pannelData.index].complete = !pannelData.complete;
    }

    targetFunction(targetValue);
}

// 전채 패널 상태 변경
export function setAllPannelCompleteStatus({ status, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList }: CompletePannelArgument) {
    visibleList.forEach((item) => {
        item.complete = status;

        item.childList.forEach((child) => {
            child.complete = status;
        });
    });

    invisibleList.forEach((item) => {
        item.complete = status;

        item.childList.forEach((child) => {
            child.complete = status;
        });
    });

    trackingList.forEach((item) => {
        item.complete = status;

        item.childList.forEach((child) => {
            child.complete = status;
        });
    });

    designList.forEach((item) => {
        item.complete = status;

        item.childList.forEach((child) => {
            child.complete = status;
        });
    });

    setVisibleList(visibleList);
    setInvisibleList(invisibleList);
    setTrackingList(trackingList);
    setDesignList(designList);
}

// 패널 순서 이동
export function movePannelItem({ visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList, data, move }: MovePannelArgument) {
    let { targetFunction, targetValue } = getTargetValueAndFunction({ type: data.pannelType, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList });
    let suitable = true;

    if (data.pannelData.index === 0 && move === "up") {
        figma.notify("Panel is already the first item.");
        suitable = false;
    }

    if (move === "down") {
        if (data.isChild === true) {
            if (data.pannelData.index === targetValue[(data.pannelData as ChildPannelData).parentIndex].childList.length - 1) {
                figma.notify("Panel is already the last item.");
                suitable = false;
            }
        } else {
            if (data.pannelData.index === targetValue.length - 1) {
                figma.notify("Panel is already the last item.");
                suitable = false;
            }
        }
    }

    if (suitable === true) {
        if (data.isChild === true) {
            const childData = data.pannelData as ChildPannelData;

            if (move === "up") {
                let preData = targetValue[childData.parentIndex].childList[childData.index - 1];
                let curruntData = targetValue[childData.parentIndex].childList[childData.index];

                targetValue[childData.parentIndex].childList[childData.index - 1] = curruntData;
                targetValue[childData.parentIndex].childList[childData.index] = preData;

                targetValue[childData.parentIndex].childList = arrangementChildPannel(targetValue[childData.parentIndex]);
            } else {
                let nextData = targetValue[childData.parentIndex].childList[childData.index + 1];
                let curruntData = targetValue[childData.parentIndex].childList[childData.index];

                targetValue[childData.parentIndex].childList[childData.index + 1] = curruntData;
                targetValue[childData.parentIndex].childList[childData.index] = nextData;

                targetValue[childData.parentIndex].childList = arrangementChildPannel(targetValue[childData.parentIndex]);
            }
        } else {
            if (move === "up") {
                let preData = targetValue[data.pannelData.index - 1];
                let curruntData = targetValue[data.pannelData.index];

                targetValue[data.pannelData.index - 1] = curruntData;
                targetValue[data.pannelData.index] = preData;

                targetValue = arrangementPannel(targetValue);
            } else {
                let nextData = targetValue[data.pannelData.index + 1];
                let curruntData = targetValue[data.pannelData.index];

                targetValue[data.pannelData.index + 1] = curruntData;
                targetValue[data.pannelData.index] = nextData;

                targetValue = arrangementPannel(targetValue);
            }
        }

        targetFunction(targetValue);
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
export function addNewData({ type, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList }: { type: string; visibleList: PannelData[]; invisibleList: PannelData[]; trackingList: PannelData[]; designList: PannelData[]; setVisibleList: Function; setInvisibleList: Function; setTrackingList: Function; setDesignList: Function }) {
    const { targetFunction, targetValue } = getTargetValueAndFunction({ type, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList });

    targetFunction(
        targetValue.concat([
            {
                index: targetValue.length,
                code: setPanelCode(),
                complete: false,
                linkList: [],
                content: "",
                pointerList: [],
                childList: [],
            },
        ])
    );
}

// 링크정보 할당
export function setLinkData({ visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList, data }: EditLinkArgument) {
    const { targetFunction, targetValue } = getTargetValueAndFunction({ type: data.pannelData.type, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList });

    if (data.pannelData.isChild === true) {
        targetValue[(data.pannelData.data as ChildPannelData).parentIndex].childList[data.pannelData.data.index].linkList = data.linkList;

        targetValue[(data.pannelData.data as ChildPannelData).parentIndex].childList[data.pannelData.data.index].pointerList.forEach((nodeId: string) => {
            const target = figma.getNodeById(nodeId) as WidgetNode | null;

            if (target !== null) {
                let defaultData = target.widgetSyncedState["pointerData"] as PointerData;

                defaultData.linkList = data.linkList;

                target.setWidgetSyncedState({
                    widgetMode: "pointer",
                    pointerData: defaultData,
                    arrowType: target.widgetSyncedState["arrowType"],
                });
            }
        });
    } else {
        targetValue[data.pannelData.data.index].linkList = data.linkList;

        targetValue[data.pannelData.data.index].pointerList.forEach((nodeId: string) => {
            const target = figma.getNodeById(nodeId) as WidgetNode | null;

            if (target !== null) {
                let defaultData = target.widgetSyncedState["pointerData"] as PointerData;

                defaultData.linkList = data.linkList;

                target.setWidgetSyncedState({
                    widgetMode: "pointer",
                    pointerData: defaultData,
                    arrowType: target.widgetSyncedState["arrowType"],
                });
            }
        });
    }

    targetFunction(targetValue);
}
