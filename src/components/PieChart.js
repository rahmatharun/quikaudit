import React from 'react'
const actualpixel = 2480;


var ConstColors = [
    ["#33ff33", "#33ff33"], // blue
    ["#ffff4d", "#ffff4d"], // yellow green
    ["#ffb84d", "#ffb84d"], // yellow
    ["#ac7339", "#ac7339"], // orange
    ["#ff1a1a", "#ff1a1a"], // red
    ["#e2bcbd", "#9e2126"] // purple
];

export default class PieChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            includeLabels: false,
            legendset: "none",
            data: [30, 70, 45, 65, 20, 130],
            labels: ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"],
            legend: [],
            colors: [
                ["#33ff33", "#33ff33"], // blue
                ["#ffff4d", "#ffff4d"], // yellow green
                ["#ffb84d", "#ffb84d"], // yellow
                ["#ac7339", "#ac7339"], // orange
                ["#ff1a1a", "#ff1a1a"], // red
                ["#e2bcbd", "#9e2126"] // purple
            ],
            csswidth: 100,
            cssheight: 100,
        }

    }
    componentDidMount() {
        this.draw();
    }
    componentDidUpdate(prevProps) {

        if (prevProps.data !== this.props.data) {
            this.draw();
        }
    }


    render() {
        return (<div style={{ display: 'flex', justifyContent: 'center' }}>
            <canvas ref="canvas" width={640} height={425} style={{ width: this.state.csswidth, height: this.state.cssheight }} />
        </div>)
    }

    draw() {
        const{value,label,legend,colors}=this.props.data;
        
        ConstColors=colors;
        const self = this;
        const context = this.refs.canvas.getContext("2d");
        context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);

        let calwidth = 0.9 * actualpixel;
        let calheight = 0;
        let csswidth = 0.9 * window.innerWidth;
        let cssheight = 0;
        if (this.props.legendset) {
            if (this.props.legendset === "right") {
                calheight = 0.675 * actualpixel;
                cssheight = 0.675 * window.innerWidth;
            }
            else{
            calheight = calwidth;
            cssheight = csswidth;}
        } else {
            calheight = 0.85 * actualpixel;
            cssheight = 0.85 * window.innerWidth;
        }

        self.setState({ csswidth: csswidth, cssheight: cssheight });

        context.canvas.height = calheight;
        context.canvas.width = calwidth;
       
        value.forEach( (item, index, arr) => {
            drawSegment(this.refs.canvas, context, arr, index, item, false, label, this.props.legendset?legend:[], this.props.legendset?this.props.legendset:null);
        
       });
    }




    // helper functions
    degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }

    sumTo(a, i) {
        var sum = 0;
        for (var j = 0; j < i; j++) {
            sum += a[j];
        }
        return sum;
    }
}


export const PieChartImg = async (data, labels, legend, legendset) => {
    return new Promise((resolve, reject) => {
        try {
            let canvas = document.createElement('CANVAS');
            let ctx = canvas.getContext('2d');
            let calwidth = 0.9 * actualpixel;
            let calheight = 0;

            if (legendset === "right") {
                calheight = 0.675 * actualpixel;
            } else {
                calheight = 1.3 * actualpixel;
            }

            ctx.canvas.height = calheight;
            ctx.canvas.width = calwidth;

            data.forEach( (item, index, arr) => {
                 drawSegment(canvas, ctx, arr, index, item, false, labels, legend, legendset);
            });
            let chart = canvas.toDataURL();
            resolve(chart);


        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}
export const PieChartImg2 = async (chartdata, legendset) => {
    return new Promise((resolve, reject) => {
        try {
            ConstColors=chartdata.colors
            let data=chartdata.value;
            let labels=chartdata.label
            let legend=chartdata.legend
            let canvas = document.createElement('CANVAS');
            let ctx = canvas.getContext('2d');
            let calwidth = 0.9 * actualpixel;
            let calheight = 0;

            if (legendset === "right") {
                calheight = 0.675 * actualpixel;
            } else {
                calheight = 1.3 * actualpixel;
            }

            ctx.canvas.height = calheight;
            ctx.canvas.width = calwidth;

            data.forEach( (item, index, arr) => {
                 drawSegment(canvas, ctx, arr, index, item, false, labels, legend, legendset);
            });
            let chart = canvas.toDataURL();
            resolve(chart);


        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

const drawSegment =  (canvas, context, data, i, size, isSelected, labels, legend, legendset) => {
   
            context.save();
            var centerX = 0;
            var centerY = 0;
            var radius = 0;

            if (legend.length < 1) {
                centerX = Math.floor(canvas.width / 2);
                centerY = Math.floor(canvas.height / 2);
                radius = Math.floor(canvas.width / 3);
            } else if (legendset === "right") {
                centerX = Math.floor(canvas.width / 3);
                centerY = Math.floor(canvas.height / 2);
                radius = Math.floor(canvas.width / 4);
            } else {
                centerX = Math.floor(canvas.width / 2);
                centerY = Math.floor(canvas.height / 2.5);
                radius = Math.floor(canvas.width / 3);
            }

            let startingAngle = degreesToRadians(sumTo(data, i));
            let arcSize = degreesToRadians(size);
            let endingAngle = startingAngle + arcSize;

            if (arcSize>0){
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
            context.closePath();

            isSelected ?
                context.fillStyle = ConstColors[i][1] :
                context.fillStyle = ConstColors[i][0];

            context.strokeStyle = ConstColors[i][0];
            context.lineWidth = 0;
            context.stroke();
            context.fill();
            context.restore();
            if (labels.length > i) {
                 drawSegmentLabel(canvas, context, data, i, labels, legend, legendset, size, { radius: radius, x: centerX, y: centerY });
            }

            if ((legend.length > i) && legendset !== "none") {
                 drawsegmentLegend(canvas, context, i, legend, legendset);
            }}
       
}

const sumTo = (a, i) => {
    var sum = 0;
    for (var j = 0; j < i; j++) {
        sum += a[j];
    }
    return sum;
}

const drawsegmentLegend = (canvas, context, i, legend, legendset) => {
  
            context.save();

            context.beginPath();
            let fontSize = Math.floor(canvas.height / 35);
            context.font = fontSize + "pt Helvetica";
            if (legendset === "right") {

                // context.font = "12px Arial";
                let bricksize = Math.floor(canvas.width / 25)

                context.fillText(legend[i], Math.floor((canvas.width / 3) * 2) + (bricksize * 2.5), Math.floor(canvas.height / 4) + ((i + 1) * bricksize * 1.2));

                context.fillStyle = ConstColors[i][0];

                context.fillRect(Math.floor((canvas.width / 3) * 2) + bricksize, Math.floor(canvas.height / 4) + ((i + 1) * bricksize * 1.2) - bricksize * 0.8, bricksize, bricksize);

            } else {

                let bricksize = Math.floor(canvas.height / 25)
                let fontSize = Math.floor(canvas.height / 35);
                context.font = fontSize + "pt Helvetica";

                context.fillText(legend[i], bricksize * 2.5, Math.floor((canvas.height / 1.4) + ((i + 1) * bricksize * 1.2)));

                context.fillStyle = ConstColors[i][0];

                context.fillRect(bricksize, Math.floor((canvas.height / 1.4) + ((i + 1) * bricksize * 1.2)) - bricksize * 0.8, bricksize, bricksize);
            }
            context.restore();
        

}

const drawSegmentLabel = (canvas, context, data, i, labels, legend, legendset, size, pie) => {
  
            context.save();
            context.beginPath();
            if (labels[i] != "0.00%") {

                let x = pie.x;
                let y = pie.y
                let angle;
                let angleD = sumTo(data, i);
                let radius = pie.radius;


                context.translate(x, y);
                context.textAlign = "left";
                angle = degreesToRadians(angleD) + (degreesToRadians(size) / 2);

                var fontSize = Math.floor(canvas.height /35 );
                context.font = fontSize + "pt Helvetica";

                var x1 = 0.8 * radius * Math.cos(angle),
                    y1 = 0.8 * radius * Math.sin(angle);

                var x2 = 1.1 * radius * Math.cos(angle),
                    y2 = 1.1 * radius * Math.sin(angle);


                var x3 = (1.3 * radius * Math.cos(angle)) - Math.floor((canvas.height / 35) * 2),
                    y3 = (1.3 * radius * Math.sin(angle)) + (Math.floor(canvas.height / 35) / 2);
                // var x2 = dx * Math.cos(angle),
                //     y2 = dy * Math.sin(angle);
                //  context.fillText(this.props.labels[i], dx, dy);
                // context.rotate(-angle)

                context.strokeStyle = "#000000";
                context.lineWidth = 5;
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();

                context.fillText(labels[i], x3, y3);

            }

            context.restore();

        
}

const degreesToRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
}