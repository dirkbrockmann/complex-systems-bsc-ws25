/* Diffusion or particles in two dimensions */

import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {each,map,sample,filter,sampleSize} from "lodash-es";
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';


const loadExplorable = (displayContainer,controlsContainer) => {

    var nodes=[], links = [], node, link, simulation;
    const N = 300; // Number of particles
    const K = 2.5;
    var Q = 0.80;
	const L = 300;
    const charge = 30;
	const linklength = 10;
	const spring = 0.05;

    var R0 = 5;
	var beta = 0.05;
	var gamma = 0.01;
	var alpha = R0*beta;
    
    var timer = {}
    var timer2 = {}

    const X = d3.scaleLinear().domain([-L,L]).range([0,config.display.width]);
    const Y = d3.scaleLinear().domain([-L,L]).range([config.display.height,0]);
    
    
    const g = widgets.grid(config.controls.width,config.controls.height,config.controls.grid.x,config.controls.grid.y);
    const display = d3.select(displayContainer.current)
    const controls = d3.select(controlsContainer.current)

    const buttons = map(config.widgets.buttons,
        v => widgets.button()
            .id(v.id)
            .value(v.value)
            .actions(v.actions)
            .position(g.position(v.position.x,v.position.y))
            .size(v.size)
    );

    const radios = map(config.widgets.radios,
        v => widgets.radio()
            .id(v.id)
            .choices(v.choices)
            .value(v.default)
            .position(g.position(v.position.x,v.position.y))
            .orientation(v.orientation)
            .size(v.size)
    );


    simulation = d3.forceSimulation()
	    .force("link", d3.forceLink().id(function(d) { return d.id; }))
	    .force("charge", d3.forceManyBody().strength(-charge))
	    .force("center", d3.forceCenter(0, 0))
	    .force("gravityx",d3.forceX(0))
	    .force("gravityy",d3.forceY(0));
    
    simulation.force("link")
        .distance(linklength)
		.strength(spring)
    
    function iterate() {

        //console.log(links.length/(N-1))
        radios[0].value() == 0 ? relink_random() : relink_flockworks();
        simulation.alpha(1).restart();
        
    }

    function setup() {   
        
        // Create node objects with ids; return value must be the object (was previously undefined)
        nodes = d3.range(N).map(i => ({ id: i, state: "S", infected: 0 }));
        links = [];
	for (let i=0;i<N;i++) {
		for (let j=0;j<i;j++){
			if(Math.random() < 2*K / N) {
				links.push({"source":i,"target":j})
			};
		}
	}

    
    simulation.nodes(nodes).on("tick", ticked);
    simulation.force("link").links(links);
	simulation.alpha(1).restart();

    display.selectAll("*").remove();
    
    link = display.selectAll("."+styles.link).data(links)
		.enter().append("line")
		.attr("class", styles.link);
		
	node = display.selectAll("."+styles.node).data(nodes)
		.enter().append("circle")
	  	.attr("class", styles.node)
	  	.attr("r", 4)
        .classed(styles.infected, d=> d.state=="I")
        .classed(styles.susceptible, d=> d.state=="S")
        .classed(styles.recovered, d=> d.state=="R")	  	
    
        
    }

    function setup_sirs() {
        each(nodes,n=>{
            if (Math.random()<0.02){
                n.state="I"
            } else {
                n.state="S"
            }
        })
        node.classed(styles.infected, d=> d.state=="I")
            .classed(styles.susceptible, d=> d.state=="S")
            .classed(styles.recovered, d=> d.state=="R")
	  	
    }

    function iterate_sirs() {
        infect()
        recover()
        wane()
        node.classed(styles.infected, d=> d.state=="I")
            .classed(styles.susceptible, d=> d.state=="S")
            .classed(styles.recovered, d=> d.state=="R")	  	
    }

    function infect(){
	    const infected = filter(nodes,d=>{return d.state=="I"});

	    each(infected,n=>{
		
		    var reflinks = filter(links,d=>{return (d.source == n | d.target == n)});
		
		    each(reflinks,l=>{
			    if(Math.random()<alpha){
			        if(l.source == n){
			    	    if(l.target.state == "S") {l.target.state = "I"};
			        } else
			        {
			    	    if(l.source.state == "S")  {l.source.state = "I"};
			        }
		            }
		        })
	    })
    }

    function recover(){
        const infected = filter(nodes,d=>{return d.state=="I"});
        each(infected,n=>{
            if(Math.random()<beta){
                n.state="R"
            }
        })
    }

    function wane(){
        const recovered = filter(nodes,d=>{return d.state=="R"});
        each(recovered,n=>{
            if(Math.random()<gamma){
                n.state="S"
            }
        })
    }     


    function relink_random(){
        let no = sample(nodes);
        let no_links = filter(links,d=> (d.source==no | d.target==no) );
        each(no_links,l=>{
            l.source=no;
            l.target=sample(nodes);
        });
        rewire()
    }

    function relink_flockworks(){
	  
	    const [so,ta] = sampleSize(nodes,2); 

        // remove all potential links of a node
        links = filter(links,d=>{return (d.source == so | d.target == so) == false});
        
        // these are all the links of ta
        const ta_links = filter(links,d=>{return (d.source == ta | d.target == ta)});

        // link so and ta
        links.push({source: so, target: ta});
        
    	each(ta_links,l=>{
		    if (Math.random() < Q){
		        if(l.source == ta){
			        links.push({source: so, target: l.target})
		        } else {
                    // keep original neighbor of ta, but connect it to so instead
                    links.push({source: l.source, target: so})
		        }
	        }})
	rewire()
    
    }
  
    function rewire() {
        // Update link selection to match new links array
        let linkUpdate = link.data(links);
        const linkEnter = linkUpdate
            .enter()
            .insert("line","."+styles.node)
            .attr("class", styles.link);
        linkUpdate.exit().remove();
        // Merge so `link` always references all current link elements
        link = linkEnter.merge(linkUpdate);
        // Tell the force simulation about the new set of links
        simulation.force("link").links(links);	
    }

    function ticked() {
        link
            .attr("x1", function(d) { return X(d.source.x); })
            .attr("y1", function(d) { return Y(d.source.y); })
            .attr("x2", function(d) { return X(d.target.x); })
            .attr("y2", function(d) { return Y(d.target.y); });

        node
		    .attr("transform",function(d) { return "translate("+X(d.x)+","+Y(d.y)+")"})
    }


    function go(d) {buttons[0].value() == 1 ? timer = d3.timer(iterate,0) : timer.stop();}
    
    function go_sirs(d) {
        if (buttons[2].value() == 1) {
            setup_sirs();
            timer2 = d3.timer(iterate_sirs, 0);
        } else {
            timer2.stop();
        }
    };

    buttons[0].update(go)
    buttons[1].update(setup)
    buttons[2].update(go_sirs)
    buttons[3].update(setup_sirs)

    controls.selectAll(null).data(buttons).enter().append(widgets.widget);
    controls.selectAll(null).data(radios).enter().append(widgets.widget);   
    
    setup();

    
    
    // controls.selectAll("*").data(g.points).enter().append("circle")
    //     .attr("class","grid")
    //     .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")"})
    //     .attr("r",1)
    //     .style("fill","black")
    //     .style("stroke","none")

    return () => {
        controls.selectAll("*").remove(); 
        display.selectAll("*").remove(); 
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