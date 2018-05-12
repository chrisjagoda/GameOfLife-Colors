import { GameOfLife } from './GameOfLife';
import { Colors } from './types';
import { GameDisplay } from './GameDisplay';

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

let cell_width: number = 4;
let cell_height: number = 4;
let canvas_width: number = 500;
let canvas_height: number = 500;
let frequency: number = 0.1;
let colors: Colors = <Colors>{red: true, green: true, blue: true};
let intensity = 0.2;
let evolved: boolean = false;

let cells: number[][];
let display: GameDisplay;
let game: GameOfLife;

function createNewGame() {
  if (game) {
    clearInterval(game.interval);
  }
  cells = genCells(cell_width, cell_height, canvas_width, canvas_height, frequency);
  display = new GameDisplay("life", cells.length, cells[0].length, cell_width, cell_height, intensity);
  game = new GameOfLife(display, cells, cell_width, cell_height, colors, evolved);
  game.interval = setInterval(function () { game.step(); }, 100);
}

function toggleColor(color: string) {
  colors[color] = !colors[color];
}

function toggleEvolve() {
  evolved = !evolved;
  game.evolved = !game.evolved;
}

function updateIntensity(value: string) {
  intensity = Number(value);
  display.intensity = intensity;
}

document.getElementById("start").addEventListener("click", createNewGame);
document.getElementById("red").addEventListener("change", event => toggleColor("red"));
document.getElementById("green").addEventListener("change", event => toggleColor("green"));
document.getElementById("blue").addEventListener("change", event => toggleColor("blue"));
var range: HTMLInputElement = document.getElementById("intensity") as HTMLInputElement;
range.addEventListener("input", event => updateIntensity(range.value));
document.getElementById("evolve").addEventListener("click", toggleEvolve);

createNewGame();