export interface LinkItem {
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

interface PannelArgument {
    visibleList: PannelData[];
    invisibleList: PannelData[];
    trackingList: PannelData[];
    designList: PannelData[];
    setVisibleList: Function;
    setInvisibleList: Function;
    setTrackingList: Function;
    setDesignList: Function;
}

export interface GetPannelStructure extends PannelArgument {
    type: string;
}

export interface CompletePannelArgument extends PannelArgument {
    status: boolean;
}

export interface AddChildPannelArgument extends PannelArgument {
    data: {
        pannelType: string;
        pannelData: PannelData;
    };
}

export interface EditLinkArgument extends PannelArgument {
    data: {
        pannelData: {
            type: string;
            isChild: boolean;
            data: PannelData | ChildPannelData;
        };
        linkList: LinkItem[];
    };
}

export interface CreatePinterArgument extends PannelArgument {
    data: {
        pannelType: string;
        isChild: boolean;
        pannelData: PannelData | ChildPannelData;
    };
    widgetId: string;
}

export interface MovePannelArgument extends PannelArgument {
    data: {
        pannelType: string;
        isChild: boolean;
        pannelData: PannelData | ChildPannelData;
    };
    move: string;
}

export interface CompletePinterArgument extends PannelArgument {
    data: {
        pannelType: string;
        isChild: boolean;
        pannelData: PannelData | ChildPannelData;
    };
}

export interface MenuData {
    active: boolean;
    x: number;
    y: number;
    isChild: boolean;
    isComplate: boolean;
    lastCode: string;
    targetType: string;
    targetIdx: number;
    targetParentIdx: number | null;
}

export interface PointerData {
    viewText: string;
    type: string;
    content: string;
    linkList: LinkItem[];
    index: number;
    parentIndex: number | null;
    parentWidgetId: string;
}
