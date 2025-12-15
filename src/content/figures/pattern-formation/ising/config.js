export default {
    container: {
        class: "explorable flex flex-col items-start gap-4",
    },
    display: {
        width: 400,
        height: 400,
        class: "w-full border-1 border-black dark:border-white mb-0 h-auto"
    },
    controls: {
        width: 360,
        height: 360,
        class: "d3-widgets w-full mb-0 h-auto",
        grid: {x: 12,y: 12}
    },
    widgets: {
        slider_size: 270,
        slider_girth: 10,
        slider_knob: 12,
        slider_fontsize: 18,
        sliders: [
            {
                id: "adaptation_probability",
                label: "Adaptation Probability",
                range: [5,0],
                value: 0,
                position: {x: 2,y: 7}
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
        ],
        toggles: [
            {
                id: "average",
                label: "Smoothing",
                label_position: "right",
                value: true,
                position: {x: 5,y: 9}
            }
        ]

    }
}

