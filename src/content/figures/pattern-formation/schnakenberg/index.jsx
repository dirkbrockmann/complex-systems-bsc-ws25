/* Diffusion or particles in two dimensions */

import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {filter,each,map,meanBy,sumBy,shuffle,sortBy} from "lodash-es";
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';
import {square} from "lattices"
import {torusdist,grid,l2d,sigmoid} from "./utils"


const loadExplorable = (displayContainer,controlsContainer) => {

    const display = d3.select(displayContainer.current)
    const controls = d3.select(controlsContainer.current)

	const L = 300; // world size
	const N = 50;
    const dt = 0.01;
    const speed = 1.0;
    const minimal_scale = 0.1;

    const W = config.display.width;
    const H = config.display.height;

    const X = d3.scaleLinear().domain([-N,N]).range([0,W]);;
    const Y = d3.scaleLinear().domain([-N,N]).range([0,H]);;
    const C = d3.scaleLinear().range(["orange", "black"]).clamp(true);
	
	const ctx = display.node().getContext('2d');	
	ctx.clearRect(0, 0, W, H);

    const K = 4;
    const s = square(N).scale(2*N).hood("n4").boundary("dirichlets");
    var agents = s.nodes;
	
    var timer = {}
    
    var tick, agents;

    const g = widgets.grid(config.controls.width,config.controls.height,config.controls.grid.x,config.controls.grid.y);

        // controls.selectAll("*").data(g.points).enter().append("circle")
        // .attr("class","grid")
        // .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")"})
        // .attr("r",1)
        // .style("fill","black")
        // .style("stroke","none")

    const buttons = map(config.widgets.buttons,
        v => widgets.button()
            .id(v.id)
            .value(v.value)
            .size(v.size)
            .actions(v.actions)
            .position(g.position(v.position.x,v.position.y))
    );

    const sliders = map(config.widgets.sliders,
            v => widgets.slider()
                .id(v.id)
                .label(v.label)
                .range(v.range)
                .value(v.value)
                .fontsize(config.widgets.slider_fontsize)
                .labelpadding(0)
                .show(true)
                .size(config.widgets.slider_size)
                .girth(config.widgets.slider_girth)
                .knob(config.widgets.slider_knob)
                .position(g.position(v.position.x,v.position.y))
        );
    
    const ufix = (a,b)=>{
            return a + b;
    }
    
    const reset = () => {
        each(sliders,(slider,i)=>{
            slider.reset(controls,config.widgets.sliders[i].value);
        })
    }

    function iterate() {
        tick++;
        
	    ctx.clearRect(0, 0, W, H);
        
        let A = sliders[0].value();
        let B = sliders[1].value();
        let Du = sliders[2].value();  
        let Dv = sliders[3].value();
       
        each(agents,a=>{
            a.du = (A - a.u + a.u*a.u*a.v)  + 
				Du / K * ( -a.neighbors.length*a.u + sumBy(a.neighbors,x=>x.u));
            a.dv = (B - a.u*a.u*a.v)  + 
				Dv / K * ( -a.neighbors.length*a.v + sumBy(a.neighbors,x=>x.v));
        })
        
        each(agents,a=>{
            a.u += dt*a.du;
            a.v += dt*a.dv;
            if(a.u<0) a.u=0;
            if(a.v<0) a.v=0;
        })
        

        //console.log(tick,d3.min(agents,d=>d.u/ufix(A,B)-1),d3.max(agents,d=>d.u/ufix(A,B)-1));
        // HERE: 2% and 98% percentiles of u over all agents (lodash-based)
        // const uSorted = sortBy(agents, d => d.u).map(d => d.u);
        // const n = uSorted.length;
        // if (n > 0) {
        //   const i2 = Math.max(0, Math.min(n - 1, Math.floor(0.02 * (n - 1))));
        //   const i98 = Math.max(0, Math.min(n - 1, Math.floor(0.98 * (n - 1))));
        //   const p2 = uSorted[i2];
        //   const p98 = uSorted[i98];

        //   if (tick % 50 === 0) {
        //     console.log(p2,p98);
        //   }
        // }

        let minu = d3.min(agents,d=>d.u/ufix(A,B)-1) //< minimal_scale ? -minimal_scale : d3.min(agents,d=>d.u/ufix(A,B)-1);
        let maxu = d3.max(agents,d=>d.u/ufix(A,B)-1) //< minimal_scale ? minimal_scale : d3.max(agents,d=>d.u/ufix(A,B)-1);
        
        C.domain([minu,maxu])


	    agents.forEach(d=>{
		    const c = d.cell();
		    
		    const color = C(d.u/ufix(A,B)-1);
		    ctx.fillStyle=color;
		    ctx.strokeStyle=color;
		    ctx.lineWidth = 0;
		    ctx.fillRect(X(c[0].x),X(c[0].y),X(c[2].x)-X(c[0].x),X(c[2].y)-X(c[0].y))
	    })	
        
       
    }

    function update(){
         agents.forEach(d=>{
		    const c = d.cell(d.u/ufix(A,B)-1);
		    const color = C(d.u);
		
		    ctx.fillStyle=color;
		    ctx.strokeStyle=color;
		    ctx.lineWidth = 0;
		    ctx.fillRect(X(c[0].x),X(c[0].y),X(c[2].x)-X(c[0].x),X(c[2].y)-X(c[0].y))
	    })	
    }

    function setup() {
        
        tick = 0;

        let A = sliders[0].value();
        let B = sliders[1].value();
        let Du = sliders[2].value();  
        let Dv = sliders[3].value();

        each(agents,a=>{
		    a.u=sliders[0].value()+sliders[1].value() + 0.3*Math.random();
            a.v=sliders[1].value()/(sliders[0].value()+sliders[1].value())**2 + 0.01*Math.random();
	    })

        ctx.clearRect(0, 0, W, H);

        let minu = d3.min(agents,d=>d.u/ufix(A,B)-1) //< minimal_scale ? -minimal_scale : d3.min(agents,d=>d.u/ufix(A,B)-1);
        let maxu = d3.max(agents,d=>d.u/ufix(A,B)-1) //< minimal_scale ? minimal_scale : d3.max(agents,d=>d.u/ufix(A,B)-1);
        
        C.domain([minu,maxu])

        agents.forEach(d=>{
		    const c = d.cell();
		    
		    const color = C(d.u);
            ctx.fillStyle=color;
		    
		    ctx.lineWidth = 0;
		    ctx.fillRect(X(c[0].x),X(c[0].y),X(c[2].x)-X(c[0].x),X(c[2].y)-X(c[0].y))
	    })
        

        // display.selectAll("." + styles.agent).remove();
        // controls.selectAll("." + styles.plotline).remove();

        // display.selectAll("." + styles.agent).data(agents,d=>d.id).enter().append("circle")
        //     .attr("class",styles.agent)
        //     .attr("r",agentsize)
        //     .attr("transform",function(d) {return "translate(" + X(d.x) + "," + Y(d.y) + ")"})

 
    }

    function go(d) {buttons[0].value() == 1 ? timer = d3.timer(iterate,0) : timer.stop();}

    buttons[0].update(go)
    buttons[1].update(setup)
    buttons[2].update(reset)


    
    controls.selectAll(null).data(buttons).enter().append(widgets.widget);
    controls.selectAll(null).data(sliders).enter().append(widgets.widget);
   
    setup();
    iterate();
    
    return () => {
        controls.selectAll("*").remove(); // Remove all circles from the second SVG
        display.selectAll("*").remove(); // Remove all circles from the second SVG
    };
}

export default ({id}) => {
    const displayContainerRef = useRef(null); // Ref for the first div
    const controlsContainerRef = useRef(null); // Ref for the second div
    const ContainerRef = useRef(null); // Ref for the first div

    useEffect(() => {

        return loadExplorable(displayContainerRef,controlsContainerRef);


    },[id]); // Add `id` as a dependency to ensure it updates if the prop changes

    return (
        <>
                    <div
                        ref={ContainerRef}
                        id={id}
                        className={config.container.class}
                    >
                        <canvas
                            ref={displayContainerRef}
                            id={`${id}-display`}
                            className={config.display.class}
                            width={config.display.width}
                            height={config.display.height}
                        />
                        <svg
                            ref={controlsContainerRef}
                            id={`${id}-controls`}
                            className={config.controls.class}
                            
                            viewBox={`0 0 ${config.controls.width} ${config.controls.height}`}
                        />
                    </div>
                </>
    );
}