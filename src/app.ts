import { GameOfLife } from './GameOfLife';
import { Colors } from './types';

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

document.getElementById("start").addEventListener("click", e => createNewGame());
document.getElementById("red").addEventListener("change", e => toggleColor("red"));
document.getElementById("green").addEventListener("change", e => toggleColor("green"));
document.getElementById("blue").addEventListener("change", e => toggleColor("blue"));
document.getElementById("evolve").addEventListener("click", e => toggleEvolve());

let cell_width: number = 3;
let cell_height: number = 3;
let canvas_width: number = 400;
let canvas_height: number = 400;
let frequency: number = 0.1;
let colors: Colors = <Colors>{red: true, green: true, blue: true};
let evolved: boolean = false;

let cells: number[][];
let game: GameOfLife;

function createNewGame() {
  if (game) {
    clearInterval(game.interval);
  }
  cells = genCells(cell_width, cell_height, canvas_width, canvas_height, frequency);
  game = new GameOfLife(cells, cell_width, cell_height, "life", colors, evolved);
  game.interval = setInterval(function () { game.step(); }, 100);
}

function toggleColor(color: string) {
  colors[color] = !colors[color];
}

function toggleEvolve() {
  game.evolved = !game.evolved;
}

createNewGame();