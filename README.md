[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg

# Introduction to Complex Systems

This repo contains the information to build the site
for the complex systems course for the Bachelor Program.

## License

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

# Developer Notes

* `npm install`: installs needed packages (like astro)

scripts are definced in  [package.json][./package.json] under `scripts` which can be run via `npm run scriptname` like:

* `npm run dev`: runs a local version of the website
* `npm run publish`: commits all changes to the repo + pushes them to github + deploys it to github-pages