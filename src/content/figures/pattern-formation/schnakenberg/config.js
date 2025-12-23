export default {
    container: {
        class: "explorable flex flex-row items-start gap-4",
    },
    display: {
        width: 505,
        height: 505,
        class: "w-1/2 border-1 border-black dark:border-white mb-0 h-auto"
    },
    controls: {
        width: 360,
        height: 360,
        class: "d3-widgets w-1/2 mb-0 h-auto",
        grid: {x: 12,y: 12}
    },
    widgets: {
        slider_size: 300,
        slider_girth: 10,
        slider_knob: 12,
        slider_fontsize: 14,
        sliders: [
            {
                id: "input_activator",
                label: "Activator Influx (a)",
                range: [0,1],
                value: 0.1,
                position: {x: 1,y: 5}
            },
            {
                id: "input_inhibitor",
                label: "Inhibitor Influx (b)",
                range: [0,2],
                value: 0.9,
                position: {x: 1,y: 7}
            },
            {
                id: "diff_u",
                label: "Diffusion Activator",
                range: [1,3],
                value: 2,
                position: {x: 1,y: 9}
            },
            {
                id: "diff_v",
                label: "Diffusion Inhibitor",
                range: [0,60],
                value: 40,
                position: {x: 1,y: 11},
                show:true
            }

        ],
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 3,y: 2},
                size: 80
            },
            {
                id: "setup",
                actions: ["back"],
                value: 0,
                position: {x: 6,y: 2},
                size: 60
            },
            {
                id: "reste",
                actions: ["rewind"],
                value: 0,
                position: {x: 9,y: 2},
                size: 60
            },
        ]

    }
}

