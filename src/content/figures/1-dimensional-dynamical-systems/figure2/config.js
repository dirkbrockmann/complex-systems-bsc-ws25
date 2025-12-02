export default {
    container: {
        class: "flex flex-col explorable ",
    },
    display: {
        width: 800,
        height: 400,
        class: "p-0  mb-0 w-full h-auto  border-1 border-black dark:border-white",
    },
    controls: {
        width: 800,
        height: 240,
        class: "d3-widgets p-0  mb-0 w-full h-auto  ",
        grid: {x: 12,y: 12}
    },
    plot: {
        width: 400,
        height: 180,
        margin: {l: 0,r: 0,t: 0,b: 0},
        position: {x: 5.5,y: 10.5},
        fontsize: "20px",
        xaxis: {
            label: "t",
            position: {x: 400,y: -10}
        },
        yaxis: {
            label: "N(t)",
            position: {x: 10,y: -320}
        },
        yrange: [0,300],
    },
    widgets: {
        slider_size: 250,
        slider_girth: 10,
        slider_knob: 12,
        slider_fontsize: 18,
        sliders: [
            {
                id: "annihilation_rate",
                label: "Annihilation rate",
                range: [0.1,1],
                value: .2,
                position: {x: .5,y: 11}
            },
            {
                id: "reproduction_rate",
                label: "Reproduction rate",
                range: [0,0.005],
                value: 0.004,
                position: {x: .5,y: 7.5}
            },
        ],
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 1,y: 3}
            },
            {
                id: "reset",
                actions: ["rewind"],
                value: 0,
                position: {x: 4,y: 3}
            },
            {
                id: "setup",
                actions: ["back"],
                value: 0,
                position: {x: 2,y: 3}
            },
        ],

    }
}
