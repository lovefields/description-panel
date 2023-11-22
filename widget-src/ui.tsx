import type { PannelData } from "./type";
import { isEmptyList, openAddModal } from "./util";

const { widget } = figma;
const { useWidgetId, useSyncedState, usePropertyMenu, AutoLayout, Text, Input, useEffect, Rectangle } = widget;

export function getListStructure({ visibleList, invisibleList, trackingList, designList }: { visibleList: PannelData[]; invisibleList: PannelData[]; trackingList: PannelData[]; designList: PannelData[] }) {
    const widgetId: string = useWidgetId();

    if (isEmptyList({ visibleList, invisibleList, trackingList, designList }) === true) {
        return (
            <AutoLayout
                onClick={(e) => {
                    return new Promise((resolve) => {
                        openAddModal();
                    });
                }}
                fill={"#6436EA"}
                width={"fill-parent"}
                height={35}
                horizontalAlignItems={"center"}
                verticalAlignItems={"center"}
                cornerRadius={5}
            >
                <Text fill={"#fff"} fontSize={14} fontWeight={700} fontFamily={"Inter"}>
                    Add New Description
                </Text>
            </AutoLayout>
        );
    } else {
        return (
            <Text
                onClick={(e) => {
                    const self = figma.getNodeById(widgetId) as unknown as WidgetNode;
                    console.log("self.x", self.x);
                    console.log("self.y", self.y);
                    console.log("x", e.canvasX);
                    console.log("y", e.canvasY);

                    console.log("innerX", e.canvasX - self.x);
                    console.log("innerY", e.canvasY - self.y);
                }}
            >
                I'm list
            </Text>
        );
    }
}
