// obtiene canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// cambia origen a abajo izquierda
ctx.translate(0, canvas.height);
ctx.scale(1, -1);

// dibuja linea pixel a pixel (Bresenham)
function drawLine(x0, y0, x1, y1) {

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);

    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;

    let err = dx - dy;

    while (true) {
        ctx.fillRect(x0, y0, 1, 1); // dibuja pixel

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

// dibuja ventana de recorte
function drawViewport(xmin, ymin, xmax, ymax) {

    drawLine(xmin, ymin, xmax, ymin);
    drawLine(xmax, ymin, xmax, ymax);
    drawLine(xmax, ymax, xmin, ymax);
    drawLine(xmin, ymax, xmin, ymin);
}

// lineas de prueba
let lineas = [
    {x0: 120, y0: 120, x1: 250, y1: 200}, // dentro
    {x0: 50, y0: 50, x1: 80, y1: 80},     // fuera
    {x0: 50, y0: 150, x1: 350, y1: 150},  // horizontal
    {x0: 200, y0: 50, x1: 200, y1: 350},  // vertical
    {x0: 50, y0: 50, x1: 350, y1: 300}    // diagonal
];

// ventana de recorte
let xmin = 100, ymin = 100, xmax = 300, ymax = 250;

// codigos de region
const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;

// calcula codigo de un punto
function getCode(x, y) {

    let code = INSIDE;

    if (x < xmin) code |= LEFT;
    else if (x > xmax) code |= RIGHT;

    if (y < ymin) code |= BOTTOM;
    else if (y > ymax) code |= TOP;

    return code;
}

// algoritmo Cohen-Sutherland
function cohenSutherland(x0, y0, x1, y1) {

    let code0 = getCode(x0, y0);
    let code1 = getCode(x1, y1);

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
                code0 = getCode(x0, y0);
            } else {
                x1 = x;
                y1 = y;
                code1 = getCode(x1, y1);
            }
        }
    }

    if (accept) {
        drawLine(x0, y0, x1, y1);
    }
}

// limpia canvas correctamente
function clear() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// indice de escena
let index = 0;

// dibuja escena
function render() {

    clear();

    // viewport
    ctx.fillStyle = "blue";
    drawViewport(xmin, ymin, xmax, ymax);

    let l = lineas[index];

    // linea original
    ctx.fillStyle = "gray";
    drawLine(l.x0, l.y0, l.x1, l.y1);

    // linea recortada
    ctx.fillStyle = "red";
    cohenSutherland(l.x0, l.y0, l.x1, l.y1);
}

// siguiente linea
function next() {
    index = (index + 1) % lineas.length;
    render();
}

// linea anterior
function prev() {
    index = (index - 1 + lineas.length) % lineas.length;
    render();
}

// primera ejecución
render();
// actualiza viewport desde inputs
function update() {

    let nxmin = parseInt(document.getElementById("xmin").value);
    let nymin = parseInt(document.getElementById("ymin").value);
    let nxmax = parseInt(document.getElementById("xmax").value);
    let nymax = parseInt(document.getElementById("ymax").value);

    // evita NaN
    if (!isNaN(nxmin)) xmin = nxmin;
    if (!isNaN(nymin)) ymin = nymin;
    if (!isNaN(nxmax)) xmax = nxmax;
    if (!isNaN(nymax)) ymax = nymax;

    render(); // redibuja
}