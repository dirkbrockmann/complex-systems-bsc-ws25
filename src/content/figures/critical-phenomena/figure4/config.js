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
        margin: {l: 40,r: 10,t: 10,b: 10},
        xr: [-1,1],
        yr: [-1,1],
        xaxis: {
            label: "x",
            label_position: {x: 280,y: 190}
        },
        yaxis: {
            label: "f(x)",
            label_position: {x: 175,y: 20}
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
                label: "α",
                range: [0,1],
                value: 0.5,
                position: {x: 1,y: 2},
                show: true
            }
        ]
    },

}
