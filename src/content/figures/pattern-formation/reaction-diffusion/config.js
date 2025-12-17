export default {
    container: {
        // make the container take full row width and lay out children horizontally
        class: "flex flex-row w-full items-center explorable",
    },
    display: {
        width: 720,
        height: 360,
        // flex basis 2/3, prevent shrinking below it
        class: "basis-2/3 shrink-0 mb-0 border-1 border-black dark:border-white",
    },
    controls: {
        width: 360,
        height: 360,
        // flex basis 1/3, prevent shrinking below it
        class: "d3-widgets p-0 mb-0 basis-1/3 shrink-0",
        grid: {x: 12,y: 12}
    },
    widgets: {
        slider_size: 300,
        slider_girth: 10,
        slider_knob: 12,
        slider_fontsize: 18,
        sliders: [
            {
                id: "speed_a",
                label: "Speed A",
                range: [0,3],
                value: 1,
                position: {x: 1,y: 8}
            },
            {
                id: "speed_b",
                label: "Speed B",
                range: [0,3],
                value: 1,
                position: {x: 1,y: 10}
            }
        ],
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 3,y: 3}
            },
            {
                id: "reset",
                actions: ["rewind"],
                value: 0,
                position: {x: 8,y: 3}
            },
        ]
    }
}
