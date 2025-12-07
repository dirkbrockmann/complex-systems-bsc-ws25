
export default [
    {
        id: 1,
        xr: [-Infinity, -0.2],
        stability: 0,
        f: (beta) => (x) => 0,
    },
    {
        id: 2,
        xr: [-0.2, Infinity],
        stability: 1,
        f: (beta) => (x) => 0,
    },
    {
        id: 3,
        xr: [-Infinity, 0.75-0.2],
        stability: 1,
        f: (beta) => (x) => 0.5+0.5*Math.sqrt(1 - 4/3*(0.2+x)),
    },
    {
        id: 4,
        xr: [-0.2, 0.75-0.2],
        stability: 0,
        f: (beta) => (x) => 0.5-0.5*Math.sqrt(1 - 4/3*(0.2+x)),
    },
    
    {
        id: 5,
        xr: [-Infinity, -0.2],
        stability: 1,
        f: (beta) => (x) => 0.5-0.5*Math.sqrt(1 - 4/3*(0.2+x)),
    }

];

// Example usage pattern elsewhere (pseudo‑code):
// const xArray = d3.range(x0, x1 + dx, dx);
// const branch = branches[0];
// const [xmin, xmax] = branch.xr;
// const f = branch.f(alpha, beta);
//
// const xArrayBranch = xArray.filter(x => x >= xmin && x <= xmax);
// const points = xArrayBranch.map(x => ({ x, y: f(x) }));
// -> points only contains values where x is in the domain of branch.xr