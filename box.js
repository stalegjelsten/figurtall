class Box {
  constructor(col, row, colorIndex) {
    this.col = col;
    this.row = row;
    this.colorIndex = colorIndex;
  }

  show() {
    push();
    fill(colors[this.colorIndex]);
    if (this.colorIndex == 0) {
      strokeWeight(0);
      noStroke();
    } else {
      stroke(0, 1);
      strokeWeight(lineWeight);
    }
    if (useCircles) {
      ellipseMode(CORNER);
      circle(
        this.col * cellSize + lineWeight,
        this.row * cellSize + lineWeight,
        cellSize - 2 * lineWeight
      );
    } else {
      square(this.col * cellSize, this.row * cellSize, cellSize);
    }
    pop();
  }

  changeColor(incr) {
    if (incr == 1) {
      this.colorIndex = (this.colorIndex + incr) % colors.length;
    } else if (incr == -1) {
      this.colorIndex--;
      if (this.colorIndex < 0) {
        this.colorIndex = colors.length - 1;
      }
    } else {
      this.colorIndex = 0;
    }
  }

  setColor(num) {
    if (num < 0) {
      this.colorIndex = curColor;
    } else {
      this.colorIndex = num;
    }
  }
}
