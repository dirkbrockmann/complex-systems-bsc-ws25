export default {
    container: {
        class: "flex flex-col items-center explorable ",
    },
    display: {
        width: 600,
        height: 600,
        class: "gront w-[50%] mb-0 h-auto border-1 border-black dark:border-white",
    },
    plot: {
        width: 600,
        height: 600,
        class: "mb-0 w-[50%] h-auto",
        margin: {l: 150,r: 30,t: 20,b: 80},
        fontsize: "20px",
        xaxis: {
            label: "t",
            position: {x: 550,y: 580}
        },
        yaxis: {
            label: "N(t)",
            position: {x: 30,y: 30}
        }
    },
    controls: {
        width: 200,
        height: 100,
        class: "d3-widgets p-0 mb-0 h-auto",
        grid: {x: 6,y: 6}
    },
    widgets: {
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
                position: {x: 5,y: 3}
            },
        ]
    }
}
