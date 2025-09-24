import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {each,map,range} from 'lodash-es';
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';


const loadExplorable = (displayContainer,controlsContainer) => {

    const display = d3.select(displayContainer);
    const controls = d3.select(controlsContainer);
    
    const g = widgets.grid(config.controls.width,config.controls.height,config.controls.grid.x,config.controls.grid.y);
    
    const xr = config.plot.yr;
    const yr = config.plot.yr;
    const X = d3.scaleLinear().domain(xr).range([config.plot.margin.l,config.display.width - config.plot.margin.r]);
    const Y = d3.scaleLinear().domain(yr).range([config.display.height - config.plot.margin.b,config.plot.margin.t]);
    const xAxis = d3.axisBottom(X);
    const yAxis = d3.axisLeft(Y);
    const line = d3.line().x(d => X(d.x)).y(d => Y(d.y));

    // controls.selectAll("*").data(g.points).enter().append("circle")
    //     .attr("class","grid")
    //     .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")"})
    //     .attr("r",1)
    //     .style("fill","black")
    //     .style("stroke","none")

    const sliders = map(config.widgets.sliders,
        v => widgets.slider()
            .id(v.id)
            .label(v.label)
            .range(v.range)
            .value(v.value)
            .fontsize(config.widgets.slider_fontsize)
            .size(config.widgets.slider_size)
            .girth(config.widgets.slider_girth)
            .knob(config.widgets.slider_knob)
            .show(v.show)
            .position(g.position(v.position.x,v.position.y))
    );

    const toggles = map(config.widgets.toggles,
        v => widgets.toggle()
            .id(v.id)
            .label(v.label)
            .value(v.value)
            .labelposition(config.widgets.toggle_label_position)
            .fontsize(config.widgets.toggle_fontsize)
            .size(config.widgets.toggle_size)
            .position(g.position(v.position.x,v.position.y))
    );

    controls.selectAll(null).data(sliders).enter().append(widgets.widget);
    controls.selectAll(null).data(toggles).enter().append(widgets.widget);

    const cleanup = () => {
        display.selectAll("*").remove();
        controls.selectAll("*").remove();
    } 

    const K = config.plot.K;
    const N = config.plot.N;
    const x0_0 = sliders[1];
    const x0_1 = sliders[2];
    const lambda = sliders[0];
    const attractor = toggles[0];
    const transient = toggles[1];
    
        
    // compute the trace of the logistic map
    
    const f = (x,r) => { return r*x*(1-x);};
	
	const trace = (x0,N,r) => {
		let xarr=[{x:x0,y:0}];
		let i=0;
		while(i++<N){
			let x1 = r*x0*(1-x0);
			xarr.push({x:x0,y:x1});
			xarr.push({x:x1,y:x1});
			x0=x1;
		}
		return {transient:xarr.slice(0,K-1), attractor:xarr.slice(K,xarr.length)};
	}
		
	var data0 = trace(x0_0.value(),N,lambda.value());
	var data1 = trace(x0_1.value(),N,lambda.value());

    const x = range(0,1.01,0.01);
	var fofx = map(x,d=>({x:d,y:f(d,lambda.value())}));
	var diag = map(x,d=>({x:d,y:d}));

    const update = () => {
        data0 = trace(x0_0.value(),N,lambda.value());
	    data1 = trace(x0_1.value(),N,lambda.value());
        fofx = map(x,d=>({x:d,y:f(d,lambda.value())}));
	    diag = map(x,d=>({x:d,y:d}));

        display.select("."+styles.curve).datum(fofx).attr("d",line)
        display.select("."+styles.diag).datum(diag).attr("d",line)
        display.select("."+styles.trace1+"."+styles.transient)
            .datum(data0.transient).attr("d",line)
            .style("opacity", transient.value() ? null : 0 )
        display.select("."+styles.trace2+"."+styles.transient)
            .datum(data1.transient).attr("d",line)
            .style("opacity", transient.value() ? null : 0 )
        display.select("."+styles.trace1+"."+styles.attractor)
            .datum(data0.attractor).attr("d",line)
            .style("opacity", attractor.value() ? null : 0 )
        display.select("."+styles.trace2+"."+styles.attractor)
            .datum(data1.attractor).attr("d",line)
            .style("opacity", attractor.value() ? null : 0 )
        // display.selectAll("."+styles.curve).datum(points).attr("d",curve);
        // display.selectAll("."+styles.dots)
        //     .data(points)
		// 	.attr("transform",function(d){return "translate("+X(d.x)+","+Y(d.y)+")"})
    }

    each(sliders,s => s.update(update));
    each(toggles,s => s.update(update));

    display.append("g").call(xAxis)
        .attr("class",styles.xaxis)
        .attr("transform","translate(" + 0 + "," + Y(0) + ")");

    display.append("g").call(yAxis)
        .attr("class",styles.yaxis)
        .attr("transform","translate(" + X(0) + "," + 0 + ")");

    display.append("text").text(config.plot.xaxis.label)
        .attr("class",styles.axis_label)
        .attr("transform","translate(" + (X(N/2) + config.plot.xaxis.label_position.x) + "," + (Y(0) + config.plot.xaxis.label_position.y) + ")")
    
    display.append("text").text(config.plot.yaxis.label)
        .attr("class",styles.axis_label)
        .attr("transform","translate(" + (X(0) + config.plot.yaxis.label_position.x) + "," + (Y(0.5) + config.plot.yaxis.label_position.y) + ")")

    display.append("path").datum(fofx)
        .attr("class",styles.curve).attr("id","f")
		.attr("d",line)

    display.append("path").datum(diag)
        .attr("class",styles.diag).attr("id","x")
		.attr("d",line)
		
    display.append("path").datum(data0.transient).attr("d",line)
        .attr("class",styles.transient + " " + styles.trace1)        
        .style("opacity", transient.value() ? null : 0 )
    
    display.append("path").datum(data1.transient).attr("d",line)
        .attr("class",styles.transient + " " + styles.trace2)        
        .style("opacity", transient.value() ? null : 0 )
    
    display.append("path").datum(data0.attractor).attr("d",line)
        .attr("class",styles.attractor + " " + styles.trace1)        
        .style("opacity", attractor.value() ? null : 0 )

    display.append("path").datum(data1.attractor).attr("d",line)
        .attr("class",styles.attractor + " " + styles.trace2)        
        .style("opacity", attractor.value() ? null : 0 )



    return cleanup;
}
export default ({id}) => {
    const ContainerRef = useRef(null); // Ref for the first div
    const displayContainerRef = useRef(null); // Ref for the first div
    const controlsContainerRef = useRef(null); // Ref for the second div

    useEffect(() => {

        return loadExplorable(displayContainerRef.current,controlsContainerRef.current);

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