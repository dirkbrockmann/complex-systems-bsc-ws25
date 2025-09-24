export default {
    container: {
        class: "flex flex-col ",
    },
    display: {
        width: 600,
        height: 200,
        class: " p-0 mb-0 w-full h-auto"
    },
    controls: {
        width: 600,
        height: 100,
        class: "d3-widgets p-0  mb-0 w-full h-auto",
        grid: {x: 12,y: 6}
    },
    plot: {
        margin: {l: 60,r: 20,t: 20,b: 50},
        yr: [0,1],
        xaxis: {
            label: "n",
            label_position: {x: 0,y: 35}
        },
        yaxis: {
            label: "x\u2099",
            label_position: {x: -50,y: 0}
        },
        dotsize: 2,
        N_sequences: 80,
    },
    widgets: {
        slider_size: 500,
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
