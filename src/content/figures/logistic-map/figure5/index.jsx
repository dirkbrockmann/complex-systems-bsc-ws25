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
    
    const N = config.plot.N_sequences;
    
    const xr = [0,N];
    const yr = config.plot.yr;
    const X = d3.scaleLinear().domain(xr).range([config.plot.margin.l,config.display.width - config.plot.margin.r]);
    const Y = d3.scaleLinear().domain(yr).range([config.display.height - config.plot.margin.b,config.plot.margin.t]);
    const xAxis = d3.axisBottom(X);
    const yAxis = d3.axisLeft(Y);
    const curve = d3.line().x(d => X(d.x)).y(d => Y(d.y));


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

    controls.selectAll(null).data(sliders).enter().append(widgets.widget);

    const cleanup = () => {
        display.selectAll("*").remove();
        controls.selectAll("*").remove();
    } 


    const f = (x,r) => { return r*x*(1-x);}
		
	const logistic = (x0,r,N) => {
		let i = 0;
		let x = [x0];
		for(i=0;i<N;i++){ x[i+1]=f(x[i],r)}
		return x;
	}

    const x0 = sliders[2];
    const lambda = sliders[0];
    const epsilon = sliders[1];

    let bubba = controls.select("#slider_epsilon")
    
	var data1 = logistic(x0.value(),lambda.value(),N);
    var data2 = logistic(x0.value()+Math.pow(10,epsilon.value()),lambda.value(),N);

    var points1 = map(data1,(d,i) => { return {x: i, y: d}});
    var points2 = map(data2,(d,i) => { return {x: i, y: d}});

    const update = () => {
        data1 = logistic(x0.value(),lambda.value(),N);
        points1 = map(data1,(d,i) => { return {x: i, y: d}});
        data2 = logistic(x0.value()+Math.pow(10,epsilon.value()),lambda.value(),N);

        points2 = map(data2,(d,i) => { return {x: i, y: d}});

        display.selectAll("."+styles.curve1).datum(points1).attr("d",curve);
        display.selectAll("."+styles.dots1)
            .data(points1)
			.attr("transform",function(d){return "translate("+X(d.x)+","+Y(d.y)+")"})
        display.selectAll("."+styles.curve2).datum(points2).attr("d",curve);
        display.selectAll("."+styles.dots2)
            .data(points2)
			.attr("transform",function(d){return "translate("+X(d.x)+","+Y(d.y)+")"})
    }

    each(sliders,s => s.update(update));


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

    
    display.append("path").datum(points1).attr("d",curve)
						.attr("class",styles.curve1)
	display.selectAll(".dots").data(points1).enter().append("circle")
				.attr("r",config.plot.dotsize).attr("class",styles.dots1)
						.attr("transform",function(d){return "translate("+X(d.x)+","+Y(d.y)+")"})

    display.append("path").datum(points2).attr("d",curve)
						.attr("class",styles.curve2)
	display.selectAll(".dots").data(points2).enter().append("circle")
				.attr("r",config.plot.dotsize).attr("class",styles.dots2)
						.attr("transform",function(d){return "translate("+X(d.x)+","+Y(d.y)+")"})

   


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