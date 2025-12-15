export default {
    container: {
        class: "explorable flex flex-row",
    },
    display: {
        width: 400,
        height: 400,
        class: "border-1 p-0 mb-0 h-auto w-1/2"
    },
    controls: {
        width: 360,
        height: 360,
        class: "d3-widgets p-0 mb-0 w-1/2",
        grid: {x: 12,y: 12}
    },
    widgets: {
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 3,y: 3},
                size: 100
            },
            {
                id: "setup",
                actions: ["back"],
                value: 0,
                position: {x: 9,y: 3},
                size: 60
            },
        ],
        radios:[
            {
                id: "species",
                label: "Species",
                position: {x: 1,y: 7},
		        size:300,
                button_size:30,
		        orientation:"horizontal",
		        label_position:"top",
		        shape:"square",
                choices:[
				    {label:"2",species:2},
				    {label:"3",species:3},
				    {label:"4",species:4},
				    {label:"5",species:5},
				    {label:"10",species:10},
			    ],
			    default:0
            },
            {
                id: "model",
                label: "Model",
                position: {x: 3,y: 10},
		        size:150,
                button_size:40,
		        orientation:"horizontal",
		        label_position:"right",
		        shape:"circle",
                choices:[
				    {label:"Voter"},
				    {label:"Majority"}
			    ],
			    default:0
            }

        ]
    }
}

