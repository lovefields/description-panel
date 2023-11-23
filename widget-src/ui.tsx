import type { PannelData, ChildPannelData } from "./type";
import { isEmptyList, openAddModal } from "./util";

const { widget } = figma;
const { useWidgetId, AutoLayout, Text, Rectangle } = widget;

export function getListStructure({ visibleList, invisibleList, trackingList, designList }: { visibleList: PannelData[]; invisibleList: PannelData[]; trackingList: PannelData[]; designList: PannelData[] }) {
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
        const visibleStructure: any = createPannelColList(visibleList, "visible");
        const invisibleStructure: any = createPannelColList(invisibleList, "invisible");
        const trackingStructure: any = createPannelColList(trackingList, "tracking");
        const designStructure: any = createPannelColList(designList, "design");

        return (
            <AutoLayout name="content-area" width={"fill-parent"} spacing={20} direction="vertical" overflow="visible">
                <AutoLayout
                    name="text-box"
                    width={"hug-contents"}
                    height={"hug-contents"}
                    fill={"#fff8f8"}
                    padding={{
                        vertical: 4,
                        horizontal: 10,
                    }}
                >
                    <Text fill={"#e84e4e"} width={"fill-parent"} fontSize={14} fontWeight={700} fontFamily={"Inter"}>
                        * Clicking on a pointer moves to that pointer's location.
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

function createPannelColList(listData: PannelData[], type: string) {
    if (listData.length > 0) {
        const row = listData.map((pannel: PannelData, i: number) => {
            console.log(pannel.childList);

            return (
                <AutoLayout name="row" width={"fill-parent"} direction="vertical" spacing={10} key={i} overflow="visible">
                    {createPannel(pannel, type)}
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

function createPannel(data: PannelData | ChildPannelData, type: string, isChild: boolean = false) {
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
            <AutoLayout name="top-area" width={"fill-parent"} spacing={"auto"} opacity={data.complete ? 0.3 : 1} overflow="visible" key={"item-top"}>
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
                    onClick={(e) => {
                        //  goToNumber(data.code, widgetId, figma);
                    }}
                >
                    <Text name="number" fill={"#fff"} fontSize={16} fontWeight={700}>
                        {isChild ? `${(data as ChildPannelData).parentIndex}-${data.index}` : String(data.index)}
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
                        onClick={(e) => {
                            //  if (data.openMenu === false) {
                            //      closeAllMenu(widgetData, setWidgetData);
                            //  }
                            //  data.openMenu = !data.openMenu;
                            //  saveAndArrangementData(widgetData, setWidgetData);
                        }}
                        overflow="visible"
                    >
                        <Rectangle width={4} height={4} fill={"#a4a4a4"} cornerRadius={4} key="cicle1" />
                        <Rectangle width={4} height={4} fill={"#a4a4a4"} cornerRadius={4} key="cicle2" />
                        <Rectangle width={4} height={4} fill={"#a4a4a4"} cornerRadius={4} key="cicle3" />
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
                key={"item-description"}
            >
                <Text name="description" width={"fill-parent"} fill={"#616161"} fontSize={16} lineHeight={"150%"} fontFamily={"Inter"}>
                    {data.content}
                </Text>
            </AutoLayout>
        </AutoLayout>
    );

    //     if (data.openMenu === true) {
    //         const menuList = [];
    //         // 편집 버튼
    //         menuList.push(
    //             <AutoLayout
    //                 name="btn"
    //                 width={"fill-parent"}
    //                 verticalAlignItems="center"
    //                 height={30}
    //                 fill={"#fff"}
    //                 cornerRadius={5}
    //                 hoverStyle={{
    //                     fill: "#6436EA",
    //                 }}
    //                 onClick={(e) => {
    //                     data.openMenu = false;
    //                     saveAndArrangementData(widgetData, setWidgetData);
    //                     return new Promise((resolve) => {
    //                         figma.showUI(__html__, { width: 420, height: 350 });
    //                         figma.ui.postMessage({
    //                             // @ts-ignore : 중복 타입
    //                             mode: data.child ? "edit" : "editChild",
    //                             ...data,
    //                         });
    //                     });
    //                 }}
    //                 key={0}
    //             >
    //                 <Text
    //                     width={"fill-parent"}
    //                     fill={"#616161"}
    //                     fontSize={14}
    //                     fontWeight={700}
    //                     lineHeight={"auto"}
    //                     horizontalAlignText="center"
    //                     fontFamily={"Inter"}
    //                     hoverStyle={{
    //                         fill: "#fff",
    //                     }}
    //                 >
    //                     Eidt
    //                 </Text>
    //             </AutoLayout>
    //         );
    //         // 포인트 생성 버튼
    //         menuList.push(
    //             <AutoLayout
    //                 name="btn"
    //                 width={"fill-parent"}
    //                 verticalAlignItems="center"
    //                 height={30}
    //                 fill={"#fff"}
    //                 cornerRadius={5}
    //                 hoverStyle={{
    //                     fill: "#6436EA",
    //                 }}
    //                 onClick={(e) => {
    //                     data.openMenu = false;
    //                     saveAndArrangementData(widgetData, setWidgetData);
    //                     return new Promise((resolve) => {
    //                         figma.showUI(`
    //                             <script>
    //                                 window.onmessage = (event) => {
    //                                     const data = event.data.pluginMessage;
    //                                     parent.postMessage({ pluginMessage: { type: "pointer", data: data } }, "*");
    //                                 };
    //                             </script>
    //                         `);
    //                         figma.ui.postMessage(data);
    //                     });
    //                 }}
    //                 key={"menu-1"}
    //             >
    //                 <Text
    //                     width={"fill-parent"}
    //                     fill={"#616161"}
    //                     fontSize={14}
    //                     fontWeight={700}
    //                     lineHeight={"auto"}
    //                     horizontalAlignText="center"
    //                     fontFamily={"Inter"}
    //                     hoverStyle={{
    //                         fill: "#fff",
    //                     }}
    //                 >
    //                     Make Pointer
    //                 </Text>
    //             </AutoLayout>
    //         );
    //         // @ts-ignore : 자식요소 유무 확인
    //         if (data?.parentId === undefined) {
    //             // 자식 생성 버튼
    //             menuList.push(
    //                 <AutoLayout
    //                     name="btn"
    //                     width={"fill-parent"}
    //                     verticalAlignItems="center"
    //                     height={30}
    //                     fill={"#fff"}
    //                     cornerRadius={5}
    //                     hoverStyle={{
    //                         fill: "#6436EA",
    //                     }}
    //                     onClick={(e) => {
    //                         data.openMenu = false;
    //                         saveAndArrangementData(widgetData, setWidgetData);
    //                         return new Promise((resolve) => {
    //                             figma.showUI(__html__, { width: 420, height: 350 });
    //                             figma.ui.postMessage({
    //                                 ...data,
    //                                 mode: "addChild",
    //                                 code: setPanelCode(),
    //                             });
    //                         });
    //                     }}
    //                     key={"menu-2"}
    //                 >
    //                     <Text
    //                         width={"fill-parent"}
    //                         fill={"#616161"}
    //                         fontSize={14}
    //                         fontWeight={700}
    //                         lineHeight={"auto"}
    //                         horizontalAlignText="center"
    //                         fontFamily={"Inter"}
    //                         hoverStyle={{
    //                             fill: "#fff",
    //                         }}
    //                     >
    //                         Make Sub
    //                     </Text>
    //                 </AutoLayout>
    //             );
    //         }
    //         // 완료 버튼
    //         menuList.push(
    //             <AutoLayout
    //                 name="btn"
    //                 width={"fill-parent"}
    //                 verticalAlignItems="center"
    //                 height={30}
    //                 fill={"#fff"}
    //                 cornerRadius={5}
    //                 hoverStyle={{
    //                     fill: "#6436EA",
    //                 }}
    //                 onClick={(e) => {
    //                     data.complete = !data.complete;
    //                     data.openMenu = false;
    //                     saveAndArrangementData(widgetData, setWidgetData);
    //                 }}
    //                 key={"menu-3"}
    //             >
    //                 <Text
    //                     width={"fill-parent"}
    //                     fill={"#616161"}
    //                     fontSize={14}
    //                     fontWeight={700}
    //                     lineHeight={"auto"}
    //                     horizontalAlignText="center"
    //                     fontFamily={"Inter"}
    //                     hoverStyle={{
    //                         fill: "#fff",
    //                     }}
    //                 >
    //                     {data.complete ? "Un-Complete" : "Complete"}
    //                 </Text>
    //             </AutoLayout>
    //         );
    //         // 삭제 버튼
    //         menuList.push(
    //             <AutoLayout
    //                 name="btn"
    //                 width={"fill-parent"}
    //                 verticalAlignItems="center"
    //                 height={30}
    //                 fill={"#fff"}
    //                 cornerRadius={5}
    //                 hoverStyle={{
    //                     fill: "#6436EA",
    //                 }}
    //                 onClick={(e) => {
    //                     data.openMenu = false;
    //                     deleteData(data);
    //                 }}
    //                 key={"menu-4"}
    //             >
    //                 <Text
    //                     width={"fill-parent"}
    //                     fill={"#616161"}
    //                     fontSize={14}
    //                     fontWeight={700}
    //                     lineHeight={"auto"}
    //                     horizontalAlignText="center"
    //                     fontFamily={"Inter"}
    //                     hoverStyle={{
    //                         fill: "#fff",
    //                     }}
    //                 >
    //                     Delete
    //                 </Text>
    //             </AutoLayout>
    //         );
    //         const yPosition = 15 - menuList.length * 30 - (menuList.length - 1) * 5;
    //         panelChildList.push(
    //             <AutoLayout
    //                 name="btn-area"
    //                 positioning="absolute"
    //                 width={157}
    //                 x={
    //                     // @ts-ignore : 타입 중복
    //                     data.child ? 308 : 289
    //                 }
    //                 y={yPosition}
    //                 padding={10}
    //                 direction="vertical"
    //                 spacing={5}
    //                 fill={"#fff"}
    //                 cornerRadius={10}
    //                 effect={{
    //                     type: "drop-shadow",
    //                     color: { r: 0.04, g: 0.012, b: 0.121, a: 0.1 },
    //                     offset: { x: 0, y: 4 },
    //                     blur: 48,
    //                 }}
    //                 key="item-menu"
    //             >
    //                 {menuList}
    //             </AutoLayout>
    //         );
    //     }
    //     return (
    //         <AutoLayout name="item" width={"fill-parent"} direction="vertical" key={data.id} fill={"#fff"} stroke={"#E0E0E0"} strokeAlign={"inside"} strokeWidth={1} spacing={20} cornerRadius={10} padding={10} overflow="visible">
    //             {panelChildList}
    //         </AutoLayout>
    //     );
}
