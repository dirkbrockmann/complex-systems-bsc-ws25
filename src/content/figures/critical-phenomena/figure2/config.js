export default {
    container: {
        class: "explorable flex flex-row",
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
                id: "birth_rate",
                label: "Birth Rate",
                range: [0,1],
                value: 0.5,
                position: {x: 2,y: 7}
            },
            {
                id: "death_rate",
                label: "Death Rate",
                range: [0,.3],
                value: 0.1,
                position: {x: 2,y: 9}
            }
        ],
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 3,y: 3},
                size: 120
            },
            {
                id: "setup",
                actions: ["back"],
                value: 0,
                position: {x: 9,y: 3},
                size: 60
            },
        ]

    }
}

