import { WidgetData, DescriptionItem } from "./type";

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
