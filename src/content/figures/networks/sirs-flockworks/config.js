export default {
    container: {
        class: "flex flex-row items-center explorable ",
    },
    display: {
        width: 360,
        height: 360,
        class: "gront w-1/2 mb-0 h-auto overflow-visible",
    },
    controls: {
        width: 360,
        height: 360,
        class: "d3-widgets p-0 mb-0 h-auto w-1/2",
        grid: {x: 12,y: 12}
    },
    widgets: {        
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 3,y: 3},
                size:80
            },
            {
                id: "reset",
                actions: ["rewind"],
                value: 0,
                position: {x: 6,y: 3},
                size:40
            },
            {
                id: "sirs_play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 3,y: 10},
                size:80
            },
            {
                id: "sirsreset",
                actions: ["rewind"],
                value: 0,
                position: {x: 6,y: 10},
                size:40
            },
        ],
        radios : [
            {
                id: "rewiring",
                choices: ["Random","Flockworks"],
                default: 0,
                position: {x:2,y:6.5},
                orientation: "horizontal",
                size:150
            }
        ]
    }
}
