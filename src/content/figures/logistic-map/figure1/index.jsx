import katex from "katex";
//import "katex/dist/katex.min.css";
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

    const N = 16;
    const fo = d3.format(".3f");
    const f = (x,r) => { return r*x*(1-x);}
		
	const logistic = (x0,r,N) => {
		let i = 0;
		let x = [x0];
		for(i=0;i<N;i++){ x[i+1]=f(x[i],r)}
		return x;
	}

    const x0 = sliders[1];
    const lambda = sliders[0];
		
	var data = logistic(x0.value(),lambda.value(),N);
    console.log(data);
    
  
	display.selectAll("."+styles.series).data(data).enter()
        .append("span")
        .attr("class",styles.series)
        .each(function(d, i) {
            let prefix = i == 0 ? "x_n=\\," : "";
            const mathStr =  prefix + fo(d) + (i < N-1 ? ",~" : "~");
            this.innerHTML = katex.renderToString(mathStr);
        });

    const update = () => {
			data=logistic(x0.value(),lambda.value(),N)
			display.selectAll("."+styles.series).data(data)
			.each(function(d, i) {
                let prefix = i == 0 ? "x_n=\\," : "";
                const mathStr = prefix + fo(d) + (i < N-1 ? ",~" : "~");
                this.innerHTML = katex.renderToString(mathStr);
            });
        }
    
    each(sliders,s => s.update(update));

    // controls.selectAll("*").data(g.points).enter().append("circle")
    //     .attr("class","grid")
    //     .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")"})
    //     .attr("r",1)
    //     .style("fill","black")
    //     .style("stroke","none")

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
                <span
                    ref={displayContainerRef}
                    id={`${id}-display`}
                    className={config.display.class}
                    //width={config.display.width}
                    //height={config.display.height}
                    //viewBox={`0 0 ${config.display.width} ${config.display.height}`}
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