"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The game display object
 */
class GameDisplay {
    /**
     * Game display constructor
     * @param {number} num_cells_x the number of cells along the x axis
     * @param {number} num_cells_y the number of cells along the y axis
     * @param {number} cell_width the cell width
     * @param {number} cell_height the cell height
     * @param {string} the id of the canvas element
     */
    constructor(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id) {
        this.canvas = document.getElementById(canvas_id);
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
    drawCell(cell) { }
    /**
     * Updates all cells on board from previous generation to next
     * @param {Cell[][]} cell_array the 2D array of cells to be updated
     */
    updateCells(cell_array) {
        var length_y = cell_array.length;
        var length_x = cell_array[0].length || 0;
        var y;
        var x;
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
exports.GameDisplay = GameDisplay;
/**
 * Dark version of game display object
 */
class GameDisplayDark extends GameDisplay {
    constructor(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id) {
        super(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id);
        this.ctx.fillStyle = "RGBa(0,0,0,1)";
        this.ctx.fillRect(0, 0, this.width_pixels, this.height_pixels);
    }
    drawCell(cell) {
        // find start point (top left)
        var start_x = cell.x_pos * this.cell_width;
        var start_y = cell.y_pos * this.cell_height;
        // draw rectangle from that point, to bottom right point by adding cell_width/cell_height
        if (cell.alive) {
            this.ctx.fillStyle = "RGBa(" + cell.color.r + "," + cell.color.g + "," + cell.color.b + "," + cell.color.a + ")";
            this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
        }
        else {
            this.ctx.fillStyle = "RGBa(0,0,0,1)";
            this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
            if (cell.color) {
                this.ctx.fillStyle = "RGBa(" + Math.floor(cell.color.r / 7) + "," + Math.floor(cell.color.g / 7) + "," + Math.floor(cell.color.b / 7) + "," + 1 + ")";
                this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
            }
        }
    }
}
exports.GameDisplayDark = GameDisplayDark;
/**
 * Light version of game display object
 */
class GameDisplayLight extends GameDisplay {
    constructor(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id) {
        super(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id);
    }
    drawCell(cell) {
        // find start point (top left)
        var start_x = cell.x_pos * this.cell_width;
        var start_y = cell.y_pos * this.cell_height;
        // draw rectangle from that point, to bottom right point by adding cell_width/cell_height
        if (cell.alive) {
            this.ctx.fillStyle = "RGBa(" + cell.color.r + "," + cell.color.g + "," + cell.color.b + "," + cell.color.a + ")";
            this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
        }
        else {
            this.ctx.clearRect(start_x, start_y, this.cell_width, this.cell_height);
            if (cell.color) {
                this.ctx.fillStyle = "RGBa(" + cell.color.r + "," + cell.color.g + "," + cell.color.b + "," + 0.1 + ")";
                this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
            }
        }
    }
}
exports.GameDisplayLight = GameDisplayLight;