export default {
    container: {
        class: "flex flex-row ",
    },
    display: {
        width: 600,
        height: 400,
        class: "p-0 mb-0 w-1/2 h-auto ",
    },
    controls: {
        width: 600,
        height: 400,
        class: "d3-widgets p-0 mb-0 w-1/2 h-auto ",
        grid: {x: 12,y: 12}
    },
    widgets: {
        slider_size: 500,
        slider_girth: 10,
        slider_knob: 14,
        slider_fontsize: 18,
        sliders: [
            {
                id: "H",
                label: "H",
                range: [-.5,1],
                value: 0,
                position: {x: 1,y: 2},
                show: true
            },
            {
                id: "noise",
                label: "noise",
                range: [0,.3],
                value: .1,
                position: {x: 1,y: 11},
                show: false
            },
            {
                id: "yscale",
                label: "scale y-axis",
                range: [0,1],
                value: 1,
                position: {x: 1,y: 9.75},
                show: false
            },
        ],
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 5.5,y: 8},
                size: 120
            },
            {
                id: "setup",
                actions: ["rewind"],
                value: 0,
                position: {x: 7.5,y: 8},
                size: 60
            },
        ],
        toggles: [
            {
                id: "particles",
                label: "Show Noisy State",
                label_position: "right",
                value: false,
                position: {x: 1.5,y: 8}
            },
            {
                id: "ensemble",
                label: "Ensemble",
                label_position: "right",
                value: false,
                position: {x: 9,y: 8}
            }
        ]
    },
    bifurcation_plot: {
        margin: {l: 80,r: 30,t: 20,b: 60},
        xr: [-.5,1],
        yr: [0,1],
        xaxis: {
            label: "H",
            label_position: {x: .8,y: 0},
            label_offset: {x: 0,y: 45},
            fontsize: "16px"
        },
        yaxis: {
            label: "fixpoints",
            label_position: {x: 0,y: 0.5},
            label_offset: {x: -50,y: 30},
            fontsize: "16px"
        }
    },
    time_series_plot: {
        width: 480,
        height: 100,
        position: {x: 1.5,y: 6},
        margin: {l: 40,r: 30,t: 10,b: 30},
        xr: [0,25],
        yr: [0,1],
        xaxis: {
            label: "t",
            label_position: {x: 280,y: 190},
            fontsize: "13px"
        },
        yaxis: {
            label: "X(t)",
            label_position: {x: 175,y: 20},
            fontsize: "13px"
        }
    }
}
