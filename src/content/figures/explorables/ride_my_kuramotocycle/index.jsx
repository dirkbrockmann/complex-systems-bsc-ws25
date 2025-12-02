import {config,load} from '@explorables/ride_my_kuramotocycle';
import * as d3 from 'd3';
import {useEffect,useRef} from 'react';

// Static class presets if the explorable remain in a row of display and controls panel

const responsive = {
    container: "flex flex-col sm:flex-row items-start gap-8",
    display:   "w-full border-1 border-black dark:border-white sm:w-1/2 mb-0 h-auto",
    controls:  "w-full sm:w-1/2 mb-0 h-auto"
};
const forced = {
    container: "flex flex-row items-start gap-8",
    display:   "border-1 border-black dark:border-white w-1/2 mb-0 h-auto",
    controls:  "w-1/2 mb-0 h-auto"
};

export default ({id, forceRowOnSmall = false}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Choose class set per instance, optionally forcing a single row on small screens
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