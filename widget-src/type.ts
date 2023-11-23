interface LinkItem {
    name: string;
    value: string;
}

interface DefaultPannelData {
    code: string;
    index: number;
    complete: boolean;
    content: string;
    linkList: LinkItem[];
    pointerList: string[];
}

export interface PannelData extends DefaultPannelData {
    childList: ChildPannelData[];
}

export interface ChildPannelData extends DefaultPannelData {
    parentIndex: number;
    parentCode: string;
}

interface AddPannelData {
    pannelType: string;
    content: string;
    linkList: LinkItem[];
}

export interface AddPannelArgument {
    visibleList: PannelData[];
    invisibleList: PannelData[];
    trackingList: PannelData[];
    designList: PannelData[];
    setVisibleList: Function;
    setInvisibleList: Function;
    setTrackingList: Function;
    setDesignList: Function;
    data: AddPannelData;
}

//
//
//
//
//
//
// 디스크립션 기본 정보 구조
interface DefaultItemObject {
    id: number;
    type: string;
    code: string;
    content: string;
    complete: boolean;
    openMenu: boolean;
}

// 화면 표기용 정보 구조
export interface DisplayItemData {
    displayNumber: string;
    type: string;
    content: string;
}

// 서브 디스크립션 정보 구조
export interface ChildItem extends DefaultItemObject {
    parentId: number;
}

// 디스크립션 정보 구조
export interface DescriptionItem extends DefaultItemObject {
    child: ChildItem[];
}

// 위젯 정보 구조
export interface WidgetData {
    [key: string]: DescriptionItem[];
    visible: DescriptionItem[];
    invisible: DescriptionItem[];
    tracking: DescriptionItem[];
    design: DescriptionItem[];
}
