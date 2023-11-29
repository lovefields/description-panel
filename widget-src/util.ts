import type { PannelData, AddPannelArgument, ChildPannelData, EditPannelArgument, CreatePinterArgument, LinkItem, PointerData, AddChildPannelArgument, GetPannelStructure, EditChildPannelArgument } from "./type";

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

// 기본 패널 추가 모달
export function openAddModal() {
    figma.showUI(__uiFiles__.new, { width: 900, height: 600 });
}

// 자식 패널 추가 모달
export function openChildAddModal(type: string, data: PannelData) {
    figma.showUI(__uiFiles__.newChild, { width: 900, height: 600 });
    figma.ui.postMessage({
        type: type,
        data: data,
    });
}

// 패널 수정 모달
export function openEditModal(type: string, isChild: boolean, data: PannelData | ChildPannelData) {
    figma.showUI(__uiFiles__.edit, { width: 900, height: 600 });
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

// 기본 패널 정보 추가 함수
export function addPannelData({ visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList, data }: AddPannelArgument) {
    let { targetFunction, targetValue } = getTargetValueAndFunction({ type: data.pannelType, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList });

    targetFunction(
        targetValue.concat([
            {
                index: targetValue.length,
                code: setPanelCode(),
                complete: false,
                linkList: data.linkList,
                content: data.content,
                pointerList: [],
                childList: [],
            },
        ])
    );
}

// 기본 패널 정보 수정 함수
export function editPannelData({ visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList, data }: EditPannelArgument) {
    let { targetFunction, targetValue } = getTargetValueAndFunction({ type: data.pannelType, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList });

    if (data.pannelData.pointerList.length > 0) {
        const nullList: string[] = [];

        data.pannelData.pointerList.forEach((nodeId: string) => {
            const target = figma.getNodeById(nodeId) as WidgetNode | null;

            if (target === null) {
                nullList.push(nodeId);
            } else {
                let defaultData = target.widgetSyncedState["pointerData"] as PointerData;

                defaultData.content = data.pannelData.content;
                defaultData.linkList = data.pannelData.linkList;

                target.setWidgetSyncedState({
                    widgetMode: "pointer",
                    pointerData: defaultData,
                    arrowType: target.widgetSyncedState["arrowType"],
                });
            }
        });

        nullList.forEach((nodeId) => {
            const idx = data.pannelData.pointerList.indexOf(nodeId);

            if (idx !== -1) {
                data.pannelData.pointerList.splice(idx, 1);
            }
        });
    }

    targetValue[data.pannelData.index] = data.pannelData;
    targetFunction(targetValue);
}

// 자식 패널 정보 수정 함수
export function editChildPannelData({ visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList, data }: EditChildPannelArgument) {
    let { targetFunction, targetValue } = getTargetValueAndFunction({ type: data.pannelType, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList });

    if (targetValue[data.pannelData.parentIndex].childList[data.pannelData.index].pointerList.length > 0) {
        const nullList: string[] = [];

        targetValue[data.pannelData.parentIndex].childList[data.pannelData.index].pointerList.forEach((nodeId: string) => {
            const target = figma.getNodeById(nodeId) as WidgetNode | null;

            if (target === null) {
                nullList.push(nodeId);
            } else {
                let defaultData = target.widgetSyncedState["pointerData"] as PointerData;

                defaultData.content = data.pannelData.content;
                defaultData.linkList = data.pannelData.linkList;

                target.setWidgetSyncedState({
                    widgetMode: "pointer",
                    pointerData: defaultData,
                    arrowType: target.widgetSyncedState["arrowType"],
                });
            }
        });

        nullList.forEach((nodeId) => {
            const idx = targetValue[data.pannelData.parentIndex].childList[data.pannelData.index].pointerList.indexOf(nodeId);

            if (idx !== -1) {
                targetValue[data.pannelData.parentIndex].childList[data.pannelData.index].pointerList.splice(idx, 1);
            }
        });
    }

    targetValue[data.pannelData.parentIndex].childList[data.pannelData.index] = data.pannelData;
    targetFunction(targetValue);
}

// 자식 패널 정보 추가 함수
export function addChildPannelData({ visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList, data }: AddChildPannelArgument) {
    let { targetFunction, targetValue } = getTargetValueAndFunction({ type: data.pannelType, visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList });

    targetValue[data.parentIndex].childList.push({
        code: setPanelCode(),
        index: targetValue[data.parentIndex].childList.length,
        complete: false,
        content: data.content,
        linkList: data.linkList,
        pointerList: [],
        parentIndex: data.parentIndex,
        parentCode: targetValue[data.parentIndex].code,
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
