let myGrid;
let cols = 20;
let rows = 10;
let cellSize = 30;
let showGrid = true;
let useCircles = false;
let lineWeight = 2;
let curColor = 1;
let colors;
let canvas;
let gridSizeSlider;
let colorBtn;
let resetText;

function setup() {
  canvas = createCanvas(
    cellSize * cols + lineWeight * 8,
    cellSize * rows + lineWeight * 8
  );
  canvas.parent("divcanvas");
  canvas.elt.style.touchAction = "none";
  displayWelcomeText();
  canvas.elt.setAttribute("tabindex", "0");
  canvas.elt.style.outline = "none";
  canvas.elt.focus();

  canvas.mousePressed(() => {
    canvas.elt.focus();
  });

  colorMode(HSB);
  colors = [
    color(255, 0),
    color(220, 30, 100),
    color(120, 20, 90),
    color(340, 30, 90),
  ];
  loadData();
  controls();
}

function draw() {
  background(255);
  checkMouse();
  myGrid.show();
}

function rescaleGrid() {
  lineWeight = ceil(cellSize / 20);
  storeItem("storedGrid", myGrid.boxes);
  storeItem("storedCellSize", cellSize);
}

function loadData() {
  let storedGrid = getItem("storedGrid");
  let storedCellSize = getItem("storedCellSize");
  if (storedCellSize !== null) {
    cellSize = round(storedCellSize);
  }
  myGrid = new Grid();
  if (storedGrid !== null) {
    while (storedGrid.length > myGrid.boxes.length) {
      addLine("E");
    }
    while (storedGrid[0].length > myGrid.boxes[0].length) {
      addLine("S");
    }
    while (storedGrid.length < myGrid.boxes.length) {
      removeLine("E");
    }
    while (storedGrid[0].length < myGrid.boxes[0].length) {
      removeLine("S");
    }
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (typeof storedGrid[i][j] != "undefined") {
          myGrid.boxes[i][j] = new Box(
            storedGrid[i][j].col,
            storedGrid[i][j].row,
            storedGrid[i][j].colorIndex
          );
        }
      }
    }
  }
}

function checkMouse() {
  if (mouseIsPressed) {
    let col = floor(mouseX / cellSize);
    let row = floor(mouseY / cellSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      if (mouseButton == LEFT) {
        myGrid.boxes[col][row].setColor(-1);
      } else if (mouseButton == RIGHT) {
        myGrid.boxes[col][row].setColor(-1);
      }
      storeItem("storedGrid", myGrid.boxes);
    }
  }
  if (keyIsPressed) {
    let col = floor(mouseX / cellSize);
    let row = floor(mouseY / cellSize);

    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      if (key == "q") {
        myGrid.boxes[col][row].setColor(1);
      } else if (key == "w") {
        myGrid.boxes[col][row].setColor(2);
      } else if (key == "e") {
        myGrid.boxes[col][row].setColor(3);
      } else if (key == "r") {
        myGrid.boxes[col][row].setColor(0);
      }
      storeItem("storedGrid", myGrid.boxes);
    }
  }
}

function keyPressed() {
  if (key == " ") {
    showGrid = !showGrid;
  } else if (key == "s") {
    saveCanvas("figurtall", "png");
  } else if (key == "p") {
    resetCanvas();
  } else if (key == "f") {
    curColor = (curColor + 1) % colors.length;
    colorBtn.style("background", colors[curColor]);
  } else if (keyCode === UP_ARROW && keyIsDown(SHIFT)) {
    removeLine("N");
  } else if (keyCode === UP_ARROW) {
    addLine("N");
  } else if (keyCode === RIGHT_ARROW && keyIsDown(SHIFT)) {
    removeLine("E");
  } else if (keyCode === RIGHT_ARROW) {
    addLine("E");
  } else if (keyCode === DOWN_ARROW && keyIsDown(SHIFT)) {
    removeLine("S");
  } else if (keyCode === DOWN_ARROW) {
    addLine("S");
  } else if (keyCode === LEFT_ARROW && keyIsDown(SHIFT)) {
    removeLine("W");
  } else if (keyCode === LEFT_ARROW) {
    addLine("W");
  }
}

function resetCanvas() {
  removeItem("storedGrid");
  removeItem("storeGridSize");
  myGrid = new Grid();
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
    cols * cellSize + lineWeight * 8,
    rows * cellSize + lineWeight * 8
  );
  let sliderValue = select("#infobox");
  sliderValue.html(
    "Cellestørrelse: " +
      cellSize +
      " px. Rader: " +
      rows +
      ". Kolonner: " +
      cols
  );
  storeItem("storedGrid", myGrid.boxes);
  storeItem("storedCellSize", cellSize);
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
    cols * cellSize + lineWeight * 8,
    rows * cellSize + lineWeight * 8
  );
  let sliderValue = select("#infobox");
  sliderValue.html(
    "Cellestørrelse: " +
      cellSize +
      " px. Rader: " +
      rows +
      ". Kolonner: " +
      cols
  );
  storeItem("storedGrid", myGrid.boxes);
  storeItem("storedCellSize", cellSize);
}

function controls() {
  let showBtn = createButton("<b>Space</b> (rutenett)");
  colorBtn = createButton("<b>F</b> (farge)");
  colorBtn.style("background", colors[curColor]);
  colorBtn.mousePressed(() => {
    curColor = (curColor + 1) % colors.length;
    colorBtn.style("background", colors[curColor]);
  });
  let saveBtn = createButton("<b>S</b> (lagre bilde)");
  let resetBtn = createButton("Tøm lerret");
  showBtn.mousePressed((it) => {
    showGrid = !showGrid;
  });
  saveBtn.mousePressed((it) => {
    saveCanvas("figurtall", "png");
  });
  resetBtn.mousePressed((it) => {
    resetCanvas();
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
  showBtn.parent("#buttons");
  colorBtn.parent("#buttons");
  saveBtn.parent("#buttons");
  resetBtn.parent("#buttons");
  circleBtn.parent("#buttons");
  // resetText.mousePressed(() => {
  //   resetCanvas();
  // });
  gridSizeSlider = createSlider(10, 60, 31);
  gridSizeSlider.parent("#slider");
  gridSizeSlider.input(() => {
    let oldGridSize = cellSize;
    cellSize = gridSizeSlider.value();
    resizeCanvas(
      cellSize * cols + lineWeight * 8,
      cellSize * rows + lineWeight * 8
    );
    rescaleGrid();
    sliderValue.html(
      "Cellestørrelse: " +
        gridSizeSlider.value() +
        " px. Rader: " +
        rows +
        ". Kolonner: " +
        cols
    );
  });
  let sliderValue = select("#infobox");
  sliderValue.html(
    "Cellestørrelse: " +
      cellSize +
      " px. Rader: " +
      rows +
      ". Kolonner: " +
      cols
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

function displayWelcomeText() {
  let dismissWelcome = getItem("dismissWelcome");
  if (dismissWelcome != "true") {
    select("#welcomeInfoContainer").show();
    select("#welcomeInfoContainer").style("display", "flex");
  }
}
