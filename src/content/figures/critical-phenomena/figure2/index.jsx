/* Diffusion or particles in two dimensions */

import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {filter,each,map,meanBy,sumBy,shuffle} from "lodash-es";
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';
import {square} from "lattices"
import {torusdist,grid,l2d,sigmoid} from "./utils"


const loadExplorable = (displayContainer,controlsContainer) => {

    const display = d3.select(displayContainer.current)
    const controls = d3.select(controlsContainer.current)

	const L = 300; // world size
	const N = 100;

    const W = config.display.width;
    const H = config.display.height;

    const X = d3.scaleLinear().domain([-N,N]).range([0,W]);;
    const Y = d3.scaleLinear().domain([-N,N]).range([0,H]);;
    const C = d3.scaleOrdinal().domain(["G", "A","D"]).range(["white", "blue","gray"])
	
	const ctx = display.node().getContext('2d');	
	ctx.clearRect(0, 0, W, H);

    const s = square(N).scale(2*N);
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
                .size(config.widgets.slider_size)
                .girth(config.widgets.slider_girth)
                .knob(config.widgets.slider_knob)
                .position(g.position(v.position.x,v.position.y))
        );

    function iterate() {
        tick++;
        
	    ctx.clearRect(0, 0, W, H);
        
        let animals = filter(agents,a=>{
            return a.state=="A";
        })
        
        let birth_rate = sliders[0].value();
        let death_rate = sliders[1].value();  
        animals = shuffle(animals);
        
	    each(animals,a=>{
            if(Math.random()<death_rate){
                a.state="D"
            } else {
                let empty_neighbors = a.neighbors.filter(n=>n.state=="G");
                if(empty_neighbors.length>0 && Math.random()<birth_rate){
                    let n = empty_neighbors[Math.floor(Math.random()*empty_neighbors.length)];
                    n.state="A"
                }
            }
        })
		
        
	    agents.forEach(d=>{
		    const c = d.cell();
		    
		    const color = C(d.state);
		    ctx.fillStyle=color;
		    ctx.strokeStyle=color;
		    ctx.lineWidth = 0;
		    ctx.fillRect(X(c[0].x),X(c[0].y),X(c[2].x)-X(c[0].x),X(c[2].y)-X(c[0].y))
	    })	
        
       
    }

    function update(){
         agents.forEach(d=>{
		    const c = d.cell();
		    const color = C(d.state);
		
		    ctx.fillStyle=color;
		    ctx.strokeStyle=color;
		    ctx.lineWidth = 0;
		    ctx.fillRect(X(c[0].x),X(c[0].y),X(c[2].x)-X(c[0].x),X(c[2].y)-X(c[0].y))
	    })	
    }

    function setup() {
        
        tick = 0;

        each(agents,a=>{
		    a.state="G";
	    })

        const animals = filter(agents,a=>{
            return a.x*a.x+a.y*a.y<10;
        })

        each(animals,a=>{
		    a.state="A";
	    })

        ctx.clearRect(0, 0, W, H);

        agents.forEach(d=>{
		    const c = d.cell();
		    
		    const color = C(d.state);
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
    
    controls.selectAll(null).data(buttons).enter().append(widgets.widget);
    controls.selectAll(null).data(sliders).enter().append(widgets.widget);
   
    setup();
    
    console.log(agents)
    
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