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
        height: 300,
        class: "d3-widgets p-0  mb-0 w-full h-auto ",
        grid: {x: 10,y: 9}
    },
    plot: {
        arrow_scale: 0.5,
        number_of_arrows: 20,
        fixpointradius: 8,
        margin: {l: 40,r: 10,t: 10,b: 10},
        xr: [-5,5],
        yr: [-3,3],
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
        slider_size: 480,
        slider_girth: 10,
        slider_knob: 12,
        slider_gap: 1,
        slider_fontsize: 16,
        sliders: [
            {
                id: "a",
                label: "a",
                range: [0,2],
                value: 0,
                position: {x: 1,y: 2},
                show: true
            },
            {
                id: "b",
                label: "b",
                range: [-1,1],
                value: -1,
                position: {x: 1,y: 4},
                show: true
            },
            {
                id: "c",
                label: "c",
                range: [-1,1],
                value: 0,
                position: {x: 1,y: 6},
                show: true
            },
            {
                id: "d",
                label: "d",
                range: [-1,1],
                value: 0.75,
                position: {x: 1,y: 8},
                show: true
            },
        ]
    },

}
