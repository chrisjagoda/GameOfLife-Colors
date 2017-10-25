# Conway's Game of Life #

An implementation of Conway's Game of Life with a twist involving phenotypes in the form of color.
Colors are randomly passed down from two parents picked randomly from the neighbors of each cell with each cell posession only one color.
Dark/Light modes and switching cell colors on and off are included in the example.
An optional parameter, evolve, is also supported which increases reproduction of the cells creating different patterns.


## Directions to Run ##

**Install Browserify**

```shell
npm install -g browserify
```

**Fetch dependencies**

```shell
npm install
```

**Compile .ts files**

Either enter the following command

```shell
node node_modules/typescript/bin/tsc.js
```

**or** use the `tsc` script from our `package.json` with

```shell
npm run tsc
```

**Run Browserify**

Either enter the following command

```shell
browserify src/app.js -o bundle.js -s app
```

**or** use the `browserify` script from our `package.json` with

```shell
npm run browserify

```

**Start http-server**

Either enter the following command

```shell
node node_modules/http-server/bin/http-server -o
```

**or** use the `listen` script from our `package.json` with

```
npm run listen
```

By default http-server listens on port `8080`.
If this port is taken, use '-p ####' to specify a free port, where `####` is the available port.

## Shortcut for running all steps in a batch ##

```
npm run all
```
