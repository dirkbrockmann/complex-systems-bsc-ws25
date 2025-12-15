/* Diffusion or particles in two dimensions */

import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {filter,each,map,meanBy,sumBy,shuffle,range,sample,max} from "lodash-es";
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';
import {square} from "lattices"
import colors from "./colors.js"


const loadExplorable = (displayContainer,controlsContainer) => {

    const display = d3.select(displayContainer.current)
    const controls = d3.select(controlsContainer.current)

	const L = 300; // world size
	const N = 100;
    const nofo = [2,3,4,5,10]

    const W = config.display.width;
    const H = config.display.height;

    const X = d3.scaleLinear().domain([-N,N]).range([0,W]);;
    const Y = d3.scaleLinear().domain([-N,N]).range([0,H]);;
    const C = d3.scaleOrdinal();
	
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

    const radios = map(config.widgets.radios,
        v => widgets.radio()
            .id(v.id)
            .choices(map(v.choices,a=>a.label))
            .value(v.default)
            .size(v.size)
            .shape(v.shape)
            .orientation(v.orientation)
            .position(g.position(v.position.x,v.position.y))
            .labelposition(v.label_position)
            .buttonsize(v.button_size)
    );



    const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []);

    function hist(a){
	    return range(nofo[radios[0].value()]).map(function(i){
		    return a.filter(function(x){ return i==x.state}).length
	    })
    }

    function iterate() {
        tick++;
        
	    ctx.clearRect(0, 0, W, H);
           
	    agents = shuffle(agents);
	 
	    if(radios[1].value()==1){
	        each(agents,d=>{
		        let n = d.neighbors;		
		        let county = hist(n)
		        let mv = max(county)
		
		        let mulch = indexOfAll(county,mv)
		        if (mulch.length>1) {			
			        d.state=sample(d.neighbors).state
		        } else {
			        d.state=mulch[0]
		        }
	    })
        } else {
	        agents.forEach(function(d){
	 	    d.state = sample(d.neighbors).state
	    })
    }	
	
    agents.forEach(d=>{
		    const c = d.cell();    
		    const color = C(d.state);
            ctx.fillStyle=color;
		    
		    ctx.lineWidth = 0;
		    ctx.fillRect(X(c[0].x),X(c[0].y),X(c[2].x)-X(c[0].x),X(c[2].y)-X(c[0].y))
	    })
    }

    function update(){
        each(agents,a=>{
		    a.state=sample(range(nofo[radios[0].value()]));
	    })
        C.domain([0,nofo[radios[0].value()]-1]).range(colors[nofo[radios[0].value()]]);
        console.log(colors[nofo[radios[0].value()]])
        console.log(C(0),C(1))
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
        C.domain([0,nofo[radios[0].value()]-1]).range(colors[nofo[radios[0].value()]]);
        console.log(colors[nofo[radios[0].value()]])
        each(agents,a=>{
		    a.state=sample(range(nofo[radios[0].value()+1]));
	    })
        
        ctx.clearRect(0, 0, W, H);

        agents.forEach(d=>{
		    const c = d.cell();    
		    const color = C(d.state);
            ctx.fillStyle=color;
		    
		    ctx.lineWidth = 0;
		    ctx.fillRect(X(c[0].x),X(c[0].y),X(c[2].x)-X(c[0].x),X(c[2].y)-X(c[0].y))
	    })
 
    }

    function go(d) {buttons[0].value() == 1 ? timer = d3.timer(iterate,0) : timer.stop();}

    buttons[0].update(go)
    buttons[1].update(setup)

    radios[0].update(update)
    radios[1].update(update)    
    
    controls.selectAll(null).data(buttons).enter().append(widgets.widget);
    controls.selectAll(null).data(radios).enter().append(widgets.widget);
   
    setup();
    
    
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