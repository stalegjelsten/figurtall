class Grid {
  constructor() {
    this.boxes = [];
    for (let i = 0; i < width / gridSize; i++) {
      for (let j = 0; j < height / gridSize; j++) {
        this.boxes.push(new Box(i * gridSize, j * gridSize, gridSize));
      }
    }
  }

  show() {
    this.boxes.forEach((box) => {
      box.show();
    });
  }

  changeAllColors() {
    this.boxes.forEach((box) => {
      box.colorIndex = (box.colorIndex + 1) % box.colors.length;
      box.color = box.colors[box.colorIndex];
    });
  }

  showGrid() {
    for (let i = 0; i <= width / gridSize; i++) {
      push();
      stroke(0, 0.2);
      strokeWeight(1);
      line(i * gridSize, 0, i * gridSize, height);
      pop();
    }
    for (let i = 0; i <= height / gridSize; i++) {
      push();
      stroke(0, 0.2);
      strokeWeight(1);
      line(0, i * gridSize, width, i * gridSize);
      pop();
    }
  }
}

class Box {
  constructor(x, y, size) {
    // This code runs once when an instance is created.
    this.x = x; // + int(lineWeight / 2);
    this.y = y; // + int(lineWeight / 2);
    this.size = size;
    this.strokeColors = [
      color(0, 1),
      color(0, 1),
      color(0, 1),
      color(0, 1),
      // color(220, 50, 50, 0.5),
      // color(120, 50, 50, 0.5),
      // color(340, 50, 50, 0.5),
    ];
    this.colors = [
      color(255, 0),
      color(220, 30, 100),
      color(120, 20, 90),
      color(340, 30, 90),
    ];
    this.color = this.colors[0];
    this.colorIndex = 0;
  }

  show() {
    push();
    fill(this.color);
    if (this.colorIndex == 0) {
      strokeWeight(0);
      noStroke();
    } else {
      stroke(this.strokeColors[this.colorIndex]);
      strokeWeight(lineWeight);
    }
    square(this.x, this.y, this.size);
    pop();
  }

  hop() {
    // This code runs once when myFrog.hop() is called.
    this.x += random(-10, 10);
    this.y += random(-10, 10);
  }
  changeColor() {
    this.colorIndex = (this.colorIndex + 1) % this.colors.length;
    this.color = this.colors[this.colorIndex];
  }
}

let myGrid;
let gridSize = 30;
let showGrid = true;
let lineWeight = 2;
let canvas;

function setup() {
  colorMode(HSB);
  canvas = createCanvas(gridSize * 50, gridSize * 20);
  myGrid = new Grid();
  createP("Trykk i rutenettet for å endre farge på rutene.");
  let showBtn = createButton("Space (vis rutenett)");
  let saveBtn = createButton("S (lagre bilde)");
  showBtn.mousePressed((it) => {
    showGrid = !showGrid;
  });
  saveBtn.mousePressed((it) => {
    saveCanvas("figurtall", "png");
  });
}

function draw() {
  background(255);
  if (showGrid) {
    myGrid.showGrid();
  }
  myGrid.show();
}

function mouseClicked() {
  let cols = floor(width / gridSize);
  let rows = floor(height / gridSize);

  // which cell are we in?
  let col = floor(mouseX / gridSize);
  let row = floor(mouseY / gridSize);

  // make sure we're inside the canvas
  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    // flatten 2d into 1d index
    let idx = row + col * rows;
    console.log("Col:", col, "Row: ", row, "idx:", idx);
    myGrid.boxes[idx].changeColor();
  }
}

function keyPressed() {
  if (key == " ") {
    showGrid = !showGrid;
  } else if (key == "s") {
    saveCanvas("figurtall", "png");
  }
}
