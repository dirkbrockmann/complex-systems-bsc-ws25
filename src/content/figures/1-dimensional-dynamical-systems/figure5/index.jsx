/* Diffusion or particles in two dimensions */

import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {each,map,range,filter} from "lodash-es";
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';


const loadExplorable = (displayContainer,controlsContainer) => {


    const N = 500; // Number of particles
    const initially_infected = 10;
	const L = 300; // world size
    const Tmax = config.plot.xrange[1]; // max time
	const dt = 1;
	const R_coll = 3;;
	const speed = 1;
    const agentsize = 5;
	
    var timer = {}

    const g2r = d3.scaleLinear().domain([0,360]).range([0,2*Math.PI]);
    const r2g = d3.scaleLinear().range([0,360]).domain([0,2*Math.PI]);

    const X = d3.scaleLinear().domain([0,L]).range([0,config.display.width]);
    const Y = d3.scaleLinear().domain([0,L]).range([config.display.height,0]);

    const T = d3.scaleLinear()
        .domain([0,Tmax])
        .range([0,config.plot.width - config.plot.margin.r-config.plot.margin.l]);

    const R = d3.scaleLinear()
        .domain(config.plot.yrange)
        .range([0,-config.plot.height + config.plot.margin.b+config.plot.margin.t]);


    const tAxis = d3.axisBottom(T);
    const rAxis = d3.axisLeft(R);
    
    const pcurve = d3.line().x(d => T(d.t)).y(d => R(d.r));

    var tick, agents, count;

    const g = widgets.grid(config.controls.width,config.controls.height,config.controls.grid.x,config.controls.grid.y);
    const display = d3.select(displayContainer.current)
    const controls = d3.select(controlsContainer.current)

    const axpos = g.position(config.plot.position.x,config.plot.position.y);

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

        T.domain([tick>Tmax?tick-Tmax:0,tick>Tmax?tick:Tmax])       
        controls.select("." + styles.xaxis).call(tAxis)
        

	// collisions and competition only among agents that aren't eggs
        const infected = agents.filter(a=>a.state=="I");
        const susceptible = agents.filter(a=>a.state=="S");

	    each(infected,a=>{
		    let neighbors = filter(susceptible,nn=>{
			    let dx = (a.x-nn.x);
			    let dy = (a.y-nn.y);
			    return ( Math.sqrt(dx*dx + dy*dy)  < R_coll ) && ( nn.id != a.id ) 
		    })
		    each(neighbors,b=>{ 
                if(Math.random()<sliders[0].value()){
                    b.state="I"
                }
            })            
	    })

        each(infected,d=>{
            if(Math.random()<sliders[1].value()){
                d.state="S"		    
            }})

	    display.selectAll("." + styles.agent).data(agents)
            .classed(styles.infected,d=>d.state=="I")
            .classed(styles.susceptible,d=>d.state=="S")
            .attr("transform",function(d) {return "translate(" + X(d.x) + "," + Y(d.y) + ")"})

        agents.forEach(function(d){
		    let phi = g2r(d.theta);
		    let dx =  dt * speed * Math.cos(phi);
		    let dy =  dt * speed * Math.sin(phi);
		    let x_new= (d.x + dx);
		    let y_new= (d.y + dy);
		
		// this takes care of the boundaries
		
		    if (x_new < 0 || x_new > L) dx *= -1;
		    if (y_new < 0 || y_new > L) dy *= -1;

		    d.x= (d.x + dx)
		    d.y= (d.y + dy)
		    
            d.theta = r2g(Math.atan2(dy,dx))+Math.random()*60-30
	    })

        count.push({t: tick,r: infected.length});

        if (count.length > Tmax) {
             count.shift(); // remove earliest element
        }
 
        controls.select("." + styles.plotline).datum(count).attr("d",pcurve)

       
    }

    function setup() {
        
        tick = 0;

        agents = map(range(N),i => ({  
            id: i, 
            x: Math.random() * L, 
			y: Math.random() * L,
			theta : Math.random()*360,
            state: i < initially_infected ? "I" : "S"
        }));
        
        const infected = filter(agents,a=>a.state=="I");
        
        count = [{t: tick,r: infected.length}];

        display.selectAll("." + styles.agent).remove();
        controls.selectAll("." + styles.plotline).remove();

        display.selectAll("." + styles.agent).data(agents).enter().append("circle")
            .attr("class",styles.agent)
            .attr("r",agentsize)
            .classed(styles.infected,d=>d.state=="I")
            .classed(styles.susceptible,d=>d.state=="S")

            .attr("transform",function(d) {return "translate(" + X(d.x) + "," + Y(d.y) + ")"})

        plot.append("path").datum(count).attr("d",pcurve)
            .attr("class",styles.plotline)
            

    }

    function reset() {
        each(sliders,(s,i)=>s.reset(controls,config.widgets.sliders[i].value));
    }

    function go(d) {buttons[0].value() == 1 ? timer = d3.timer(iterate,0) : timer.stop();}

    buttons[0].update(go)
    buttons[1].update(reset)
    buttons[2].update(setup)
    

    controls.selectAll(null).data(buttons).enter().append(widgets.widget);
    controls.selectAll(null).data(sliders).enter().append(widgets.widget);

    const plot = controls.append("g")
         .attr("transform","translate(" + (axpos.x + config.plot.margin.l) + "," + (axpos.y - config.plot.margin.b) + ")")
    
    plot.append("g").attr("class",styles.xaxis).call(tAxis)        
    plot.append("g").attr("class",styles.yaxis).call(rAxis)
        
    // axes labels

    plot.append("text").text(config.plot.xaxis.label).attr("class",styles.axis_label)
        .attr("transform","translate(" + (T(config.plot.xaxis.position.x) + config.plot.xaxis.offset.x) + "," + (R(config.plot.xaxis.position.y) + config.plot.xaxis.offset.y) + ")")

    plot.append("text").text(config.plot.yaxis.label).attr("class",styles.axis_label)
        .attr("transform","translate(" + (T(config.plot.yaxis.position.x) + config.plot.yaxis.offset.x) + "," + (R(config.plot.yaxis.position.y) + config.plot.yaxis.offset.y) + ")")

        

    setup();



    return () => {
        controls.selectAll("*").remove(); // Remove all circles from the second SVG
        display.selectAll("*").remove(); // Remove all circles from the second SVG
        plot.selectAll("*").remove(); // Remove all circles from the second SVG
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