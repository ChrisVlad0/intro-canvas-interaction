const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let mouseX = 0, mouseY = 0;

// Ajustar dimensiones del canvas
canvas.height = window.innerHeight / 1.5;
canvas.width = window.innerWidth / 1.5;
canvas.style.background = "#ff8";

// Obtener coordenadas del mouse
canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener("click", () => {
    circles = circles.filter(circle => getDistance(mouseX, mouseY, circle.posX, circle.posY) >= circle.radius);
});

class Circle {
    constructor(x, y, radius, color, text, speedX, speedY) {
        Object.assign(this, { posX: x, posY: y, radius, color, originalColor: color, text, dx: speedX, dy: speedY });
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.stroke();
        context.closePath();
    }

    update(context, circles) {
        this.draw(context);
        this.posX += this.dx;
        this.posY -= this.dy;

        for (const circle of circles) {
            if (circle !== this && getDistance(this.posX, this.posY, circle.posX, circle.posY) < (this.radius + circle.radius)) {
                [this.dx, this.dy, circle.dx, circle.dy] = [circle.dx, circle.dy, this.dx, this.dy];
                [this.color, circle.color] = ["red", "red"];
            }
        }
    }
}

function getDistance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

let circles = [];

for (let i = 0; i < 6; i++) {
    let randomRadius, randomX, randomY;
    do {
        randomRadius = Math.floor(Math.random() * 100 + 30);
        randomX = Math.random() * (canvas.width - 2 * randomRadius) + randomRadius;
        randomY = canvas.height - 2 * randomRadius;
    } while (circles.some(circle => getDistance(randomX, randomY, circle.posX, circle.posY) < (randomRadius + circle.radius)));

    circles.push(new Circle(randomX, randomY, randomRadius, "blue", (i + 1).toString(), (Math.random() - 0.5) * 2, Math.random() * 2 + 1));
}

function updateCircles() {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const circle of circles) {
        circle.update(ctx, circles);
    }

    for (const circle of circles) {
        if (circle.color === "red" && !circles.some(other => circle !== other && getDistance(circle.posX, circle.posY, other.posX, other.posY) < (circle.radius + other.radius))) {
            circle.color = circle.originalColor;
        }
    }

    ctx.font = "bold 10px cursive";
    ctx.fillStyle = "black";
    ctx.fillText(`x: ${mouseX}`, 20, 10);
    ctx.fillText(`y: ${mouseY}`, 20, 25);
}

updateCircles();
