
export default [
    {
        id: 1,
        xr: [-Infinity, 1],
        stability: 1,
        f: (beta) => (x) => 0,
    },
    {
        id: 2,
        xr: [1, Infinity],
        stability: 0,
        f: (beta) => (x) => 0,
    },
    {
        id: 3,
        xr: [1, Infinity],
        stability: 1,
        f: (beta) => (x) => 1-beta/x,
    },
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