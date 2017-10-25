/**
 * The Game of Life object
 */
export class GameOfLife {
	private num_cells_y: number;
	private num_cells_x: number;
	private cell_width: number;
	private cell_height: number;
	private canvas_id: string;
	private colors: Colors;
	private cell_array: Cell[][];
	private display: GameDisplay;
	public dark: boolean;
	public evolved: boolean;
	public interval: number;

	/**
	 * Game of Life object constructor
	 * @param {number[][]} init_cells the initial array of cells
	 * @param {number} num_cells_y the number of cells along the y axis
	 * @param {number} cell_width the cell width
	 * @param {number} cell_height the cell height
	 * @param {string} the id of the canvas element
	 */
	constructor(init_cells: number[][], cell_width?: number, cell_height?: number, canvas_id?: string, colors?: Colors, evolved?: boolean, dark?: boolean) {
		this.num_cells_y = init_cells.length;
		this.num_cells_x = init_cells[0].length || 0;
		this.cell_width = cell_width || 5;
		this.cell_height = cell_height || 5;
		this.canvas_id = canvas_id || "life";
		this.colors = colors || <Colors>{red: true, green: true, blue: true};
		this.dark = dark || false;
		this.evolved = evolved || false;
		this.cell_array = [];
		this.display = (dark) ? new GameDisplayDark(this.num_cells_x, this.num_cells_y, cell_width, cell_height, canvas_id):
								new GameDisplayLight(this.num_cells_x, this.num_cells_y, cell_width, cell_height, canvas_id);
		this.interval = null; // initial interval to null. Set when setInterval called on step

		// Convert init_cells array of 0s and 1s to Cell objects for each row
        for (var y = 0; y < this.num_cells_y; y++) {
			this.cell_array.push([]);
			// each column in rows
			for (var x = 0; x < this.num_cells_x; x++) {
				let alive: boolean = (init_cells[y][x] === 1);
				let color: RGBA = (alive) ? <RGBA>{r: (this.colors["red"]) ? Math.floor(Math.random()*256): 0,
							    				   g: (this.colors["green"]) ? Math.floor(Math.random()*256): 0,
							    				   b: (this.colors["blue"]) ? Math.floor(Math.random()*256): 0,
							    				   a: Math.random() * (0.75 - 0.25) + 0.25 // rand between 0.25 and 0.75
							    				  }: null;
				this.cell_array[y].push(<Cell>{x_pos: x, y_pos: y, alive: alive, color: color});
			}
        }
        this.display.updateCells(this.cell_array);
	}

	/**
	 * Calculates and returns the next gen of cells according to the rules of life
	 * @return {Cell[][]} The next generation of cells
	 */
	public nextGenCells(): Cell[][] {
		var current_gen: Cell[][] = this.cell_array;
		var next_gen: Cell[][] = [];      // New array to hold the next gen cells
		var length_y: number = this.cell_array.length;
		var length_x: number = current_gen[0].length || 0;
		var x: number;
		var y: number;
		// each row
		for (y = 0; y < length_y; y++) {
			next_gen.push([]); // Init new row
			// each column in rows
			for (x = 0; x < length_x; x++) {
				var cell: Cell = current_gen[y][x];
				// Calculate above/below/left/right row/column values
				var row_above: number = (y - 1 >= 0) ? y - 1: length_y - 1; // If current cell is on first row, cell "above" is the last row
				var row_below: number = (y + 1 <= length_y - 1) ? y + 1: 0; // If current cell is in last row, then cell "below" is the first row
				var column_left: number = (x - 1 >= 0) ? x - 1: length_x - 1; // If current cell is on first row, then left cell is the last row
				var column_right: number = (x + 1 <= length_x - 1) ? x + 1: 0; // If current cell is on last row, then right cell is in the first row

				var neighbors: Cell[] = [
				  current_gen[row_above][column_left], // top left
				  current_gen[row_above][x], // top center
				  current_gen[row_above][column_right], // top right
				  current_gen[y][column_left], // left
				  current_gen[y][column_right], // right
				  current_gen[row_below][column_left], // bottom left
				  current_gen[row_below][x], // bottom center
				  current_gen[row_below][column_right] // bottom right
				];

				var alive_count: number = 0;
				var dead_count: number = 0;

				var neighbor_colors: RGBA[] = [];
				let self = this;
				neighbors.forEach(function (neighbor) {
					if (neighbor.alive) {
				    	alive_count++;
				    	if (self.colors && neighbor.color) {
					    	neighbor_colors.push(<RGBA>{r: neighbor.color.r,
										    	  		g: neighbor.color.g,
										    	    	b: neighbor.color.b,
										    	  		a: neighbor.color.a});
				    	}
					}
					else {
				    	dead_count++;
					}
				});

				// variant alg with evolved set to true
				let is_alive: boolean = cell.alive;
				if (cell.alive) {
					if (alive_count < 2 || alive_count > 3) {
						// new state: dead, overpopulation/underpopulation
						if (this.evolved) {
							cell.alive = false;
						}
						is_alive = false;
					} else if (alive_count === 2 || alive_count === 3) {
						// lives on to next generation
						if (this.evolved) {
							cell.alive = true;
							if (!cell.color) {
								cell.color = neighbor_colors[Math.floor(Math.random()*neighbor_colors.length)];;
							}
						}
						is_alive = true;
					}
				} else {
					if (alive_count === 3) {
						// new state: live, reproduction
						if (this.evolved) {
							cell.alive = true;
							if (!cell.color) {
								cell.color = neighbor_colors[Math.floor(Math.random()*neighbor_colors.length)];;
							}
						}
						is_alive = true;
					}
				}

				var parent_colors: RGBA[];
				var child_color: RGBA;
				if (is_alive) {
					if (cell.color) { // if colors exist - create child color from two random neighbors - or parents
						neighbor_colors.push(cell.color);
					}
					parent_colors = neighbor_colors.splice(Math.floor(Math.random()*neighbor_colors.length), 1);
					if (neighbor_colors.length > 0) { // fix for evolved - allows single parent color
						parent_colors.push(neighbor_colors[Math.floor(Math.random()*neighbor_colors.length)]);
					}
					child_color = parent_colors[Math.floor(Math.random()*parent_colors.length)];
				}
				// create new cell based on color from neighbors dead cell color null
				let cell_color: RGBA = (is_alive) ? child_color: cell.color;
				next_gen[y].push(<Cell>{x_pos: x, y_pos: y, alive: is_alive, color: cell_color});
			}
		}
		return next_gen;
	}

	/**
	 * Advances cells one generation and updates board
	 */
    public step(): void {
		// Set next gen as current cell array
		this.cell_array = this.nextGenCells();;
		this.display.updateCells(this.cell_array);
    }
}

/**
 * The game display object
 */
abstract class GameDisplay {
	private canvas: HTMLCanvasElement;
	private num_cells_x: number;
	private num_cells_y: number;
	public ctx: CanvasRenderingContext2D;
	public width_pixels: number;
	public height_pixels: number;
	public cell_width: number;
	public cell_height: number;

	/**
	 * Game display constructor
	 * @param {number} num_cells_x the number of cells along the x axis
	 * @param {number} num_cells_y the number of cells along the y axis
	 * @param {number} cell_width the cell width
	 * @param {number} cell_height the cell height
	 * @param {string} the id of the canvas element
	 */
	constructor(num_cells_x: number, num_cells_y: number, cell_width: number, cell_height: number, canvas_id: string) {
		this.canvas = <HTMLCanvasElement>document.getElementById(canvas_id);
		this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
		this.width_pixels = num_cells_x * cell_width;
		this.height_pixels = num_cells_y * cell_height;
		this.cell_width = cell_width;
		this.cell_height = cell_height;
        this.canvas.width = this.width_pixels;
        this.canvas.height = this.height_pixels;
	}
    
	/**
	 * Draws or clears a single cell
	 * @param {Cell} cell the cell to be drawn
	 */
	public drawCell(cell: Cell): void { }

	/**
	 * Updates all cells on board from previous generation to next
	 * @param {Cell[][]} cell_array the 2D array of cells to be updated
	 */
	public updateCells(cell_array: Cell[][]): void {		
		var length_y: number = cell_array.length;
		var length_x: number = cell_array[0].length || 0;
		var y: number;
		var x: number;
		// each row
		for (y = 0; y < length_y; y++) {
			// each column in rows
			for (x = 0; x < length_x; x++) {
				// Draw Cell on Canvas
				this.drawCell(cell_array[y][x]);
			}
		}
	}
}

/**
 * Dark version of game display object
 */
class GameDisplayDark extends GameDisplay {
	constructor(num_cells_x: number, num_cells_y: number, cell_width: number, cell_height: number, canvas_id: string) {
    	super(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id);
    	this.ctx.fillStyle = "RGBa(0,0,0,1)";
		this.ctx.fillRect(0, 0, this.width_pixels, this.height_pixels);
	}

	public drawCell(cell: Cell): void {
		// find start point (top left)
		var start_x: number = cell.x_pos * this.cell_width;
		var start_y: number = cell.y_pos * this.cell_height;
		// draw rectangle from that point, to bottom right point by adding cell_width/cell_height
		if (cell.alive) {
			this.ctx.fillStyle = "RGBa(" + cell.color.r + "," + cell.color.g + "," + cell.color.b + "," + cell.color.a + ")";
			this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
		} else {
        		this.ctx.fillStyle = "RGBa(0,0,0,1)";
				this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
			if (cell.color) {
				this.ctx.fillStyle = "RGBa(" + Math.floor(cell.color.r/7) + "," + Math.floor(cell.color.g/7) + "," + Math.floor(cell.color.b/7) + "," + 1 + ")";
				this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
			}
		}
	}
}

/**
 * Light version of game display object
 */
class GameDisplayLight extends GameDisplay {
	constructor(num_cells_x: number, num_cells_y: number, cell_width: number, cell_height: number, canvas_id: string) {
    	super(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id);
	}
    
	public drawCell(cell: Cell): void {
		// find start point (top left)
		var start_x: number = cell.x_pos * this.cell_width;
		var start_y: number = cell.y_pos * this.cell_height;
		// draw rectangle from that point, to bottom right point by adding cell_width/cell_height
		if (cell.alive) {
			this.ctx.fillStyle = "RGBa(" + cell.color.r + "," + cell.color.g + "," + cell.color.b + "," + cell.color.a + ")";
			this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
		} else {
			this.ctx.clearRect(start_x, start_y, this.cell_width, this.cell_height);
			if (cell.color) {
				this.ctx.fillStyle = "RGBa(" + cell.color.r + "," + cell.color.g + "," + cell.color.b + "," + 0.1 + ")";
				this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
			}
		}
	}
}

/**
 * Represents a living or dead cell
 * @param {x_pos} x_pos the x position of the cell
 * @param {y_pos} y_pos the y position of the cell
 * @param {alive} alive if the cell is alive or dead
 * @param {color} color the RGBA color value of the cell
 */
interface Cell {
	x_pos: number;
	y_pos: number;
	alive: boolean;
	color: RGBA;
}

/**
 * RGBA value
 * @param {number} r the red value (0 - 256)
 * @param {number} g the green value (0 - 256)
 * @param {number} b the blue value (0 - 256)
 * @param {number} a the alpha value (0 - 1)
 */
interface RGBA {
	r: number;
	g: number;
	b: number;
	a: number;
}

/**
 * The colors a new board of cells may have
 * @param {boolean} red if red is allowed
 * @param {boolean} green if green is allowed
 * @param {boolean} blue if blue is allowed
 */
export interface Colors {
	red: boolean;
	green: boolean;
	blue: boolean;
}