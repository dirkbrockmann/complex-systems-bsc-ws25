export default {
    container: {
        class: "flex flex-col ",
    },
    display: {
        class: "p-0 mb-2 w-full h-auto"
    },
    controls: {
        width: 300*0.8,
        height: 150*0.8,
        class: "d3-widgets p-0 mb-0 w-full h-auto",
        grid: {x: 12,y: 6},
        button: {
            id: "play_pause",
            actions: ["play","pause"],
            value: 0,
            position: {x: 6,y: 3}
        }
    },
    widgets: {
        slider_size: 240*0.8,
        slider_girth: 8,
        slider_knob: 9,
        slider_gap: 1,
        slider_fontsize: 14,
        sliders: [
            {
                id: "lambda",
                label: "\u03BB",
                range: [0,4],
                value: 1.2,
                position: {x: 1,y: 2},
                show: true
            },
            {
                id: "x0",
                label: 'x\u2080',
                range: [0,1],
                value: 0.023,
                position: {x: 1,y: 5},
                show: true
            },
        ]
    },
}
