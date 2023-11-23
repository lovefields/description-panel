import type { PannelData, DescriptionItem, WidgetData, DisplayItemData, ChildItem } from "./type";
import { getLayoutSize, addPannelData, goToNumber, saveAndArrangementData, setPanelCode, closeAllMenu } from "./util";
import { getListStructure } from "./ui";

const { widget } = figma;
const { useWidgetId, useSyncedState, useEffect, usePropertyMenu, AutoLayout, Text, Input, Rectangle } = widget;

function plannerWidget() {
    const [widgetMode] = useSyncedState<string>("widgetMode", "list");

    let structure;

    if (widgetMode === "list") {
        const [widgetTitle, setWidgetTitle] = useSyncedState<string>("widgetTitle", "");
        const [widgetCaption, setWidgetCaption] = useSyncedState<string>("widgetCaption", "");
        const [visibleList, setVisibleList] = useSyncedState<PannelData[]>("visibleList", []);
        const [invisibleList, setInvisibleList] = useSyncedState<PannelData[]>("invisibleList", []);
        const [trackingList, setTrackingList] = useSyncedState<PannelData[]>("trackingList", []);
        const [designList, setDesignList] = useSyncedState<PannelData[]>("designList", []);

        const widgetId: string = useWidgetId();
        const widgetWidth = getLayoutSize({
            visibleList: visibleList,
            invisibleList: invisibleList,
            trackingList: trackingList,
            designList: designList,
        });

        useEffect(() => {
            figma.ui.onmessage = (msg) => {
                const data = msg.data;

                // 기본 패널 추가
                if (msg.type === "addPannel") {
                    addPannelData({
                        visibleList: visibleList,
                        invisibleList: invisibleList,
                        trackingList: trackingList,
                        designList: designList,
                        setVisibleList: setVisibleList,
                        setInvisibleList: setInvisibleList,
                        setTrackingList: setTrackingList,
                        setDesignList: setDesignList,
                        data: data,
                    });
                    figma.closePlugin();
                }

                // 메세지 표기
                if (msg.type === "message") {
                    figma.notify(data.text, {
                        error: data.error,
                    });
                }

                if (msg.type === "close") {
                    figma.closePlugin();
                }
            };
        });

        structure = (
            <AutoLayout
                name="wrap"
                width={widgetWidth}
                direction={"vertical"}
                spacing={50}
                padding={50}
                cornerRadius={10}
                stroke={"#E0D7FB"}
                strokeAlign={"inside"}
                strokeWidth={1}
                fill={"#FFFFFF"}
                effect={{
                    type: "drop-shadow",
                    color: { r: 0.04, g: 0.012, b: 0.121, a: 0.1 },
                    offset: { x: 0, y: 4 },
                    blur: 48,
                }}
            >
                <AutoLayout name="Page information" width={"fill-parent"} direction={"vertical"} spacing={10}>
                    <Input
                        value={widgetTitle}
                        placeholder="Page Title"
                        onTextEditEnd={(e) => {
                            setWidgetTitle(e.characters);
                        }}
                        fontSize={24}
                        fontWeight={700}
                        fontFamily={"Inter"}
                        width={"fill-parent"}
                        fill="#333"
                        inputBehavior="multiline"
                    />
                    <AutoLayout
                        width={"fill-parent"}
                        fill={"#FAFAFA"}
                        cornerRadius={10}
                        padding={{
                            vertical: 10,
                            horizontal: 20,
                        }}
                    >
                        <Input
                            value={widgetCaption}
                            placeholder="Page Description"
                            onTextEditEnd={(e) => {
                                setWidgetCaption(e.characters);
                            }}
                            fontSize={16}
                            fontFamily={"Inter"}
                            width={"fill-parent"}
                            fill="#616161"
                            inputBehavior="multiline"
                        />
                    </AutoLayout>
                </AutoLayout>

                {getListStructure({
                    visibleList: visibleList,
                    invisibleList: invisibleList,
                    trackingList: trackingList,
                    designList: designList,
                })}
            </AutoLayout>
        );
    } else {
        structure = (
            <AutoLayout>
                <Text>I'm pointer</Text>
            </AutoLayout>
        );
    }

    return structure;
}

widget.register(plannerWidget);
