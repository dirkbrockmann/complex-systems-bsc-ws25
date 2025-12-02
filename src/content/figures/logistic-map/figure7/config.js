export default {
    container: {
        // fill the available text width but keep a fixed aspect ratio (600:400 -> 3/2)
        // uses Tailwind arbitrary aspect utility so the container scales responsively
        class: "block relative w-full aspect-[2/1]",
    },
    canvas: {
        width: 900,
        height: 450,
        class: " absolute inset-0 w-full h-full explorable"
    },
    svg: {
        width: 900,
        height: 450,
        class: " absolute inset-0 w-full h-full pointer-events-none"
    },
    plot: {
        margin: {l: 0,r: 0,t: 0,b: 0},
        xr: [0,1],
        yr: [-1,1],
        xaxis: {
            label: "\u03BB",
            label_position: {x: 0,y: 45}
        },
        yaxis: {
            label: "fixpoints",
            label_position: {x: -50,y: 0}
        },
        dotsize: 0.35,
        N_transient:5000,
		N : 10000,
        N_lambda: 2000,
        alpha:0.3,
        zoomalpha:0.8,
        zoomdepth:5,
        zoomwindowsize: {x:0.1,y:0.2}
    }
}
