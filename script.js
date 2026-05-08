const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// sistema de coordenadas
ctx.translate(0, canvas.height);
ctx.scale(1, -1);

// dibuja linea (Bresenham)
function drawLine(x0, y0, x1, y1) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);

    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;

    let err = dx - dy;

    while (true) {
        ctx.fillRect(x0, y0, 1, 1);

        if (x0 === x1 && y0 === y1) break;

        let e2 = 2 * err;

        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }

        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}
// recorta linea
function cohenSutherland(x0, y0, x1, y1, xmin, ymin, xmax, ymax) {

    let code0 = getCode(x0, y0, xmin, ymin, xmax, ymax);
    let code1 = getCode(x1, y1, xmin, ymin, xmax, ymax);

    let accept = false;

    while (true) {

        if ((code0 | code1) === 0) {
            accept = true;
            break;
        } 
        else if (code0 & code1) {
            break;
        } 
        else {

            let x, y;
            let codeOut = code0 ? code0 : code1;

            if (codeOut & TOP) {
                x = x0 + (x1 - x0) * (ymax - y0) / (y1 - y0);
                y = ymax;
            } 
            else if (codeOut & BOTTOM) {
                x = x0 + (x1 - x0) * (ymin - y0) / (y1 - y0);
                y = ymin;
            } 
            else if (codeOut & RIGHT) {
                y = y0 + (y1 - y0) * (xmax - x0) / (x1 - x0);
                x = xmax;
            } 
            else if (codeOut & LEFT) {
                y = y0 + (y1 - y0) * (xmin - x0) / (x1 - x0);
                x = xmin;
            }

            if (codeOut === code0) {
                x0 = x;
                y0 = y;
                code0 = getCode(x0, y0, xmin, ymin, xmax, ymax);
            } else {
                x1 = x;
                y1 = y;
                code1 = getCode(x1, y1, xmin, ymin, xmax, ymax);
            }
        }
    }

    if (accept) {
        drawLine(x0, y0, x1, y1);
    }
}
// ventana
let xmin = 100, ymin = 100, xmax = 300, ymax = 250;

// dibuja viewport
drawViewport(xmin, ymin, xmax, ymax);

// dibuja lineas recortadas
for (let l of lineas) {
    cohenSutherland(l.x0, l.y0, l.x1, l.y1, xmin, ymin, xmax, ymax);
}
let index = 0;

// limpia canvas
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// dibuja escena actual
function render() {
    clear();

    drawViewport(xmin, ymin, xmax, ymax);

    let l = lineas[index];
    cohenSutherland(l.x0, l.y0, l.x1, l.y1, xmin, ymin, xmax, ymax);
}

function next() {
    index = (index + 1) % lineas.length;
    render();
}

function prev() {
    index = (index - 1 + lineas.length) % lineas.length;
    render();
}

// primera escena
render();
// viewport
function drawViewport(xmin, ymin, xmax, ymax) {
    drawLine(xmin, ymin, xmax, ymin);
    drawLine(xmax, ymin, xmax, ymax);
    drawLine(xmax, ymax, xmin, ymax);
    drawLine(xmin, ymax, xmin, ymin);
}

// datos
let lineas = [
    {x0: 100, y0: 100, x1: 200, y1: 200},
    {x0: -50, y0: -50, x1: -10, y1: -10},
    {x0: 50, y0: 50, x1: 300, y1: 300},
    {x0: 300, y0: 50, x1: 50, y1: 300},
    {x0: 150, y0: -50, x1: 150, y1: 300}
];

// ventana
let xmin = 100, ymin = 100, xmax = 300, ymax = 250;

// dibujar
ctx.fillStyle = "blue";
drawViewport(xmin, ymin, xmax, ymax);

ctx.fillStyle = "red";
for (let l of lineas) {
    cohenSutherland(l.x0, l.y0, l.x1, l.y1, xmin, ymin, xmax, ymax);
}
