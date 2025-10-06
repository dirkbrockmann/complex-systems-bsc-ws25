import {config,load} from '@explorables/berlin_8_am';
import * as d3 from 'd3';
import {useEffect,useRef} from 'react';


export default ({id, forceRowOnSmall = false}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Compute class sets per instance, optionally forcing a single row on small screens
        const responsive = {
            container: "flex flex-col sm:flex-row items-start gap-8",
            display:   "border-1 border-black dark:border-white w-full sm:w-2/3 mb-0 h-auto",
            controls:  "w-full sm:w-1/3 mb-0 h-auto"
        };
        const forced = {
            container: "flex flex-row flex-nowrap items-start gap-8 overflow-x-auto",
            display:   "border-1 border-black dark:border-white w-1/2 mb-0 h-auto min-w-[280px] shrink-0",
            controls:  "w-1/2 mb-0 h-auto min-w-[280px] shrink-0"
        };
        const classes = forceRowOnSmall ? forced : responsive;

        if (containerRef.current) {
            // Apply classes just-in-time for this instance
            config.container_class = classes.container;
            config.display_class = classes.display;
            config.controls_class = classes.controls;

            load(containerRef.current.id);
        }
        return () => {
            d3.select('#' + containerRef.current.id).selectAll('*').remove(); // Clean up the container
        };
    },[id, forceRowOnSmall]);

    return <div ref={containerRef} id={id} />;
}