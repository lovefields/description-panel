// This is a counter widget with buttons to increment and decrement the number.

const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Text, Rectangle, Input } = widget;

function Widget() {
    const [id, setId] = useSyncedState("id", 1);
    const [text, setText] = useSyncedState("text", "");

    return (
        <AutoLayout name="page info" verticalAlignItems={"center"} spacing={8} padding={16} cornerRadius={8} fill={"#FFFFFF"} stroke={"#E6E6E6"}>
            <AutoLayout onClick={()=>{
                console.log(figma);
            }} name="id" width={20} height={20} horizontalAlignItems={"center"} verticalAlignItems={"center"} padding={2} cornerRadius={50}>
                <Text fontSize={16} horizontalAlignText={"center"}>
                    {id}
                </Text>
            </AutoLayout>
            <Input
                value={text}
                placeholder="info"
                onTextEditEnd={(e) => {
                    setText(e.characters);
                }}
                fontSize={16}
                fill="#333"
                width={400}
                inputFrameProps={{
                    fill: "#f1f1f1",
                    stroke: "#ccc",
                    cornerRadius: 5,
                    padding: 10,
                }}
                inputBehavior="wrap"
            />
        </AutoLayout>
    );
}

widget.register(Widget);
