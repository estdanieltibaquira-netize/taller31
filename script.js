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