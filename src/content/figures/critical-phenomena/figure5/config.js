export default {
    container: {
        class: "flex flex-row ",
    },
    display: {
        width: 400,
        height: 300,
        class: "p-0  mb-0 w-1/2 h-auto ",
    },
    controls: {
        width: 400,
        height: 170,
        class: "d3-widgets p-0  mb-0 w-1/2 h-auto ",
        grid: {x: 12,y: 12}
    },
    widgets: {
        slider_size: 320,
        slider_girth: 10,
        slider_knob: 12,
        slider_fontsize: 18,
        sliders: [
            {
                id: "sigma",
                label: "noise strength",
                range: [0,1],
                value: 0,
                position: {x: 1,y: 2.5}
            },
            {
                id: "k",
                label: "force strength",
                range: [0,3],
                value: 1,
                position: {x: 1,y: 6}
            },
        ],
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 4,y: 9.5}
            },
            {
                id: "reset",
                actions: ["rewind"],
                value: 0,
                position: {x: 8,y: 9.5}
            },
        ]
    },
    plot: {
        margin: {l: 40,r: 30,t: 10,b: 30},
        xr: [0,10],
        yr: [-5,5],
        xaxis: {
            label: "t",
            label_position: {x: 280,y: 190},
            fontsize: "16px"
        },
        yaxis: {
            label: "X(t)",
            label_position: {x: 175,y: 20},
            fontsize: "16px"
        }
    }
}
