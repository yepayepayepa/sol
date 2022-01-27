const __model = {};

let t = 0;
let spin = 0;

let nextBeat = 0;

const COLOR_DARK  = "#0C0D0D";
const COLOR_LIGHT = "#FDFDFB";

const COLORS = [ 
    "#ECE3D1",
    "#EA3380", 
    "#0099CF",
    "#C1C1C1",
    "#FFEC00",
    "#0400CF",
    "#56E3E8",
    "#1DD119",
    "#F3AACC",
    "#EBFF00",
    "#FCAC4E",
    "#E21E0C",
    "#007AAE",
    "#B2904D"
];

function setup() {
    pseudorandom.fxhash();
    features = calculateFeatures();

    const selectedColors = pseudorandom.selectIntegersFromRange(pseudorandom.integer(2, 7), 1, COLORS.length);
    __model.colorPalette = [];
    for(index in selectedColors) {
        __model.colorPalette.push(COLORS[selectedColors[index] - 1]);
    }
    
    if(features["Star"] === "White") {
        __model.mainColor = COLOR_LIGHT;
        __model.colorPalette.unshift(__model.mainColor);
    }
    if(features["Star"] === "Black") {
        __model.mainColor = COLOR_DARK;
        __model.colorPalette.unshift(__model.mainColor);
    }
    if(features["Star"] === "Color") {
        __model.mainColor = __model.colorPalette[0];
    }


    __model.speeds = [];
    __model.offset = [];
    for (let j = __model.colorPalette.length - 1; j >= 0; j--) {
        __model.speeds[__model.colorPalette[j]] = pseudorandom.decimal(0.5, 1.5);
        __model.offset[__model.colorPalette[j]] = pseudorandom.decimal(0, TWO_PI);
    }
    
    __model.maxSize = pseudorandom.decimal(0.1618, 0.5);
    
    __model.numberOfRays = features["Rays"];
    __model.speed = sqrt(__model.numberOfRays / 70);
    const widths = pseudorandom.integers(__model.numberOfRays, 10, 100);
    let total = widths.reduce((a, b) => a + b);
    __model.rays = [];

    let pickedColor = null;
    let lastPosition = 0;
    let endPosition; 
    for (let i = 0; i < widths.length; i++) {
        pickedColor = pseudorandom.pickButNot(__model.colorPalette, [pickedColor]);
        endPosition = lastPosition + TWO_PI * widths[i] / total;
        (__model.rays[pickedColor] = __model.rays[pickedColor] || []).push({
            color: pickedColor,
            start: lastPosition,
            end: endPosition,
        });
        lastPosition = endPosition;
    }

    focusIris();

    createCanvas(windowWidth, windowHeight);}

function draw() {
    background(0);
    const length = sqrt(pow(width, 2) + pow(height, 2));

    translate(width / 2, height / 2);
    let p = 0;
    let a = spin;

    for (let j = __model.colorPalette.length - 1; j >= 0; j--) {
        const color = __model.colorPalette[j];
        
        rays = __model.rays[color];

        a = __model.speeds[color] * spin * (j % 2 ? 1 : -1) + __model.offset[color];
        for (let i = 0; i < rays.length; i++) {
            const r = rays[i].width;
            noStroke();
            fill(rays[i].color);
    
            const x = i * 0.1;
            triangle(0, 0, 
                cos(a + rays[i].start) * length, sin(a + rays[i].start) * length, 
                cos(a + rays[i].end) * length, sin(a + rays[i].end) * length);
            p += r;
        }

        noStroke();
        fill(color);
        rays.diameter += (rays.finalSize - rays.diameter) / 70;
        circle(0, 0, dimensionless(rays.diameter));
    }
    spin += (features["Spin"] == "Left" ? 1 : -1 ) / 2000;
    if(t++ > nextBeat) {
        focusIris();
    }
}

function focusIris() {
    let diameters = pseudorandom.integers(Object.keys(__model.rays).length - 1, 5, 100);
    const centerSize = pseudorandom.integer(50, 1000);
    diameters.unshift(centerSize);
    const totalSeps = diameters.reduce((a, b) => a + b);
    const size = __model.maxSize + pseudorandom.decimal(0, 0.02) - 0.01;
    diameters = diameters.map(d => size * d / totalSeps);

    let subtotalDiameters = 0;
    for (let j = 0; j < __model.colorPalette.length; j++) {
        subtotalDiameters += diameters[j];
        const color = __model.colorPalette[j];
        __model.rays[color].finalSize = subtotalDiameters;
        __model.rays[color].diameter = __model.rays[color].diameter || min((j + 1) * 0.12, 0.4);
    }

    nextBeat += pseudorandom.integer(50, 100);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

/***********
 *
 *  Behavior functions
 *
 *****/

// Saves the artwork as an image when the S key is pressed
function keyPressed() {
    if (key == 's' || key == 'S') saveCanvas('sol_' + fxhash, 'png');
  }
  