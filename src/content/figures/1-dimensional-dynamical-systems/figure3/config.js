export default {
    container: {
        class: "flex flex-col ",
    },
    display: {
        width: 400,
        height: 300,
        class: " p-0  mb-0 w-full h-auto"
    },
    controls: {
        width: 400,
        height: 120,
        class: "d3-widgets p-0  mb-0 w-full h-auto ",
        grid: {x: 10,y: 6}
    },
    plot: {
        arrow_scale: 1,
        number_of_arrows: 10,
        fixpointradius: 8,
        margin: {l: 40,r: 10,t: 10,b: 10},
        xr: [0,4],
        yr: [-1,2],
        xaxis: {
            label: "n",
            label_position: {x: 280,y: 190}
        },
        yaxis: {
            label: "f(n)",
            label_position: {x: 175,y: 20}
        }
    },
    widgets: {
        button: {
            id: "play_pause",
            actions: ["play","pause"],
            value: 0,
            position: {x: 2,y: 3}
        },
        slider_size: 320,
        slider_girth: 10,
        slider_knob: 12,
        slider_gap: 1,
        slider_fontsize: 20,
        sliders: [
            {
                id: "alpha",
                label: "\u03B1",
                range: [0.25,2],
                value: 0.25,
                position: {x: 1,y: 2},
                show: true
            },
            {
                id: "beta",
                label: "\u03B2",
                range: [0,1],
                value: 0.5,
                position: {x: 1,y: 5},
                show: true
            },
        ]
    },

}
