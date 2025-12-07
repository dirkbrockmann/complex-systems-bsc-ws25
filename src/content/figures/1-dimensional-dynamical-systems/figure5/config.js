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
        width: 360,
        height: 180,
        margin: {l: 0,r: 0,t: 0,b: 30},
        position: {x: 6,y: 11},
        yrange: [0,500],
        xrange: [0,500],
        fontsize: "20px",
        xaxis: {
            label: "t",
            position: {x: 500,y: 0},
            offset: {x: 0,y: 40}
        },
        yaxis: {
            label: "I(t)",
            position: {x: 0,y: 500},
            offset: {x: -80,y: 0}
        }
    },
    widgets: {
        slider_size: 250,
        slider_girth: 10,
        slider_knob: 12,
        slider_fontsize: 18,
        sliders: [
            {
                id: "transmission_rate",
                label: "Transmission rate",
                range: [0,1],
                value: .75,
                position: {x: .5,y: 11}
            },
            {
                id: "recovery_rate",
                label: "Recovery rate",
                range: [0,0.1],
                value: 0.05,
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
