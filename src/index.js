import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

//some hot module replacement
if (module.hot) {
    module.hot.accept()
}

// canvas
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d");

// DOM
const color = document.getElementById('color')
const size = document.getElementById('size')
const tool = document.getElementById('tool')

let current;
let inputs = [];

const tools = {
    graffiti: {
        mousemove(e){
            var x = e.clientX;     // Get the horizontal coordinate
            var y = e.clientY;
            (e.buttons & 1) && new Circle(x,y, +size.value, color.value)
        }
    },
    circle: {
        mousedown(e) {
            current = new Circle(e.clientX,e.clientY, +size.value, color.value)
            inputs.push(current);
        },
    },
}

function Drawable(){
    Drawable.addInstance(this);
}

Drawable.instances = [];
Drawable.addInstance = function(item){
    Drawable.instances.push(item);
}
Drawable.prototype.draw = function(){};

Drawable.forAll = function(callback){
    for(var i = 0; i<Drawable.instances.length;i++){
        callback(Drawable.instances[i])
    }
}

Drawable.drawAll = function(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    Drawable.forAll(item => item.draw())
}

// ### Classes
class Circle extends Drawable {
    constructor (x,y,radius,color){
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

        this.draw();
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        // ctx.strokeStyle = this.color;
        // ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}


// new Circle(90,90,10, "red")


// ### Event handlers

function superHandler(evt) {
    let t = tools[tool.value]
    if (typeof t[evt.type] === 'function') t[evt.type].call(this,evt)
}

canvas.onmousemove = superHandler;
canvas.onmouseup = superHandler;
canvas.onmousedown = superHandler;
canvas.onclick = superHandler;


// ###
serviceWorker.unregister(); //I'll check it later
