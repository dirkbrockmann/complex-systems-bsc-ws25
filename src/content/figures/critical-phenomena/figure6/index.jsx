// Ornstein-Uhlenbeck process


import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {each,last,map,range} from 'lodash-es';
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';
import branches from './branches.js';


// label on axis
// vertical dashed line for chosen control parameter
//
// simulation play stop rewind
//
// single ball for the current state in left panel
//

const loadExplorable = (displayContainer,controlsContainer) => {

    var agents = [];
    var ticks = 0;
    var timer = {};

    const dw = d3.randomNormal(0,1);
    const dt = 0.05; // Time step
    const N = 40;
    const dx = 0.01;
    const beta = 1.0;

    const df = (x,alpha,beta,sigma,dt) => dt*alpha*x*(1-x) - dt*beta*x + Math.sqrt(sigma*dt)*x*(1-x)*dw();

    const xr = config.bifurcation_plot.xr;
    const yr = config.bifurcation_plot.yr;

    const X = d3.scaleLinear().domain(xr).range([config.bifurcation_plot.margin.l,config.display.width - config.bifurcation_plot.margin.r]);
    const Y = d3.scaleLinear().domain(yr).range([config.display.height - config.bifurcation_plot.margin.b,config.bifurcation_plot.margin.t]);
    const xAxis = d3.axisBottom(X);
    const yAxis = d3.axisLeft(Y);
    const curve = d3.line().x(d => X(d.x)).y(d => Y(d.y));

    const xr_ts = config.time_series_plot.xr;
    const yr_ts = config.time_series_plot.yr;

    const X_ts = d3.scaleLinear().domain(xr_ts).range([0,config.time_series_plot.width]);
    const Y_ts = d3.scaleLinear().domain(yr_ts).range([config.time_series_plot.height,0]).clamp(true);
    const xAxis_ts = d3.axisBottom(X_ts);
    const yAxis_ts = d3.axisLeft(Y_ts);
    const curve_ts = d3.line().x(d => X_ts(d.t)).y(d => Y_ts(d.X));

    // choose how big your visible time window is
    const windowSize = xr_ts[1] - xr_ts[0];

    var timer = {};

    const g = widgets.grid(config.controls.width,config.controls.height,config.controls.grid.x,config.controls.grid.y);
    const display = d3.select(displayContainer)
    const controls = d3.select(controlsContainer)

    const iterate = () => { 
        ticks++;
        each(agents,a => {
            let t = last(a.trajectory).t;
            let alpha = sliders[0].value();
            let sigma = sliders[1].value();
            a.trajectory.push({t: t + dt,X: last(a.trajectory).X + df(last(a.trajectory).X,alpha,beta,sigma,dt)});
        });

        
        const currentT = last(agents[0].trajectory).t; // assume all agents share same time
        let [tMin, tMax] = X_ts.domain();
        if (currentT > tMax) {
            // shift window so that currentT is at the right edge
            tMax = currentT;
            tMin = tMax - windowSize;
            X_ts.domain([tMin, tMax]);
            plot.select("#xaxis_ts").call(xAxis_ts);
        }
        
        plot.selectAll("." + styles.agent).data(agents)
            .attr("d",d => curve_ts(d.trajectory))
            .style("opacity",d =>d.id == 0 || toggles[1].value() ? null : 0 );
        
        if(ticks*dt>config.time_series_plot.xr[1]) {
            each(agents,a => { a.trajectory.shift()})
        } 
        
        display.select("."+styles.dot)
            .attr("cx",X(sliders[0].value()))
            .attr("cy",Y(last(agents[0].trajectory).X))
            .style("opacity",toggles[0].value() ? 1 : 0);;

            
    }
    
    const reset = () => { 
        ticks = 0
        agents = map(range(N),(d,i) => ({id: i,trajectory: [{t: 0,X: Math.random()}]}))
        agents[0].trajectory[0].X = 0.5;

        plot.selectAll("." + styles.agent).remove();
        display.selectAll("." + styles.dot).remove();
        
        plot.selectAll("." + styles.agent).data(agents).enter().append("path")
            .attr("d",d => curve_ts(d.trajectory))
            .attr("class",styles.agent)
            .classed(styles.singular,d => d.id == 0)
            .attr("transform", "translate("+0+","+(-Y_ts(0))+")")
            .style("opacity",d =>d.id == 0 || toggles[1].value() ? null : 0 );
        
        display.append("circle")
            .attr("class", styles.dot)
            .attr("r", 10)
            .attr("cx",X(sliders[0].value()))
            .attr("cy",Y(last(agents[0].trajectory).X))
            .style("opacity",toggles[0].value() ? 1 : 0);;
        
        X_ts.domain(xr_ts)
        Y_ts.domain(yr_ts)
    
    }

    const show_dynamics = () => {
        let show = toggles[0].value();
        controls.selectAll("."+styles.timeseries).style("opacity",show ? 1 : 0);
        controls.select("#button_play_pause").style("opacity",show ? 1 : 0);
        controls.select("#button_setup").style("opacity",show ? 1 : 0);
        controls.select("#toggle_ensemble").style("opacity",show ? 1 : 0);
        controls.select("#slider_noise").style("opacity",show ? 1 : 0);
        controls.select("#slider_yscale").style("opacity",show ? 1 : 0);
        controls.select("#button_play_pause").selectAll("*").style("pointer-events",show ? null : "none");
        controls.select("#button_setup").selectAll("*").style("pointer-events",show ? null : "none");
        controls.select("#toggle_ensemble").selectAll("*").style("pointer-events",show ? null : "none");
        controls.select("#slider_noise").selectAll("*").style("pointer-events",show ? null : "none");
        controls.select("#slider_yscale").selectAll("*").style("pointer-events",show ? null : "none");
        display.select("."+styles.dot).style("opacity",show ? 1 : 0);;
    }

    const update =() => { 
        verticalline
            .attr("x1",X(sliders[0].value()))
            .attr("x2",X(sliders[0].value()));
        
        Y_ts.domain([0,sliders[2].value()]);
        plot.select("#yaxis_ts").call(yAxis_ts)
        
        display.select("."+styles.dot)
            .attr("cx",X(sliders[0].value()))
            .attr("cy",Y(last(agents[0].trajectory).X));
     
    }

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
            .show(v.show)
            .size(config.widgets.slider_size)
            .girth(config.widgets.slider_girth)
            .knob(config.widgets.slider_knob)
            .position(g.position(v.position.x,v.position.y))
    );

    const toggles = map(config.widgets.toggles,
            v => widgets.toggle()
                .id(v.id)
                .value(v.value)
                .label(v.label)
                .labelposition(v.label_position)
                .position(g.position(v.position.x,v.position.y))
    );
    
    function go(d) {buttons[0].value() == 1 ? timer = d3.timer(iterate,0) : timer.stop();}

    buttons[0].update(go);
    buttons[1].update(reset);
    toggles[0].update(show_dynamics);
    sliders[0].update(update);
    sliders[2].update(update);

    controls.selectAll(null).data(buttons).enter().append(widgets.widget)        
    controls.selectAll(null).data(sliders).enter().append(widgets.widget);
    controls.selectAll(null).data(toggles).enter().append(widgets.widget);

    display.append("g").datum(config.bifurcation_plot.xaxis).attr("class",styles.xaxis)
        .attr("transform",function(d) {return "translate(0," + Y(0) + ")"})
        .call(xAxis)
        .style("font-size",config.bifurcation_plot.xaxis.fontsize);

    display.append("g").datum(config.bifurcation_plot.yaxis).attr("class",styles.yaxis)
        .attr("transform",function(d) {return "translate(" + X(0) + ",0)"})
        .call(yAxis)
        .style("font-size",config.bifurcation_plot.yaxis.fontsize);
    
    display.append("text").text(config.bifurcation_plot.xaxis.label)
        .attr("class",styles.axis_label)
        .attr("transform","translate(" + (X(config.bifurcation_plot.xaxis.label_position.x)+config.bifurcation_plot.xaxis.label_offset.x) + "," + (Y(config.bifurcation_plot.xaxis.label_position.y)+config.bifurcation_plot.xaxis.label_offset.y) + ")")

    display.append("text").text(config.bifurcation_plot.yaxis.label).attr("class",styles.axis_label)
        .attr("transform","translate(" + (X(config.bifurcation_plot.yaxis.label_position.x)+config.bifurcation_plot.yaxis.label_offset.x) + "," + (Y(config.bifurcation_plot.yaxis.label_position.y)+config.bifurcation_plot.yaxis.label_offset.y) + ")rotate(-90) ")
    
    const verticalline = display.append("line")
        .attr("x1",X(sliders[0].value()))
        .attr("y1",Y(yr[0]))
        .attr("x2",X(sliders[0].value()))
        .attr("y2",Y(yr[1]))
        .attr("stroke","black").attr("stroke-dasharray","4 4").attr("stroke-width",1);
    

    const plotpos = g.position(config.time_series_plot.position.x,config.time_series_plot.position.y);
    const plot = controls.append("g")
        .attr("class",styles.timeseries)
        .attr("transform", "translate("+plotpos.x+","+plotpos.y+")");

    plot.append("g").datum(config.time_series_plot.xaxis)
        .attr("id", "xaxis_ts")
        .attr("class",styles.axis)
        .call(xAxis_ts)
        .style("font-size",config.time_series_plot.xaxis.fontsize)
        
    plot.append("g").datum(config.time_series_plot.yaxis)
        .attr("class",styles.axis)
        .attr("id", "yaxis_ts")
        .attr("transform", "translate("+0+","+(-Y_ts(0))+")")
        .call(yAxis_ts)
        .style("font-size",config.time_series_plot.yaxis.fontsize)    
    
        // controls.selectAll(null).data(g.points).enter().append("circle")
        //     .attr("class","grid")
        //     .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")"})
        //     .attr("r",1)
        //     .style("fill","black")
        //     .style("stroke","none")

    reset();
    show_dynamics();

    
    
    const alpha0 = config.bifurcation_plot.xr[0];
    const alpha1 = config.bifurcation_plot.xr[1];
    const alpha = range(alpha0, alpha1, dx);   
    
    each(branches,branch => {        
        const [xmin, xmax] = branch.xr;
        const f = branch.f(beta); // ensure f has correct signature elsewhere
        const a = alpha.filter(x => x >= xmin && x <= xmax);
        const points = a.map(x => ({ x:x, y: f(x) }));
        branch.points = points;
    })
    
    display.selectAll("."+styles.branch)
        .data(branches).enter().append("path")
        .attr("class", styles.branch)
        .attr("d", d => curve(d.points))
        .classed(styles.stable, d => d.stability)
        .classed(styles.unstable, d => !d.stability)
    
    return () => {
        controls.selectAll("*").remove(); // Remove all circles from the second SVG
        display.selectAll("*").remove(); // Remove all circles from the second SVG
    };
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