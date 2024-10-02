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
    writer: string;
    showUrl: boolean;
    date: string;
}

interface PannelData extends DefaultPannelData {
    childList: ChildPannelData[];
}

interface ChildPannelData extends DefaultPannelData {
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

interface GetPannelStructure extends PannelArgument {
    type: string;
}

interface CompletePannelArgument extends PannelArgument {
    status: boolean;
}

interface AddChildPannelArgument {
    pannelType: string;
    pannelData: PannelData;
}

interface EditLinkArgument {
    pannelData: {
        type: string;
        isChild: boolean;
        data: PannelData | ChildPannelData;
        widgetOption: WidgetOption;
    };
    linkList: LinkItem[];
}

interface CreatePinterArgument {
    pannelType: string;
    isChild: boolean;
    pannelData: PannelData | ChildPannelData;
}

interface MovePannelArgument extends PannelArgument {
    data: {
        pannelType: string;
        isChild: boolean;
        pannelData: PannelData | ChildPannelData;
    };
    move: string;
}

interface CompletePinterArgument extends PannelArgument {
    data: {
        pannelType: string;
        isChild: boolean;
        pannelData: PannelData | ChildPannelData;
    };
}

interface MenuData {
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

interface PointerData {
    viewText: string;
    type: string;
    code: string;
    bgColor: string;
    textColor: string;
    content: string;
    linkList: LinkItem[];
    index: number;
    parentIndex: number | null;
    parentWidgetId: string;
}

interface WidgetOption {
    fontSize: number;
    isChanged: boolean;
    panelList: {
        name: string;
        code: string;
        bgColor: string;
        textColor: string;
    }[];
}

interface WidgetData {
    [key: string]: PannelData[];
}
