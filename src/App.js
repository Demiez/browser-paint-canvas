import React, {Component} from 'react';
import './App.css';

const CanvasWindow = p =>
    <canvas id="canvas" width="500" height="500">
        {p.children}
    </canvas>

const CanvasNotSupported = () =>
    <section>
    <h2>
        Attention
    </h2>
    <p>
        Unfortunately, your browser does not support the HTML5 canvas tag. Please visit your browser's website and update it. An active area for painting should be displayed in this tag
    </p>
    </section>

const Container = (p) =>
    <div id="container">
        {p.children}
    </div>

const inputs = [
    {
        type: "color",
        id: 'color',
        placeholder: null,
    },
    {
        type: 'number',
        id: 'size',
        placeholder: 'Size',
    }
]

const tools = {
    name: 'tools',
    id: 'tool',
    children: ['graffiti', 'circle', 'line', 'select'],
}

const buttons = [
    {
        name: 'Undo',
        id: 'undo'
    },
    {
        name: 'Delete',
        id: 'del'
    }
]

class App extends Component {
    render() {
        return (
            <div className="App">
               <CanvasWindow>
                   <CanvasNotSupported/>
               </CanvasWindow>
                <Container>
                    {inputs.map(item =>
                        <input key={`${item.id}`} type={item.type} id={item.id} placeholder={item.placeholder} />
                    )}
                    <select name={tools.name} id={tools.id}>
                        {tools.children.map(item =>
                            <option key={`${item}`} value={item}>{item}</option>
                        )}
                    </select>
                    {buttons.map(item =>
                       <button key={`${item.id}`} id={item.id}>{item.name}</button>
                    )}
                </Container>
            </div>
        );
    }
}

export default App;
