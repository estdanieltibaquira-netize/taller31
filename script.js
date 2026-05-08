const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


ctx.fillStyle = "red";
ctx.fillRect(50, 50, 10, 10);
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// cambiar sistema de coordenadas
ctx.translate(0, canvas.height);
ctx.scale(1, -1);


ctx.fillStyle = "red";
ctx.fillRect(50, 50, 10, 10);

// dibuja linea pixel a pixel
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
// dibuja rectangulo de recorte
function drawViewport(xmin, ymin, xmax, ymax) {

    drawLine(xmin, ymin, xmax, ymin);
    drawLine(xmax, ymin, xmax, ymax);
    drawLine(xmax, ymax, xmin, ymax);
    drawLine(xmin, ymax, xmin, ymin);
}
// lineas de prueba (5 casos)
let lineas = [
    {x0: 100, y0: 100, x1: 200, y1: 200}, // dentro
    {x0: -50, y0: -50, x1: -10, y1: -10}, // fuera
    {x0: 50, y0: 50, x1: 300, y1: 300},   // cruza
    {x0: 300, y0: 50, x1: 50, y1: 300},   // diagonal
    {x0: 150, y0: -50, x1: 150, y1: 300}  // vertical
];
// codigos binarios
const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;

// calcula region del punto
function getCode(x, y, xmin, ymin, xmax, ymax) {

    let code = INSIDE;

    if (x < xmin) code |= LEFT;
    else if (x > xmax) code |= RIGHT;

    if (y < ymin) code |= BOTTOM;
    else if (y > ymax) code |= TOP;

    return code;
}