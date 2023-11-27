import type { PannelData, WidgetData, DescriptionItem, AddPannelArgument, ChildPannelData } from "./type";

export function setPanelCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < 16; i += 1) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
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

// 패널 수정 모달
export function openEditModal(type: string, isChild: boolean, data: PannelData | ChildPannelData) {
    figma.showUI(__uiFiles__.edit, { width: 900, height: 600 });
    figma.ui.postMessage({
        type: type,
        isChild: isChild,
        data: data,
    });
}

// 기본 패널 정보 추가 함수
export function addPannelData({ visibleList, invisibleList, trackingList, designList, setVisibleList, setInvisibleList, setTrackingList, setDesignList, data }: AddPannelArgument) {
    let targetFunction: any;
    let targetValue: any;

    switch (data.pannelType) {
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

//
//
//
//
//
//
//
//
//
//
//
//

// 모든 메뉴 닫기
export function closeAllMenu(data: WidgetData, setWidgetData: Function) {
    const keyList = Object.keys(data);

    keyList.forEach((key) => {
        data[key].forEach((value: DescriptionItem, i: number) => {
            data[key][i].openMenu = false;
            value.child.forEach((_, k: number) => {
                data[key][i].child[k].openMenu = false;
            });
        });
    });

    setWidgetData(data);
}

// 위젯 데이터 정리
export function saveAndArrangementData(data: WidgetData, setWidgetData: Function) {
    const keyList = Object.keys(data);

    keyList.forEach((key) => {
        data[key].forEach((value: DescriptionItem, i: number) => {
            data[key][i].id = i + 1;
            value.child.forEach((_, k: number) => {
                data[key][i].child[k].parentId = i + 1;
                data[key][i].child[k].id = k + 1;
            });
        });
    });

    setWidgetData(data);
}

// 번호 포인터로 가기
export function goToNumber(code: string, widgetId: string, figma: any) {
    const allNode: BaseNode[] = figma.currentPage.findAll();
    const targetNode: BaseNode[] = allNode.filter((node: BaseNode) => {
        if (node.type === "WIDGET" && node.widgetSyncedState.parentWidgetId === widgetId) {
            const childCode = node.widgetSyncedState.panelCode;

            if (childCode === code) {
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
