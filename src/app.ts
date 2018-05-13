import { GameDisplay } from './GameDisplay';
import { GameOfLife } from './GameOfLife';
import { Colors } from './types';

import { GUI } from 'dat.gui';


var GameControls = function() {
  this.cell_width = 4;
  this.canvas_width = 256;
  this.frequency = 0.1;
  this.red = true;
  this.green = true;
  this.blue = true;
  this.alpha = 0.2;
  this.evolve = false;

  let cells: number[][];  
  let colors = <Colors>{red: true, green: true, blue: true};
  let display: GameDisplay;
  let game: GameOfLife;

  function genCells(cell_size_x: number, cell_size_y: number, canvas_width?: number, canvas_height?: number, frequency?: number): number[][] {
    let width: number = canvas_width ||
                        window.innerWidth ||
                        document.documentElement.clientWidth ||
                        document.body.clientWidth;
    let height: number =  canvas_height ||
                          window.innerHeight ||
                          document.documentElement.clientHeight ||
                          document.body.clientHeight;
    let num_cells_x: number = Math.floor(width/cell_size_x);
    let num_cells_y: number = Math.floor(height/cell_size_y);
    let cells: number[][] = [];
    let live_frequency = frequency || .10; // default 1 in 10 alive
    // create cells, 0 - dead, 1 - alive
    for (let i = 0; i < num_cells_y; i++) {
      cells.push([]);
      for (let j = 0; j < num_cells_x; j++) {
        cells[i].push((Math.random() <= live_frequency) ? 1: 0);
      }      
    }
    return cells;
  }

  this.createNewGame = function() {
    if (game) {
      clearInterval(game.interval);
    }
    cells = genCells(this.cell_width, this.cell_width, this.canvas_width, this.canvas_width, this.frequency);
    display = new GameDisplay("life", cells.length, cells[0].length, this.cell_width, this.cell_width, this.alpha);
    game = new GameOfLife(display, cells, this.cell_width, this.cell_width, colors, this.evolve);
    game.interval = setInterval(function () { game.step(); }, 100);
  }

  this.pauseGame = function() {
    if (game.interval == 0)
      game.interval = setInterval(function () { game.step(); }, 100);
    else {
      clearInterval(game.interval);
      game.interval = 0;
    }
  }

  this.toggleColor = function(color: string) {
    colors[color] = !colors[color];
  }

  this.toggleEvolve = function() {
    game.evolve = this.evolve;
  }

  this.updateAlpha = function(value: string) {
    display.alpha = Number(this.alpha);
  }

  this.createNewGame();
}

window.onload = function() {
  var gameControls = new GameControls();
  var gui = new GUI();
  gui.add(gameControls, 'createNewGame');
  gui.add(gameControls, 'pauseGame');
  gui.add(gameControls, 'cell_width', 0, 10).step(1);
  gui.add(gameControls, 'canvas_width', 100, 800).step(1);
  gui.add(gameControls, 'frequency', 0, 1);
  gui.add(gameControls, 'red').onChange(function() {gameControls.toggleColor('red')});
  gui.add(gameControls, 'green').onChange(function() {gameControls.toggleColor('green')});
  gui.add(gameControls, 'blue').onChange(function() {gameControls.toggleColor('blue')});
  gui.add(gameControls, 'evolve').onChange(function() {gameControls.toggleEvolve()});
  gui.add(gameControls, 'alpha', 0, 1).onChange(function() {gameControls.updateAlpha()});
}