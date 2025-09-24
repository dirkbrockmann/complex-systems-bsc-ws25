export default {
    container: {
        class: "flex flex-col ",
    },
    display: {
        width: 600,
        height: 500,
        class: " p-0 mb-0 w-full h-auto "
    },
    controls: {
        width: 600,
        height: 175,
        class: "d3-widgets p-0  mb-0 w-full h-auto ",
        grid: {x: 12,y: 12}
    },
    plot: {
        margin: {l: 60,r: 20,t: 20,b: 50},
        xr: [0,1],
        yr: [0,1],
        xaxis: {
            label: "f(x\u2099)",
            label_position: {x: 0,y: 35}
        },
        yaxis: {
            label: "x\u2099",
            label_position: {x: -50,y: 0}
        },
        dotsize: 2,
        N_sequences: 80,
        K: 100,
        N: 200,
    },
    widgets: {
        slider_size: 350,
        slider_girth: 8,
        slider_knob: 10,
        slider_fontsize: 16,
        sliders: [
            {
                id: "lambda",
                label: "\u03BB",
                range: [0,4],
                value: 2.2,
                position: {x: 1,y: 3},
                show: true
            },
            {
                id: "x01",
                label: 'x\u2080',
                range: [0,1],
                value: 0.023,
                position: {x: 1,y: 7},
                show: true
            },
            {
                id: "x02",
                label: 'x\u2080',
                range: [0,1],
                value: 0.025,
                position: {x: 1,y: 11},
                show: true
            },
        ],
        toggle_label_pos:"right",
        toggle_size:10,
        toggle_fontsize: 16,
        toggle_label_position:"right",
        toggles: [
            {
                id: "attractor",
                label: "attractor",
                value: true,
                position: {x: 9.5,y: 3}
            },
            {
                id: "transient",
                label: 'transient',
                value: true,
                position: {x: 9.5,y: 7}
            }
        ],
        
    },

}
