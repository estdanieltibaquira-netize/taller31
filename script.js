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