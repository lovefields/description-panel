
                //         if (msg.type === "add") {
                //             widgetData[data.type].push(data);
                //             saveAndArrangementData(widgetData, setWidgetData);
                //         }
                //         if (msg.type === "addChild") {
                //             widgetData[data.type][data.parentId - 1].child.push(data);
                //             saveAndArrangementData(widgetData, setWidgetData);
                //         }
                //         if (msg.type === "edit") {
                //             // 부모 수정
                //             widgetData[data.type][data.id - 1].content = data.content;
                //             saveAndArrangementData(widgetData, setWidgetData);
                //             const allNode: any[] = figma.currentPage.findAll();
                //             const targetNodes: any[] = allNode.filter((node) => {
                //                 if (node.type === "WIDGET" && node.widgetSyncedState.panelCode === data.code) {
                //                     return node;
                //                 }
                //             });
                //             targetNodes.forEach((node) => {
                //                 node.setWidgetSyncedState({
                //                     widgetType: "child",
                //                     parentWidgetId: widgetId,
                //                     panelCode: data.code,
                //                     displayData: {
                //                         displayNumber: String(data.id),
                //                         type: data.type,
                //                         content: data.content,
                //                     },
                //                 });
                //             });
                //         }
                //         if (msg.type === "editChild") {
                //             // 자식 수정
                //             widgetData[data.type][data.parentId - 1].child[data.id - 1].content = data.content;
                //             saveAndArrangementData(widgetData, setWidgetData);
                //             const allNode: any[] = figma.currentPage.findAll();
                //             const targetNodes: any[] = allNode.filter((node) => {
                //                 if (node.type === "WIDGET" && node.widgetSyncedState.panelCode === data.code) {
                //                     return node;
                //                 }
                //             });
                //             targetNodes.forEach((node) => {
                //                 node.setWidgetSyncedState({
                //                     widgetType: "child",
                //                     parentWidgetId: widgetId,
                //                     panelCode: data.code,
                //                     displayData: {
                //                         displayNumber: `${data.parentId}-${data.id}`,
                //                         type: data.type,
                //                         content: data.content,
                //                     },
                //                 });
                //             });
                //         }
                //         if (msg.type === "pointer") {
                //             // 포인터 생성
                //             const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
                //             const parentNode = widgetNode?.parent as BaseNode;
                //             const childNode = widgetNode.cloneWidget({
                //                 widgetType: "child",
                //                 parentWidgetId: widgetId,
                //                 panelCode: data.code,
                //                 displayData: {
                //                     displayNumber: data.child ? data.id : `${data.parentId}-${data.id}`,
                //                     type: data.type,
                //                     content: data.content,
                //                 },
                //             });
                //             childNode.x -= 38;
                //             if (parentNode.type === "SECTION" || parentNode.type === "GROUP" || parentNode.type === "FRAME") {
                //                 parentNode.appendChild(childNode);
                //             }
                //         }



    // const [widgetType] = useSyncedState<string>("widgetType", "parent");
    // const [parentWidgetId] = useSyncedState<string>("parentWidgetId", "");
    // const [panelCode] = useSyncedState<string>("panelCode", "");
    // const [displayData] = useSyncedState<DisplayItemData>("displayData", {
    //     displayNumber: "",
    //     type: "",
    //     content: "",
    // });
    // const [widgetData, setWidgetData] = useSyncedState<WidgetData>("widgetData", {
    //     visible: [],
    //     invisible: [],
    //     tracking: [],
    //     design: [],
    // });
    // const [pageTitle, setPageTitle] = useSyncedState<string>("pageTitle", "");
    // const [pageCaption, setPageCaption] = useSyncedState<string>("pageCaption", "");
    // const widgetId: string = useWidgetId();

    // let count = 0;
    // const keyList = Object.keys(widgetData);

    // keyList.map((key) => {
    //     if (widgetData[key].length > 0) {
    //         count += 1;
    //     }
    // });

    // if (count == 0) {
    //     count = 1;
    // }

    // const widgetWidth = 100 + 500 * count + 20 * (count - 1);
    // const layoutArray = []; // 화면 드로잉 저장소

    // if (widgetType == "parent") {
    //     usePropertyMenu(
    //         [
    //             {
    //                 itemType: "action",
    //                 propertyName: "add",
    //                 tooltip: "Add New Description",
    //             },
    //             {
    //                 itemType: "action",
    //                 propertyName: "complete",
    //                 tooltip: "Complete All",
    //             },
    //             {
    //                 itemType: "action",
    //                 propertyName: "new",
    //                 tooltip: "New Widget",
    //             },
    //         ],
    //         ({ propertyName, propertyValue }) => {
    //             if (propertyName == "add") {
    //                 // 일반 패널 추가
    //                 closeAllMenu(widgetData, setWidgetData);
    //                 return new Promise((resolve) => {
    //                     figma.showUI(__html__, { width: 510, height: 520 });
    //                     figma.ui.postMessage({
    //                         mode: "new",
    //                         code: setPanelCode(),
    //                     });
    //                 });
    //             }

    //             if (propertyName == "new") {
    //                 closeAllMenu(widgetData, setWidgetData);
    //                 const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
    //                 const parentNode = widgetNode?.parent as BaseNode;
    //                 const childNode = widgetNode.cloneWidget({
    //                     widgetType: "parent",
    //                     pageTitle: "",
    //                     pageCaption: "",
    //                     widgetData: {
    //                         visible: [],
    //                         invisible: [],
    //                         tracking: [],
    //                         design: [],
    //                     },
    //                 });

    //                 childNode.x += widgetWidth + 50;

    //                 if (parentNode.type === "SECTION" || parentNode.type === "GROUP" || parentNode.type === "FRAME") {
    //                     parentNode.appendChild(childNode);
    //                 }
    //             }

    //             if (propertyName == "complete") {
    //                 closeAllMenu(widgetData, setWidgetData);
    //                 for (let [key, value] of Object.entries(widgetData)) {
    //                     widgetData[key].forEach((row) => {
    //                         row.complete = true;

    //                         row.child.forEach((child) => {
    //                             child.complete = true;
    //                         });
    //                     });
    //                 }
    //                 saveAndArrangementData(widgetData, setWidgetData);
    //             }
    //         }
    //     );
    // }

    // // 정보 삭제
    // function deleteData(data: DescriptionItem | ChildItem) {
    //     const allNode: BaseNode[] = figma.currentPage.findAll();
    //     const targetNode: any[] = allNode.filter((node: BaseNode) => {
    //         if (node.type === "WIDGET" && node.widgetSyncedState.parentWidgetId === widgetId) {
    //             const displayData = node.widgetSyncedState.displayData;

    //             if (displayData.type == data.type) {
    //                 return node;
    //             }
    //         }
    //     });
    //     // @ts-ignore : 타입 중복
    //     const isParent: boolean = data?.child ? true : false;

    //     if (isParent === true) {
    //         // 부모인 경우
    //         widgetData[data.type].splice(data.id - 1, 1);
    //     } else {
    //         // @ts-ignore : 타입 중복 // 자식인 경우
    //         widgetData[data.type][data.parentId - 1].child.splice(data.id - 1, 1);
    //     }

    //     saveAndArrangementData(widgetData, setWidgetData);

    //     let arrangeList: any[] = widgetData[data.type];
    //     widgetData[data.type].forEach((node) => {
    //         arrangeList = arrangeList.concat(node.child);
    //     });

    //     targetNode.forEach((node, i) => {
    //         const panelCode = node.widgetSyncedState.panelCode;
    //         const hasData = arrangeList.filter((item) => item.code === panelCode);

    //         if (hasData[0]) {
    //             node.setWidgetSyncedState({
    //                 widgetType: "child",
    //                 parentWidgetId: widgetId,
    //                 panelCode: hasData[0].code,
    //                 displayData: {
    //                     displayNumber: hasData[0].child ? String(hasData[0].id) : `${hasData[0].parentId}-${hasData[0].id}`,
    //                     type: hasData[0].type,
    //                     content: hasData[0].content,
    //                 },
    //             });
    //         } else {
    //             node.remove();
    //         }
    //     });
    // }

    // function listStructure() {
    //     let noData = true;
    //     let keyList = Object.keys(widgetData);
    //     let column = keyList.map((key) => {
    //         if (widgetData[key].length > 0) {
    //             noData = false;
    //             let item = widgetData[key].map((row: DescriptionItem) => {
    //                 const childList = row.child.map((child) => {
    //                     return itemStructure(child);
    //                 });

    //                 return (
    //                     <AutoLayout name="row" width={"fill-parent"} direction="vertical" spacing={10} key={row.code} overflow="visible">
    //                         {itemStructure(row)}
    //                         {row.child.length > 0 ? (
    //                             <AutoLayout
    //                                 name="chld-row"
    //                                 width={"fill-parent"}
    //                                 direction="vertical"
    //                                 spacing={10}
    //                                 padding={{
    //                                     left: 20,
    //                                 }}
    //                                 overflow="visible"
    //                             >
    //                                 {childList}
    //                             </AutoLayout>
    //                         ) : null}
    //                     </AutoLayout>
    //                 );
    //             });

    //             return (
    //                 <AutoLayout name={`${key}-column`} width={"fill-parent"} direction="vertical" spacing={10} key={key} overflow="visible">
    //                     {item}
    //                 </AutoLayout>
    //             );
    //         }
    //     });

    //     if (noData == true) {
    //         return (
    //             <AutoLayout
    //                 onClick={(e) => {
    //                     return new Promise((resolve) => {
    //                         figma.showUI(__html__, { width: 510, height: 520 });
    //                         figma.ui.postMessage({
    //                             mode: "new",
    //                             code: setPanelCode(),
    //                         });
    //                     });
    //                 }}
    //                 fill={"#6436EA"}
    //                 width={"fill-parent"}
    //                 height={35}
    //                 horizontalAlignItems={"center"}
    //                 verticalAlignItems={"center"}
    //                 cornerRadius={5}
    //             >
    //                 <Text fill={"#fff"} fontSize={14} fontWeight={700} fontFamily={"Noto Sans"}>
    //                     Add New Description
    //                 </Text>
    //             </AutoLayout>
    //         );
    //     } else {
    //         return (
    //             <AutoLayout name="content-area" width={"fill-parent"} spacing={20} direction="vertical" overflow="visible">
    //                 <AutoLayout
    //                     name="text-box"
    //                     width={"hug-contents"}
    //                     height={"hug-contents"}
    //                     fill={"#fff8f8"}
    //                     padding={{
    //                         vertical: 4,
    //                         horizontal: 10,
    //                     }}
    //                 >
    //                     <Text fill={"#e84e4e"} width={"fill-parent"} fontSize={14} fontWeight={700} fontFamily={"Noto Sans"}>
    //                         * Clicking on a pointer moves to that pointer's location.
    //                     </Text>
    //                 </AutoLayout>

    //                 <AutoLayout name="list-area" width={"fill-parent"} spacing={20} overflow="visible">
    //                     {column}
    //                 </AutoLayout>
    //             </AutoLayout>
    //         );
    //     }
    // }

    // function itemStructure(data: DescriptionItem | ChildItem) {
    //     const panelChildList = [];
    //     let bgColor = "";
    //     let textColor = "";

    //     switch (data.type) {
    //         case "visible":
    //             bgColor = "#F0EBFD";
    //             textColor = "#6436EA";
    //             break;
    //         case "invisible":
    //             bgColor = "#FFEFEA";
    //             textColor = "#F66134";
    //             break;
    //         case "tracking":
    //             bgColor = "#ECF7FF";
    //             textColor = "#47B6FE";
    //             break;
    //         case "design":
    //             bgColor = "#E9FAEF";
    //             textColor = "#38C66B";
    //             break;
    //     }

    //     panelChildList.push(
    //         <AutoLayout name="top-area" width={"fill-parent"} spacing={"auto"} opacity={data.complete ? 0.3 : 1} overflow="visible" key={"item-top"}>
    //             <AutoLayout
    //                 name="pointer"
    //                 width={28}
    //                 height={28}
    //                 fill={textColor}
    //                 cornerRadius={30}
    //                 horizontalAlignItems={"center"}
    //                 verticalAlignItems={"center"}
    //                 onClick={(e) => {
    //                     goToNumber(data.code, widgetId, figma);
    //                 }}
    //             >
    //                 <Text name="number" fill={"#fff"} fontSize={16} fontWeight={700}>
    //                     {
    //                         // @ts-ignore : 중복 타입
    //                         data.child ? data.id : `${data.parentId}-${data.id}`
    //                     }
    //                 </Text>
    //             </AutoLayout>

    //             <AutoLayout name="right-aerae" width={"hug-contents"} spacing={5} verticalAlignItems={"center"} overflow="visible">
    //                 <AutoLayout
    //                     name="type"
    //                     width={"hug-contents"}
    //                     fill={bgColor}
    //                     padding={{
    //                         vertical: 4,
    //                         horizontal: 8,
    //                     }}
    //                     cornerRadius={5}
    //                 >
    //                     <Text name="type" fill={textColor} fontSize={14} fontWeight={700} fontFamily={"Noto Sans"}>
    //                         {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
    //                     </Text>
    //                 </AutoLayout>

    //                 <AutoLayout
    //                     name="btn-menu"
    //                     direction="vertical"
    //                     width={24}
    //                     height={24}
    //                     horizontalAlignItems={"center"}
    //                     verticalAlignItems={"center"}
    //                     spacing={2}
    //                     onClick={(e) => {
    //                         if (data.openMenu === false) {
    //                             closeAllMenu(widgetData, setWidgetData);
    //                         }
    //                         data.openMenu = !data.openMenu;
    //                         saveAndArrangementData(widgetData, setWidgetData);
    //                     }}
    //                     overflow="visible"
    //                 >
    //                     <Rectangle width={4} height={4} fill={"#a4a4a4"} cornerRadius={4} key="cicle1" />
    //                     <Rectangle width={4} height={4} fill={"#a4a4a4"} cornerRadius={4} key="cicle2" />
    //                     <Rectangle width={4} height={4} fill={"#a4a4a4"} cornerRadius={4} key="cicle3" />
    //                 </AutoLayout>
    //             </AutoLayout>
    //         </AutoLayout>
    //     );

    //     panelChildList.push(
    //         <AutoLayout
    //             name="text-area"
    //             fill={"#fafafa"}
    //             width={"fill-parent"}
    //             padding={{
    //                 vertical: 4,
    //                 horizontal: 8,
    //             }}
    //             cornerRadius={5}
    //             opacity={data.complete ? 0.3 : 1}
    //             key={"item-description"}
    //         >
    //             <Text name="description" width={"fill-parent"} fill={"#616161"} fontSize={16} lineHeight={"150%"} fontFamily={"Noto Sans"}>
    //                 {data.content}
    //             </Text>
    //         </AutoLayout>
    //     );

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
    //                     fontFamily={"Noto Sans"}
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
    //                     fontFamily={"Noto Sans"}
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
    //                         fontFamily={"Noto Sans"}
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
    //                     fontFamily={"Noto Sans"}
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
    //                     fontFamily={"Noto Sans"}
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
    // }

    // if (widgetType == "parent") {
    //     return (
    //         <AutoLayout
    //             name="wrap"
    //             width={widgetWidth}
    //             direction={"vertical"}
    //             spacing={60}
    //             padding={{ top: 50, left: 50, right: 50, bottom: 200 }}
    //             cornerRadius={10}
    //             stroke={"#E0D7FB"}
    //             strokeAlign={"inside"}
    //             strokeWidth={1}
    //             fill={"#FFFFFF"}
    //             effect={{
    //                 type: "drop-shadow",
    //                 color: { r: 0.04, g: 0.012, b: 0.121, a: 0.1 },
    //                 offset: { x: 0, y: 4 },
    //                 blur: 48,
    //             }}
    //         >
    //             <AutoLayout name="Page information" width={"fill-parent"} direction={"vertical"} spacing={10}>
    //                 <Input
    //                     value={pageTitle}
    //                     placeholder="Page Title"
    //                     onTextEditEnd={(e) => {
    //                         setPageTitle(e.characters);
    //                     }}
    //                     fontSize={24}
    //                     fontWeight={700}
    //                     fontFamily={"Noto Sans"}
    //                     width={"fill-parent"}
    //                     fill="#333"
    //                     inputBehavior="multiline"
    //                 />
    //                 <AutoLayout
    //                     width={"fill-parent"}
    //                     fill={"#FAFAFA"}
    //                     cornerRadius={10}
    //                     padding={{
    //                         vertical: 10,
    //                         horizontal: 20,
    //                     }}
    //                 >
    //                     <Input
    //                         value={pageCaption}
    //                         placeholder="Page Description"
    //                         onTextEditEnd={(e) => {
    //                             setPageCaption(e.characters);
    //                         }}
    //                         fontSize={16}
    //                         fontFamily={"Noto Sans"}
    //                         width={"fill-parent"}
    //                         fill="#616161"
    //                         inputBehavior="multiline"
    //                     />
    //                 </AutoLayout>
    //             </AutoLayout>
    //             {listStructure()}
    //         </AutoLayout>
    //     );
    // } else {
    //     let bgColor = "";

    //     switch (displayData.type) {
    //         case "visible":
    //             bgColor = "#6436EA";
    //             break;
    //         case "invisible":
    //             bgColor = "#F66134";
    //             break;
    //         case "tracking":
    //             bgColor = "#47B6FE";
    //             break;
    //         case "design":
    //             bgColor = "#38C66B";
    //             break;
    //     }

    //     return (
    //         <AutoLayout
    //             name="wrap"
    //             width={28}
    //             height={28}
    //             fill={bgColor}
    //             cornerRadius={30}
    //             horizontalAlignItems={"center"}
    //             verticalAlignItems={"center"}
    //             onClick={(e) => {
    //                 return new Promise((resolve) => {
    //                     figma.showUI(__html__, { width: 420, height: 400 });
    //                     figma.ui.postMessage({
    //                         mode: "view",
    //                         ...displayData,
    //                     });
    //                 });
    //             }}
    //         >
    //             <Text fill={"#fff"} fontSize={16} fontWeight={700}>
    //                 {displayData.displayNumber}
    //             </Text>
    //         </AutoLayout>
    //     );
    // }