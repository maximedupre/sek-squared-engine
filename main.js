window.addEventListener('DOMContentLoaded', () => {
    const points = [
        [0, 0],
        [0, 100],
        [100, 100],
        [100, 0],
        [0, 0],
    ];
    const canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw(canvas, POINTS);

    document.querySelector('input').addEventListener('input', (e) => {
        const tetha = e.target.value;
        const newPoints = [];

        for (let point of POINTS) {
            const x = point[0];
            let y;

            if (point[1] > 50) {
                y = (-5 / 9) * tetha + point[1];
            } else {
                y = (5 / 9) * tetha + point[1];
            }

            newPoints.push([x, y]);
        }

        draw(canvas, newPoints);
    });
});

function draw(canvas, points) {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let point of points) {
        ctx.lineTo(point[0], point[1]);
    }

    ctx.stroke();
}
