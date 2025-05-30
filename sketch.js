class Grid {
  constructor() {
    this.boxes = [];
    for (let i = 0; i < width / gridSize; i++) {
      for (let j = 0; j < height / gridSize; j++) {
        this.boxes.push(new Box(i * gridSize, j * gridSize, gridSize, 0));
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
  constructor(x, y, size, colorIndex) {
    // This code runs once when an instance is created.
    this.x = x; // + int(lineWeight / 2);
    this.y = y; // + int(lineWeight / 2);
    this.size = size;
    this.colorIndex = colorIndex;
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
  }

  show() {
    push();
    fill(this.colors[this.colorIndex]);
    if (this.colorIndex == 0) {
      strokeWeight(0);
      noStroke();
    } else {
      stroke(this.strokeColors[this.colorIndex]);
      strokeWeight(lineWeight);
    }
    if (useCircles) {
      ellipseMode(CORNER);
      circle(
        this.x + lineWeight,
        this.y + lineWeight,
        this.size - 2 * lineWeight
      );
    } else {
      square(this.x, this.y, this.size);
    }
    pop();
  }

  hop() {
    // This code runs once when myFrog.hop() is called.
    this.x += random(-10, 10);
    this.y += random(-10, 10);
  }
  changeColor() {
    this.colorIndex = (this.colorIndex + 1) % this.colors.length;
  }
}

let myGrid;
let gridSize = 30;
let showGrid = true;
let useCircles = false;
let lineWeight = 2;
let canvas;

function setup() {
  colorMode(HSB);
  canvas = createCanvas(gridSize * 50, gridSize * 20);
  myGrid = new Grid();
  let savedData = getItem("storedGrid");
  console.log(savedData);
  // If no data has been saved yet
  if (savedData !== null) {
    // Otherwise convert the data to Bubble objects
    loadData(savedData);
  }

  createP("Trykk i rutenettet for å endre farge på rutene.");
  let showBtn = createButton("Space (vis rutenett)");
  let saveBtn = createButton("S (lagre bilde)");
  let resetBtn = createButton("Tøm lerret");
  showBtn.mousePressed((it) => {
    showGrid = !showGrid;
  });
  saveBtn.mousePressed((it) => {
    saveCanvas("figurtall", "png");
  });
  resetBtn.mousePressed((it) => {
    removeItem("storedGrid");
    myGrid = new Grid();
  });
  let circleBtn = createButton("Sirkler");
  circleBtn.mousePressed((it) => {
    useCircles = !useCircles;
  });
}

function draw() {
  background(255);
  if (showGrid) {
    myGrid.showGrid();
  }
  myGrid.show();
}

// Convert saved Bubble data into Bubble Objects
function loadData(storedGrid) {
  let i = 0;
  for (let box of storedGrid) {
    myGrid.boxes[i] = new Box(box.x, box.y, box.size, box.colorIndex);
    i++;
  }
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
    console.log("Col:", col, "Row: ", row, "idx: ", idx);
    myGrid.boxes[idx].changeColor();
    storeItem("storedGrid", myGrid.boxes);
  }
}

function keyPressed() {
  if (key == " ") {
    showGrid = !showGrid;
  } else if (key == "s") {
    saveCanvas("figurtall", "png");
  }
}
