import { WidgetData, DescriptionItem } from "./type";

export function setPanelCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < 5; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

// 위젯 데이터 정리
export function saveAndArrangementData(data: WidgetData, setWidgetData: Function) {
    const keyList = Object.keys(data);

    keyList.forEach((key) => {
        data[key].forEach((value: DescriptionItem, i: number) => {
            data[key][i].id = i + 1;
            value.child.forEach((_, k: number) => {
                data[key][i].child[k].id = k + 1;
            });
        });
    });

    setWidgetData(data);
}

// 번호 포인터로 가기
export function goToNumber(id: number, type: string, widgetId: string, figma: any) {
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
