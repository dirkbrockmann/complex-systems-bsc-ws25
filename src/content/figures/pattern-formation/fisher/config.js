export default {
    container: {
        class: "explorable flex flex-row items-start gap-4",
    },
    display: {
        width: 400,
        height: 400,
        class: "w-1/2 border-1 border-black dark:border-white mb-0 h-auto"
    },
    controls: {
        width: 360,
        height: 360,
        class: "d3-widgets w-1/2 mb-0 h-auto",
        grid: {x: 12,y: 12}
    },
    widgets: {
        slider_size: 270,
        slider_girth: 10,
        slider_knob: 12,
        slider_fontsize: 18,
        sliders: [
            {
                id: "reproduction_rate",
                label: "Reproduction Rate",
                range: [0,10],
                value: 2.5,
                position: {x: 2,y: 7}
            },
            {
                id: "diffusion_coefficient",
                label: "Diffusion Coefficient",
                range: [0,1],
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

