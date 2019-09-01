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
const undo = document.getElementById('undo')

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
        mousemove(e) {
            if (!current) return;

            current.radius = (current.distanceTo(e.clientX, e.clientY))
            Drawable.drawAll()
        },
        mouseup(e) {
            current = null;
        }
    },
    line: {
        mousedown(e) {
            current = new Line(e.clientX,e.clientY, 0, 0, color.value, +size.value)
        },
        mousemove(e) {
            if (!current) return;

            current.width = e.clientX - current.x
            current.height = e.clientY - current.y

            Drawable.drawAll()
        },
        mouseup(e) {
            current = null;
        }
    },
    rectangle : {
        mousedown(e) {
            current = new Rectangle(e.clientX,e.clientY, 1, 1, color.value)
        },
        mousemove(e) {
            if (!current) return;

            current.width = e.clientY - current.y
            current.height = e.clientX - current.x

            Drawable.drawAll()
        },
        mouseup(e) {
            current = null;
        }
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

// ### distance block
const distance = (x1,y1,x2,y2) => ((x1-x2)**2 + (y1-y2)**2)**0.5;

Drawable.prototype.distanceTo = function(x,y){
    if (typeof this.x !== 'number' ||
        typeof this.y !== 'number'){
        return NaN
    }
    return distance (this.x, this.y, x,y)
};

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

class Line extends Drawable {
    constructor(x, y, width, height, color, lineWidth) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.lineWidth = lineWidth;

        this.draw();
    }
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    }
}

class Rectangle extends Drawable {
    constructor(x, y, width, height, color) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        this.draw();
    }
    draw(){
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.height, this.width );
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}


// new Circle(90,90,10, "red")


// ### Event handlers
undo.onclick = function(){
    Drawable.instances.pop();
    //Drawable.instances = []
    Drawable.drawAll()
};

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
