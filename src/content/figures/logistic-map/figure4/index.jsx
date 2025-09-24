import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {each,map,range} from 'lodash-es';
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';


const loadExplorable = (canvasContainer,SvgContainer) => {

    // canvasContainer is expected to be a <canvas> element
    const canvas = canvasContainer;
    const svg = SvgContainer;

    const ctx = canvas.getContext('2d');

    const xr = config.plot.xr;
    const yr = config.plot.yr;
    const X = d3.scaleLinear().domain(xr).range([config.plot.margin.l,config.svg.width - config.plot.margin.r]);
    const Y = d3.scaleLinear().domain(yr).range([config.svg.height - config.plot.margin.b,config.plot.margin.t]);
    const Xc = d3.scaleLinear()
    const Yc = d3.scaleLinear()

    const xAxis = d3.axisBottom(X);
    const yAxis = d3.axisLeft(Y);
    var zoomdepth = 0;
    var lambda_0 = xr[0];
    var lambda_1 = xr[1];
    var lambda = lambda_0;
    var dl = (lambda_1 - lambda_0) / config.plot.N_lambda;
    var xr1 = yr[1];
    var xr0 = yr[0];
    var alpha = config.plot.alpha;
    
    const getPalette = (isDark) => isDark ? {
        dot: (a) => `rgba(255,255,255,${a})`,
    } : {
        dot: (a) => `rgba(0,0,0,${a})`,
    };

    d3.select(canvas)
        .style("z-index",4)
		.style("padding","0px").style("margin","0px")
		.style("overflow","visible")
		.on("click",zoomin)

    d3.select(svg)	 	
    	.style("position","absolute")
	 	.style("pointer-events","none")
	 	.style("overflow","visible")

    const N = config.plot.N;
    var palette = getPalette(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    console.log(palette.dot(0.5));
    const f = (x,r) => { return r*x*(1-x);};
    
    // palette factory
    

    if (window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener('change', (e) => {
            palette = getPalette(e.matches);
            
            ctx.clearRect(0, 0,canvas.width,canvas.height);
		    //ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
		    //ctx.fillRect(0,0,canvas.width,canvas.height);	
             lambda = lambda_0;
			clearInterval(simulation);
		    simulation = setInterval(go, 0)
        });
    }


    const compute_trace = (x0, N, r) => {
        const xarr = [{ x: r, y: x0 }];
        for (let i = 0; i < N; i++) {
            const x1 = f(x0,r);
            xarr.push({ x: r, y: x1 });
            x0 = x1;
        }
        return xarr.slice(config.plot.N_transient, xarr.length);
    }

     const draw = (orbit) => {
        orbit.forEach(function (d) {
            ctx.moveTo(Xc(d.x), Yc(d.y));
			ctx.fillStyle = palette.dot(alpha)
			ctx.beginPath();
			ctx.arc(Xc(d.x), Yc(d.y), config.plot.dotsize, 0, 2 * Math.PI);
			ctx.fill()
        })
    }


    function zoomin(){
		zoomdepth+=1;
		if (zoomdepth < config.plot.zoomdepth) {
            let p = d3.pointer(event, this);
		    let rect = this.getBoundingClientRect();
		    let scaleX = this.width / rect.width;    
		    let scaleY = this.height / rect.height;
		    p[0]=p[0]*scaleX
		    p[1]=p[1]*scaleY

    	    let Dl = config.plot.zoomwindowsize.x*(lambda_1-lambda_0);
		    let Dx = config.plot.zoomwindowsize.y*(xr1-xr0);

		    let lamm=Xc.invert(p[0]) ; 
		    let xm= Yc.invert(p[1]);

		    lambda_0 = lamm - Dl/2;
		    lambda_1 = lamm + Dl/2;
		    xr0 = xm - Dx/2;
		    xr1 = xm + Dx/2;
		    dl = dl*config.plot.zoomwindowsize.x;
            alpha = config.plot.zoomalpha;			
		} else {
            lambda_0 = xr[0];
            lambda_1 = xr[1];
            dl = (lambda_1 - lambda_0) / config.plot.N_lambda;
            xr1 = yr[1];
            xr0 = yr[0];    
			zoomdepth=0;
            alpha = config.plot.alpha;
			
		}
		
        lambda = lambda_0;
		Xc.domain([lambda_0, lambda_1])
		Yc.domain([xr0 , xr1])
		X.domain([lambda_0, lambda_1])
		Y.domain([xr0 , xr1])


		ctx.clearRect(0, 0,canvas.width,canvas.height);
		//ctx.fillStyle = "rgba(255, 255, 255, 0)";
		//ctx.fillRect(0,0,canvas.width,canvas.height);	
			
		simulation = setInterval(go, 0)
		d3.select(svg).selectAll("."+styles.xaxis).transition().call(xAxis)
        d3.select(svg).selectAll("."+styles.yaxis).transition().call(yAxis)
	}

    
    const canvasRect = (canvas.parentElement || canvas).getBoundingClientRect();
    
    canvas.width = Math.round(canvasRect.width);
    canvas.height = Math.round(canvasRect.height);
    
    Xc.range([0, canvasRect.width]).domain([lambda_0, lambda_1]);
    Yc.range([canvasRect.height, 0]).domain([yr[0], yr[1]]);

    
    let simulation = setInterval(go, 0)

    function go(){
		let orbit = compute_trace(Math.random(),N,lambda);
		draw(orbit)
		if(lambda>lambda_1){
			clearInterval(simulation);
		}
		lambda+=dl;
	}


    d3.select(svg).append("g").call(xAxis)
        .attr("class",styles.xaxis)
        .attr("transform","translate(" + 0 + "," + Y(0) + ")");

    d3.select(svg).append("g").call(yAxis)
        .attr("class",styles.yaxis)
        .attr("transform","translate(" + X(config.plot.xr[0]) + "," + 0 + ")");

    

    const cleanup = () => {
        ro.disconnect();
        const rect = (canvas.parentElement || canvas).getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
    }

    return cleanup;
}
export default ({id}) => {
    const ContainerRef = useRef(null); // Ref for the first div
    const SvgContainerRef = useRef(null); // Ref for the SVG element
    const CanvasContainerRef = useRef(null); // Ref for the canvas element

    useEffect(() => {

        return loadExplorable(CanvasContainerRef.current,SvgContainerRef.current);

    },[id]); // Add `id` as a dependency to ensure it updates if the prop changes

    return (
        <>
            <div
                ref={ContainerRef}
                id={id}
                className={config.container.class}
            >
                <svg
                    ref={SvgContainerRef}
                    width={config.svg.width}
                    height={config.svg.height}
                    className={config.svg.class}
                    viewBox={`0 0 ${config.svg.width} ${config.svg.height}`}
        
                    id={`${id}-svg`}
                />
                <canvas
                    ref={CanvasContainerRef}
                    id={`${id}-canvas`}
                    className={config.canvas.class}
                    width={config.canvas.width}
                    height={config.canvas.height}
                />
            </div>
        </>
    );
}