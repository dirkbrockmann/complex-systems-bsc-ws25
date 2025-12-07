export default {
    container: {
        class: "flex flex-row explorable",
    },
    display: {
        width: 600,
        height: 400,
        class: " p-0  mb-0 w-1/2 h-auto"
    },
    controls: {
        width: 400,
        height: 400/3*2,
        class: "d3-widgets p-0  mb-0 w-1/2 h-auto ",
        grid: {x: 10,y: 9}
    },
    plot: {
        arrow_scale: 0.5,
        number_of_arrows: 20,
        fixpointradius: 8,
        margin: {l: 100,r: 10,t: 10,b: 10},
        xr: [0,1.2],
        yr: [-0.1,0.3],
        xaxis: {
            label: "x",
            label_position: {x: 0.6,y: 0},
            label_offset: {x: 0,y: 30}
        },
        yaxis: {
            label: "f(x)",
            label_position: {x: 0,y: 0.2},
            label_offset: {x: -30,y: 0}
        }
    },
    widgets: {
        slider_size: 320,
        slider_girth: 10,
        slider_knob: 12,
        slider_gap: 1,
        slider_fontsize: 16,
        sliders: [
            {
                id: "alpha",
                label: "Basic reproduction (α)",
                range: [0,4],
                value: 2,
                position: {x: 1,y: 2},
                show: false
            },
            {
                id: "beta",
                label: "Natural death rate (β)",
                range: [0,1],
                value: 0.2,
                position: {x: 1,y: 4},
                show: false
            },
            {
                id: "H",
                label: "H",
                range: [-1,1],
                value: 0,
                position: {x: 1,y: 6},
                show: true
            }
        ]
    },

}
