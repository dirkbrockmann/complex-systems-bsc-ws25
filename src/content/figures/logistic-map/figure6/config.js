export default {
    container: {
        // fill the available text width but keep a fixed aspect ratio (600:400 -> 3/2)
        // uses Tailwind arbitrary aspect utility so the container scales responsively
        class: "block relative w-full aspect-[2/1]",
    },
    canvas: {
        width: 900,
        height: 450,
        class: " absolute inset-0 w-full h-full"
    },
    svg: {
        width: 900,
        height: 450,
        class: " absolute inset-0 w-full h-full pointer-events-none"
    },
    plot: {
        margin: {l: 0,r: 0,t: 0,b: 0},
        xr: [5,40],
        yr: [0,16],
        xaxis: {
            label: "lambda",
            label_position: {x: 0,y: 35}
        },
        yaxis: {
            label: "fixpoints",
            label_position: {x: -50,y: 0}
        },
        dotsize: 0.35,
        N_transient:1000,
		N : 2000,
        N_lambda: 1000,
        alpha:0.3,
        zoomalpha:0.8,
        zoomdepth:5,
        zoomwindowsize: {x:0.1,y:0.2}
    }
}
