export default {
    container: {
        class: "flex flex-row items-center explorable ",
    },
    display: {
        width: 360,
        height: 360,
        class: "gront w-1/2 mb-0 h-auto border-1 border-black dark:border-white",
    },
    controls: {
        width: 360,
        height: 360,
        class: "d3-widgets p-0 mb-0 h-auto w-1/2",
        grid: {x: 12,y: 12}
    },
    widgets: {
        slider_size: 300,
        slider_girth: 10,
        slider_knob: 12,
        slider_fontsize: 18,
        sliders: [
            {
                id: "speed",
                label: "Speed",
                range: [0,3],
                value: 1,
                position: {x: 1,y: 8}
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
