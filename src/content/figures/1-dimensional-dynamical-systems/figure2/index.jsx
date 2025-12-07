/* Diffusion or particles in two dimensions */

import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {each,map,range} from "lodash-es";
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';


const loadExplorable = (displayContainer,controlsContainer) => {


    const N = 10; // Number of particles
	const L = 300; // world size
    const Tmax = 500;
	const dt = 1;
	const R_coll = 2;;
	const speed = 1;
    const agentsize = 5;
	
    var timer = {}

    const g2r = d3.scaleLinear().domain([0,360]).range([0,2*Math.PI]);
    const r2g = d3.scaleLinear().range([0,360]).domain([0,2*Math.PI]);

    const X = d3.scaleLinear().domain([0,L]).range([0,config.display.width]);
    const Y = d3.scaleLinear().domain([0,L]).range([config.display.height,0]);

    const T = d3.scaleLinear()
        .domain([0,Tmax])
        .range([config.plot.margin.l,config.plot.width - config.plot.margin.r]);

    const R = d3.scaleLinear()
        .domain(config.plot.yrange)
        .range([config.plot.height - config.plot.margin.b,config.plot.margin.t]);
        //.range([0,config.plot.height]);


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
        let pairs = [];

        T.domain([tick>Tmax?tick-Tmax:0,tick>Tmax?tick:Tmax])
        

        controls.select("." + styles.xaxis).call(tAxis)
        

	// collisions and competition only among agents that aren't eggs

	    each(agents,a=>{
		    let colliders = [];
		    colliders = agents.filter(function(d){
			    let dx = (a.x-d.x);
			    let dy = (a.y-d.y);
			    return ( Math.sqrt(dx*dx + dy*dy)  < R_coll ) && ( d.id != a.id ) 
		    })
		    each(colliders,b=>{ pairs.push({"a":a,"b":b});})
	    })

        each(pairs,p=>{
			if(Math.random()<sliders[0].value()){
				if(p.a.parent!=p.b && p.b.parent!=p.a){
					p.a.state="dead"
					p.b.state="dead"
				}				
			}
        })

        each(agents,d=>{
		if(Math.random()<sliders[1].value()){
			let ra = Math.random()*90;
			d.theta=d.theta-ra;
			var child = {id:d3.max(agents,x=>x.id)+1,				
				x : d.x,
				y : d.y,
				theta : d.theta+ra,
				parent: d
			}
			agents.push(child);	
		    }
	    })
        
        agents = agents.filter(function(d){return d.state!="dead"});
	
	    const gront = display.selectAll("." + styles.agent).data(agents,d=>d.id);
        gront.exit().remove();	
		gront.enter().append("circle")
            .attr("class",styles.agent)
            .attr("r",agentsize)
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
		    d.theta = r2g(Math.atan2(dy,dx))
	})

        count.push({t: tick,r: agents.length});

        if (count.length > Tmax) {
             count.shift(); // remove earliest element
        }
        display.selectAll("." + styles.agent).data(agents)
            .attr("transform",function(d) {return "translate(" + X(d.x) + "," + Y(d.y) + ")"})

        controls.select("." + styles.plotline).datum(count).attr("d",pcurve)

       
    }

    function setup() {
        
        tick = 0;

        agents = map(range(N),i => ({  
            id: i, 
            x: Math.random() * L, 
			y: Math.random() * L,
			theta : Math.random()*360,
            parent: null
        }));
        
        count = [{t: tick,r: agents.length}];

        display.selectAll("." + styles.agent).remove();
        controls.selectAll("." + styles.plotline).remove();

        display.selectAll("." + styles.agent).data(agents,d=>d.id).enter().append("circle")
            .attr("class",styles.agent)
            .attr("r",agentsize)
            .attr("transform",function(d) {return "translate(" + X(d.x) + "," + Y(d.y) + ")"})

        controls.append("path").datum(count).attr("d",pcurve)
            .attr("class",styles.plotline)
            .attr("transform","translate(" + axpos.x + "," + (axpos.y -config.plot.height) + ")")

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

    setup();
    
    // axes
    

    
    controls.append("g")
         .attr("transform","translate(" + axpos.x + "," + axpos.y + ")")
         .attr("class",styles.xaxis)
         .call(tAxis)
        
    controls.append("g")
        .attr("transform","translate(" + axpos.x + "," + +(axpos.y -config.plot.height) + "  )")
        .attr("class",styles.yaxis)
        .call(rAxis)
        

    // axes labels

    controls.append("text").text(config.plot.xaxis.label).attr("class",styles.axis_label)
        .attr("transform","translate(" + (axpos.x+config.plot.xaxis.position.x)+ "," + (axpos.y+config.plot.xaxis.position.y) + ")")

    controls.append("text").text(config.plot.yaxis.label).attr("class",styles.axis_label)
        .attr("transform","translate(" + (axpos.x+config.plot.yaxis.position.x) + "," + (axpos.x+config.plot.yaxis.position.y) + ")")
        




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