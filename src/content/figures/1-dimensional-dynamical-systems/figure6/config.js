export default {
    container: {
        class: "flex flex-col ",
    },
    display: {
        width: 600,
        height: 300,
        class: " p-0  mb-0 w-full h-auto"
    },
    controls: {
        width: 600,
        height: 120,
        class: "d3-widgets p-0  mb-0 w-full h-auto ",
        grid: {x: 10,y: 6}
    },
    plot: {
        arrow_scale: 1,
        number_of_arrows: 10,
        fixpointradius: 8,
        margin: {l: 80,r: 20,t: 20,b: 20},
        xr: [0,1],
        yr: [-.5,1],
        xaxis: {
            label: "x",
            label_position: {x: 1,y: 0},
            label_offset: {x: 0,y: 40}
        },
        yaxis: {
            label: "f(x)",
            label_position: {x: 0,y: 1},
            label_offset: {x: -80,y: 0}
        }
    },
    widgets: {
        button: {
            id: "play_pause",
            actions: ["play","pause"],
            value: 0,
            position: {x: 2,y: 3}
        },
        slider_size: 480,
        slider_girth: 10,
        slider_knob: 12,
        slider_gap: 1,
        slider_fontsize: 14,
        sliders: [
            {
                id: "alpha",
                label: "\u03B1",
                range: [0,6],
                value: 0.5,
                position: {x: 1,y: 2},
                show: true
            },
            {
                id: "beta",
                label: "\u03B2",
                range: [0,3],
                value: 1.5,
                position: {x: 1,y: 5},
                show: true
            },
        ]
    },

}
