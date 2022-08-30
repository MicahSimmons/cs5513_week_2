"use strict";

var Model = {
    crayons: [ 
        { color: "black", hex: 0x000000 }
    ]
}

class Smudge extends React.Component {
    constructor (props) {
        super(props);
    }
    
    render () {
        let x = parseInt(this.props.x);
        let y = parseInt(this.props.y);

        let styleObj = {
            position: "absolute",
            width: "5px",
            height: "5px",
            background: this.props.color,
            left: x,
            top: y
        }
        return <div style={styleObj}></div>
    }
}
class Crayon extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            color: props.color,
            hex: props.hex
        }

        this.onClick = this.onClick.bind(this);
    }

    onClick () {
        this.props.cb(this.state.color, this.state.hex);
    }

    render () {
        let borderStyle = (this.props.active) ?  "5px solid black" : "1px dotted black";

        let styleObj = {
            background: this.state.hex,
            font_weight: "bold",
            border: borderStyle,
            padding: "10px"
        }
        return <tr><td style={styleObj} onClick={this.onClick}>{this.state.color}</td></tr>
    }
}
class CrayonBox extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            crayons: []
        }

        this.select = this.select.bind(this);
    }

    componentDidMount() {
        $.getJSON("api", (jsonData) => {
            this.state.crayons = jsonData.crayons;
            console.log(this.state)
            this.setState(this.state)
        })
    }

    select (newColor, newHex) {
        this.props.cb(newColor, newHex);
    }

    render () {
        let renderCrayons = this.state.crayons.map( (crayon) => <Crayon cb={this.select} 
                                                                   color={crayon.color} 
                                                                   hex={crayon.hex}
                                                                   active={(crayon.color == this.props.active)}
                                                                   key={crayon.color}/>)

        return <div className="crayonbox">
            <table style={{width:"100%"}}>
                <tbody style={{width:"100%"}}>
                  {renderCrayons}
                </tbody>
            </table>
        </div>;
    }
}

class Paper extends React.Component {
    constructor(props) {
        super(props);
        this.drawing = false;
        this.dots = [
        ];
        this.color = props.color;

        this.onMove = this.onMove.bind(this);
        this.down = this.down.bind(this);
        this.up = this.up.bind(this);
    }

    mkKey (dot) {
        return "x"+dot.x+"y"+dot.y;
    }

    onMove (event) {
        if (this.drawing) {
            let x = event.clientX /*  - event.target.offsetLeft */;
            let y = event.clientY - event.target.offsetTop;
            let dot = {
                x: x,
                y: y,
                color: this.props.color
            }

            console.log(dot)
            this.dots.push(dot)
            this.setState(this.dots);
        }
    }

    down () {
      this.drawing = true;
    }

    up () {
      this.drawing = false;
    }

    render () {
        let renderDots = this.dots.map( (dot, idx) => <Smudge x={dot.x} y={dot.y} color={dot.color} key={idx} /> )

        return <div className="paper" onMouseDown={this.down} onMouseUp={this.up} onMouseMove={this.onMove}>Click To Draw!
                  {renderDots}
               </div>
    }
}

class DoodleBoard extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            crayons: [],
            activeName: "White",
            activeColor: "rgb(255,255,255)"
        }

        this.setCrayons = this.setCrayons.bind(this);
        this.setColor = this.setColor.bind(this);
    }

    setCrayons (crayonData) {
        this.crayons = crayonData;
        this.setState(this.state);
    }
    
    setColor (newColor, hexVal) {
        console.log("Color:" + newColor + " Val:" + hexVal);
        this.state.activeColor = hexVal;
        this.state.activeName = newColor;
        this.setState(this.state);
    }

    render() {
        let styleObj = {
            display: "flex",
            flex_direction: "row",
            justify_content: "flex-start",
            height: "100%"
        }
        return <div style={styleObj}>
                <CrayonBox cb={this.setColor} active={this.state.activeName}/>
                <Paper color={this.state.activeColor}/>
               </div>;
    }
}

const root = ReactDOM.createRoot(document.getElementById('#appShell'));
root.render(<DoodleBoard />)