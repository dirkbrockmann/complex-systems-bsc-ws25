/* Diffusion or particles in two dimensions */

import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {filter,each,map,meanBy,sumBy,shuffle} from "lodash-es";
import {useEffect,useRef} from 'react';
import config from './config.js';
import dolphins from './dolphins.js';
import styles from './styles.module.css';




const loadExplorable = (displayContainer,controlsContainer) => {

    
    const display = d3.select(displayContainer.current)

    const W = config.display.width;
    const H = config.display.height;
    
    const X = d3.scaleLinear().domain([-100,100]).range([0,W]);;
    const Y = d3.scaleLinear().domain([-100,100]).range([0,H]);;
    
    const g = dolphins.graph;  
    const nodes = dolphins.nodes;
    const links = dolphins.links;  
	const N = g.N;
  	const L = g.L;

    var link, node;
        let simulation;
    
    const charge = 20;
	const linklength = 10;
	const spring = 0.2;
	const damping = 0.023;
	const ss = 1;
	const lw = 1;
	const  scale = 10;
    const ss_range = [2,8];
    const linewidth = 1.0;
    const color = d3.interpolatePurples;
    const sSize = d3.scaleLinear().range(ss_range);
	const cs	= d3.scaleLinear().range([0,1]);
	

    function setup() {

        sSize.domain(d3.extent(nodes,function(d){return d["degree centrality"]}))
		cs.domain(d3.extent(nodes,function(d){return d["betweenness centrality"]}))
		  

        simulation = d3.forceSimulation()
	        .force("link", d3.forceLink().id(function(d) { return d.id; }))
	        .force("charge", d3.forceManyBody().strength(-charge))
	        .force("center", d3.forceCenter(0, 0))
	        .force("gravityx",d3.forceX(0))
	        .force("gravityy",d3.forceY(0));
        
        simulation.force("link")
            .distance(linklength)
			.strength(spring)
        	
        const origin = display.append("g")
            //.attr("transform","translate("+X(-50)+","+Y(-50)+")");
        
        link = origin
		    .selectAll("."+styles.link)
		    .data(links)
		    .enter().append("line")
            .attr("class",styles.link)
	
				  
		node = origin.selectAll("."+styles.node)
		  	.data(nodes).enter()
		  	.append("g")
		  	.attr("class", styles.node)
              .call(d3.drag()
            .subject((event, d) => ({ x: X(d.x), y: Y(d.y) }))
          	.on("start", dragstarted)
          	.on("drag", dragged)
          	.on("end", dragended));
        
        node.append("circle").attr("class",styles.nodecircle)		
		      .attr("r", d=> sSize(d["degree centrality"]) )
		  	  .style("fill",d => color( cs(d["betweenness centrality"]) ))
        
        node.append("text").attr("class",styles.label)
			.text(d=>d.id)
			.style("font-size",d=>2*sSize(d["degree centrality"]))


        simulation.nodes(nodes).on("tick", ticked);
        simulation.force("link").links(links);
		simulation.alpha(1).restart();

    }

   
    setup();
    
    function ticked() {
        link
            .attr("x1", function(d) { return X(d.source.x); })
            .attr("y1", function(d) { return Y(d.source.y); })
            .attr("x2", function(d) { return X(d.target.x); })
            .attr("y2", function(d) { return Y(d.target.y); });

        node
		    .attr("transform",function(d) { return "translate("+X(d.x)+","+Y(d.y)+")"})
    }

    function dragstarted(event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = X.invert(event.x);
          d.fy = Y.invert(event.y);
        }

        function dragged(event, d) {
          d.fx = X.invert(event.x);
          d.fy = Y.invert(event.y);
        }

        function dragended(event, d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
    
    return () => {
        display.selectAll("*").remove(); // Remove all circles from the second SVG
    };
}

export default ({id}) => {
    const displayContainerRef = useRef(null); // Ref for the first div
    const ContainerRef = useRef(null); // Ref for the first div

    useEffect(() => {

        return loadExplorable(displayContainerRef);


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
                    </div>
                </>
    );
}