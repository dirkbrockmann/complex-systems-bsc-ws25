/* Diffusion or particles in two dimensions */

import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {each,map,range} from "lodash-es";
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';


const loadExplorable = (displayContainer,controlsContainer) => {


    const N = 2000; // Number of particles
	const L = 300; // world size
	const dt = 1;
	const speed = 3;
    const agentsize = 2;
	
    var timer = {}

    const g2r = d3.scaleLinear().domain([0,360]).range([0,2*Math.PI]);
    const r2g = d3.scaleLinear().range([0,360]).domain([0,2*Math.PI]);

    const X = d3.scaleLinear().domain([0,L]).range([0,config.display.width]);

    const Y = d3.scaleLinear().domain([0,L]).range([config.display.height,0]);
    
    var tick, agents;

    const g = widgets.grid(config.controls.width,config.controls.height,config.controls.grid.x,config.controls.grid.y);
    const display = d3.select(displayContainer.current)
    const controls = d3.select(controlsContainer.current)

    const buttons = map(config.widgets.buttons,
        v => widgets.button()
            .id(v.id)
            .value(v.value)
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

        agents.forEach(function(d){
		    let phi = g2r(Math.random()*360);
		    let dx =  dt * sliders[0].value() * Math.cos(phi);
		    let dy =  dt * sliders[0].value() * Math.sin(phi);
		    let x_new= (d.x + dx);
		    let y_new= (d.y + dy);
		
		// this takes care of the boundaries
		
		    if (x_new < 0 || x_new > L) dx *= -1;
		    if (y_new < 0 || y_new > L) dy *= -1;

		    d.x= (d.x + dx)
		    d.y= (d.y + dy)
		    d.theta = r2g(Math.atan2(dy,dx))
	})

        
    display.selectAll("." + styles.agent).data(agents)
        .attr("transform",function(d) {return "translate(" + X(d.x) + "," + Y(d.y) + ")"})   
    }

    function setup() {
        
        tick = 0;

        agents = map(range(N),i => ({  
            id: i, 
            x: Math.random() * L, 
			y: Math.random() * L,
			theta : Math.random()*360,
        }));

        display.selectAll("." + styles.agent).remove();

        display.selectAll("." + styles.agent).data(agents,d=>d.id).enter().append("circle")
            .attr("class",styles.agent)
            .attr("r",agentsize)
            .attr("transform",function(d) {return "translate(" + X(d.x) + "," + Y(d.y) + ")"})

        }

    function go(d) {buttons[0].value() == 1 ? timer = d3.timer(iterate,0) : timer.stop();}

    buttons[0].update(go)
    buttons[1].update(setup)

    controls.selectAll(null).data(buttons).enter().append(widgets.widget);
    controls.selectAll(null).data(sliders).enter().append(widgets.widget);

    setup();
    
    
    // controls.selectAll("*").data(g.points).enter().append("circle")
    //     .attr("class","grid")
    //     .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")"})
    //     .attr("r",1)
    //     .style("fill","black")
    //     .style("stroke","none")

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
                        <svg
                            ref={displayContainerRef}
                            id={`${id}-display`}
                            className={config.display.class}
                            width={config.display.width}
                            height={config.display.height}
                            viewBox={`0 0 ${config.display.width} ${config.display.height}`}
                        />
                        <svg
                            ref={controlsContainerRef}
                            id={`${id}-controls`}
                            className={config.controls.class}
                            width={config.controls.width}
                            height={config.controls.height}
                            viewBox={`0 0 ${config.controls.width} ${config.controls.height}`}
                        />
                    </div>
                </>
    );
}