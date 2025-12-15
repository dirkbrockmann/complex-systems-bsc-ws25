export default {
    container: {
        class: "explorable  flex flex-row",
    },
    display: {
        width: 400,
        height: 400,
        class: "border-1 p-0 mb-0 h-auto w-1/2"
    },
    controls: {
        width: 360,
        height: 360,
        class: "d3-widgets p-0 mb-0 w-1/2",
        grid: {x: 12,y: 12}
    },
    widgets: {
        slider_size: 270,
        slider_girth: 10,
        slider_knob: 12,
        slider_fontsize: 18,
        sliders: [
            {
                id: "speed",
                label: "Throttle",
                range: [0,200],
                value: 0,
                position: {x: 2,y: 9}
            },
            {
                id: "initial_radius",
                label: "Initial Radius",
                range: [0,100],
                value: 50,
                position: {x: 2,y: 11}
            }
        ],
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 3,y: 2.5},
                size: 100
            },
            {
                id: "setup",
                actions: ["back"],
                value: 0,
                position: {x: 3,y: 6},
                size: 60
            },
        ]

    }
}

