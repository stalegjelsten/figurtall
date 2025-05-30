document.addEventListener("touchstart", {});

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
  }

  changeAllColors() {
    this.boxes.forEach((box) => {
      box.colorIndex = (box.colorIndex + 1) % box.colors.length;
      box.color = box.colors[box.colorIndex];
    });
  }

  showGrid() {
    for (let i = 0; i <= cols; i++) {
      push();
      stroke(0, 0.2);
      strokeWeight(1);
      line(i * gridSize, 0, i * gridSize, rows * gridSize);
      pop();
    }
    for (let i = 0; i <= rows; i++) {
      push();
      stroke(0, 0.2);
      strokeWeight(1);
      line(0, i * gridSize, cols * gridSize, i * gridSize);
      pop();
    }
  }
}

class Box {
  constructor(col, row, colorIndex) {
    this.col = col; // + int(lineWeight / 2);
    this.row = row; // + int(lineWeight / 2);
    this.colorIndex = colorIndex;
    this.strokeColors = [color(0, 1), color(0, 1), color(0, 1), color(0, 1)];
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
        this.col * gridSize + lineWeight,
        this.row * gridSize + lineWeight,
        gridSize - 2 * lineWeight
      );
    } else {
      square(this.col * gridSize, this.row * gridSize, gridSize);
    }
    pop();
  }

  changeColor(incr) {
    if (incr == 1) {
      this.colorIndex = (this.colorIndex + incr) % this.colors.length;
    } else if (incr == -1) {
      this.colorIndex--;
      if (this.colorIndex < 0) {
        this.colorIndex = this.colors.length - 1;
      }
    } else {
      this.colorIndex = 0;
    }
  }
}

let myGrid;
let cols = 30;
let rows = 12;
let gridSize = 30;
let showGrid = true;
let useCircles = false;
let lineWeight = 2;
let canvas;
let gridSizeSlider;

function setup() {
  colorMode(HSB);
  let savedGridSize = getItem("storedGridSize");
  if (savedGridSize !== null) {
    gridSize = int(savedGridSize + 1);
  }
  canvas = createCanvas(
    gridSize * cols + lineWeight * 8,
    gridSize * rows + lineWeight * 8
  );
  canvas.parent("divcanvas");
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
    removeItem("storeGridSize");
    myGrid = new Grid();
  });
  let circleBtn = createButton("Sirkler");
  circleBtn.mousePressed((it) => {
    useCircles = !useCircles;
    if (circleBtn.html() == "Sirkler") {
      circleBtn.html("Rektangler");
    } else {
      circleBtn.html("Sirkler");
    }
  });
  gridSizeSlider = createSlider(10, 60, 31);
  gridSizeSlider.parent("#slider");
  gridSizeSlider.input(() => {
    let oldGridSize = gridSize;
    gridSize = gridSizeSlider.value();
    resizeCanvas(
      gridSize * cols + lineWeight * 8,
      gridSize * rows + lineWeight * 8
    );
    rescaleGrid(oldGridSize);
    sliderValue.html(
      "Rutenett: " +
        gridSizeSlider.value() +
        " px. Rader: " +
        rows +
        ". Kolonner: " +
        cols
    );
  });
  let sliderValue = select("#infobox");
  sliderValue.html(
    "Rutenett: " + gridSize + " px. Rader: " + rows + ". Kolonner: " + cols
  );
  let DN = select("#DN");
  let DE = select("#DE");
  let DS = select("#DS");
  let DW = select("#DW");
  let UN = select("#UN");
  let UE = select("#UE");
  let US = select("#US");
  let UW = select("#UW");
  DN.mousePressed(() => {
    removeLine("N");
  });
  DE.mousePressed(() => {
    removeLine("E");
  });
  DW.mousePressed(() => {
    removeLine("W");
  });
  DS.mousePressed(() => {
    removeLine("S");
  });
  UN.mousePressed(() => {
    addLine("N");
  });
  UW.mousePressed(() => {
    addLine("W");
  });
  US.mousePressed(() => {
    addLine("S");
  });
  UE.mousePressed(() => {
    addLine("E");
  });
}

function draw() {
  background(255);
  if (showGrid) {
    myGrid.showGrid();
  }
  myGrid.show();
}

function rescaleGrid(oldGridSize) {
  lineWeight = ceil(gridSize / 20);
  storeItem("storedGrid", myGrid.boxes);
  storeItem("storedGridSize", gridSize);
}

function resizeGrid(newW, newH) {
  if (newW < cols || newH < rows) {
  }

  let newboxes = [];
  storeItem("storedGrid", newboxes);
  resizeCanvas(newW * gridSize, newH * gridSize);
}

function loadData(storedGrid) {
  let i = 0;
  for (let box of storedGrid) {
    myGrid.boxes[i] = new Box(box.col, box.row, box.colorIndex);
    i++;
  }
}

function mousePressed() {
  // which cell are we in?
  let col = floor(mouseX / gridSize);
  let row = floor(mouseY / gridSize);

  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    if (mouseButton == LEFT) {
      myGrid.boxes[col][row].changeColor(1);
    } else if (mouseButton == RIGHT) {
      myGrid.boxes[col][row].changeColor(-1);
    } else if (mouseButton == CENTER) {
      myGrid.boxes[col][row].changeColor(0);
    }
    storeItem("storedGrid", myGrid.boxes);
  }
}

// function touchStarted() {
//   // which cell are we in?
//   let col = floor(mouseX / gridSize);
//   let row = floor(mouseY / gridSize);

//   myGrid[2][2].changeColor(1);
//   if (col >= 0 && col < cols && row >= 0 && row < rows) {
//     myGrid.boxes[col][row].changeColor(1);
//     storeItem("storedGrid", myGrid.boxes);
//   }
// }

function keyPressed() {
  if (key == " ") {
    showGrid = !showGrid;
  } else if (key == "s") {
    saveCanvas("figurtall", "png");
  }
  let col = floor(mouseX / gridSize);
  let row = floor(mouseY / gridSize);

  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    if (key == "q") {
      myGrid.boxes[col][row].changeColor(1);
    } else if (key == "w") {
      myGrid.boxes[col][row].changeColor(-1);
    } else if (key == "e") {
      myGrid.boxes[col][row].changeColor(0);
    }
    storeItem("storedGrid", myGrid.boxes);
  }
}

function removeLine(dir) {
  let newboxes = [];
  if (dir == "W") {
    newboxes = subset(myGrid.boxes, 1);
    myGrid.boxes = newboxes;
    cols--;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        myGrid.boxes[i][j].col--;
      }
    }
  } else if (dir == "E") {
    newboxes = subset(myGrid.boxes, 0, cols - 1);
    cols--;
    myGrid.boxes = newboxes;
  } else if (dir == "N") {
    for (let i = 0; i < cols; i++) {
      newboxes.push([]);
      for (let j = 0; j < rows - 1; j++) {
        newboxes[i].push(myGrid.boxes[i][j + 1]);
        newboxes[i][j].row--;
      }
    }
    rows--;
    myGrid.boxes = newboxes;
  } else if (dir == "S") {
    for (let i = 0; i < cols; i++) {
      newboxes.push(myGrid.boxes[i].slice(0, myGrid.boxes[i].length - 1));
    }
    rows--;
    myGrid.boxes = newboxes;
  }
  resizeCanvas(
    cols * gridSize + lineWeight * 8,
    rows * gridSize + lineWeight * 8
  );
  let sliderValue = select("#infobox");
  sliderValue.html(
    "Rutenett: " + gridSize + " px. Rader: " + rows + ". Kolonner: " + cols
  );
}

function addLine(dir) {
  if (dir == "N") {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        myGrid.boxes[i][j].row++;
      }
    }
    for (let i = 0; i < cols; i++) {
      myGrid.boxes[i].unshift(new Box(i, 0, 0));
    }
    rows++;
  } else if (dir == "W") {
    let firstcol = [];
    for (let j = 0; j < rows; j++) {
      firstcol.push(new Box(0, j, 0));
    }
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        myGrid.boxes[i][j].col++;
      }
    }
    myGrid.boxes.unshift(firstcol);
    cols++;
  } else if (dir == "E") {
    let lastcol = [];
    for (let j = 0; j < rows; j++) {
      lastcol.push(new Box(cols, j, 0));
    }
    myGrid.boxes.push(lastcol);
    cols++;
  } else if (dir == "S") {
    for (let i = 0; i < cols; i++) {
      myGrid.boxes[i].push(new Box(i, rows, 0));
    }
    rows++;
  }
  resizeCanvas(
    cols * gridSize + lineWeight * 8,
    rows * gridSize + lineWeight * 8
  );
  let sliderValue = select("#infobox");
  sliderValue.html(
    "Rutenett: " + gridSize + " px. Rader: " + rows + ". Kolonner: " + cols
  );
}
