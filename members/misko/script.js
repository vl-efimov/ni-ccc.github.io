/** @type {HTMLCanvasElement} */

const canvasSectionsCount = 7;

const canvasSection = document.getElementById('generative_art');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 200);
const CANVAS_HEIGHT = (canvas.height = 500);

function generateLightColorHsl() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * (100 + 1)) + "%";
    const lightness = Math.floor((0.9 + Math.random()) * (100/2 + 1)) + "%";
    return "hsl(" + hue + ", " + saturation + ", " + lightness + ")";
}


function drawLine() {
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 40);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
    ctx.stroke();
}

let x1 = CANVAS_WIDTH/4
let x2 = CANVAS_WIDTH/4 * 3
let y1 = CANVAS_HEIGHT/2
let y2 = CANVAS_HEIGHT/2
ctx.strokeStyle = generateLightColorHsl();


function drawCurvedLine() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(10,20,CANVAS_WIDTH - 20, CANVAS_HEIGHT - 40);
    x1 += Math.sin(Math.random() * 1000) * 10;
    x2 += Math.sin(Math.random() * 1000) * 10;
    y1 += Math.sin(Math.random() * 1000) * 10;
    y2 += Math.sin(Math.random() * 1000) * 10;
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 40);
    ctx.bezierCurveTo( x1, y1, x2, y2 , CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
    ctx.stroke();
}

function addBackground() {
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(10,20,CANVAS_WIDTH - 20, CANVAS_HEIGHT - 40);
}

function reveal() {
    const canvasSectionHeight = Math.floor(canvasSection.style.height.slice(0, -2) * window.innerHeight * 0.01);
    const reveals = [...document.getElementsByClassName("reveal")];
    const canvasSectionTop = canvasSection.getBoundingClientRect().top;

    reveals.forEach((reveal, i) => {
        if (canvasSectionTop <= (canvasSectionHeight/canvasSectionsCount * i) * -1) {
            reveal.classList.remove("hidden");
            reveal.classList.add("active");
            if (!(canvasSectionTop <= (canvasSectionHeight/canvasSectionsCount * (i + 1) * -1))) {
                if (i === 1) canvas.classList.add('active');
                if (i === 2) addBackground();
                if (i === 3) drawLine();
                if (i === 4) drawCurvedLine();
            }
        }
        if (canvasSectionTop <= (canvasSectionHeight/canvasSectionsCount * (i + 1) * -1)) {
            reveal.classList.remove("active");
            reveal.classList.add("hidden");
        }
        if (canvasSectionTop >= (canvasSectionHeight/canvasSectionsCount * (i)) * -1) {
            reveal.classList.remove("active");
            reveal.classList.remove("hidden");
        }
    })               
}

window.addEventListener("scroll", reveal);

// To check the scroll position on page load
reveal();


// sections
const sections = [...document.getElementsByTagName("section")];

sections.forEach((section, i) => {
    if (i === 0) {
        section.style.background = '#fff';
    }
    else {
        section.style.background = generateLightColorHsl();
    }
    if (section.id === 'generative_art') {
        section.style.height = `${canvasSectionsCount}00vh`;
    }
    if (i > 3) {
        i += (canvasSectionsCount-1);
    }
    section.style.top = `${98 * i}vh`;
});