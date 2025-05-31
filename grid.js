class Grid {
  constructor() {
    this.boxes = [];
    for (let i = 0; i < cols; i++) {
      this.boxes.push([]);
      for (let j = 0; j < rows; j++) {
        this.boxes[i].push(new Box(i, j, 0));
      }
    }
  }

  show() {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        this.boxes[i][j].show();
      }
    }
    if (showGrid) {
      this.showGrid();
    }
  }

  showGrid() {
    for (let i = 0; i <= cols; i++) {
      push();
      stroke(0, 0.2);
      strokeWeight(1);
      line(i * cellSize, 0, i * cellSize, rows * cellSize);
      pop();
    }
    for (let i = 0; i <= rows; i++) {
      push();
      stroke(0, 0.2);
      strokeWeight(1);
      line(0, i * cellSize, cols * cellSize, i * cellSize);
      pop();
    }
  }
}
