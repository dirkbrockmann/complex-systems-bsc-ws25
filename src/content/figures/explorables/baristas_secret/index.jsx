import {config,load} from '@explorables/baristas_secret';
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
// always column: display on top, controls below
const stacked = {
    container: "flex flex-col items-start gap-4",
    display:   "w-full border-1 border-black dark:border-white mb-0 h-auto",
    controls:  "w-full mb-0 h-auto"
};

export default ({
    id,
    forceRowOnSmall = false,
    layout = "responsive" // "responsive" | "row" | "column"
}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Choose class set per instance
        let classes;
        if (layout === "column") {
            classes = stacked;
        } else if (layout === "row" || forceRowOnSmall) {
            classes = forced;
        } else {
            classes = responsive;
        }

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
    },[id, forceRowOnSmall, layout]);

    return <div ref={containerRef} id={id} />;
}