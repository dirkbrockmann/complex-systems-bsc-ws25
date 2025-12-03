export default {
    container: {
        class: "flex flex-col explorable ",
    },
    display: {
        width: 400,
        height: 400,
        class: "p-0  mb-0 w-full h-auto  border-1 border-black dark:border-white",
    },
    controls: {
        width: 400,
        height: 400,
        class: "d3-widgets p-0  mb-0 w-full h-auto  ",
        grid: {x: 12,y: 12}
    },
    plot: {
        width: 320,
        height: 110,
        margin: {l: 0,r: 0,t: 0,b: 0},
        position: {x: 1.5,y: 4.5},
        fontsize: "12px",
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
        slider_size: 360,
        slider_girth: 10,
        slider_knob: 12,
        slider_fontsize: 18,
        sliders: [
            {
                id: "death_rate",
                label: "Death rate",
                range: [1e-3,0.01],
                value: 0.005,
                position: {x: .5,y: 11}
            },
            {
                id: "spontaneous_birth",
                label: "Spontaneous birth rate",
                range: [0,0.5],
                value: 0.25,
                position: {x: .5,y: 9}
            },
        ],
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 3,y: 6.5}
            },
            {
                id: "reset",
                actions: ["rewind"],
                value: 0,
                position: {x: 5,y: 6.5}
            },
            {
                id: "setup",
                actions: ["back"],
                value: 0,
                position: {x: 8,y: 6.5}
            },
        ],

    }
}
