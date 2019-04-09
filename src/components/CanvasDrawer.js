import React from 'react';


export default class CanvasDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csswidth: 1,
            cssheight: 1,
            edited: false,
        };
    }
    componentDidMount() {

        this.loadcanvas();
    }

    render() {
        return (<div style={{ display: 'flex', justifyContent: 'center' }}>
            <canvas ref="canvas" width={640} height={425} onTouchEnd={this.touchEnd.bind(this)} onTouchMove={this.touchMove.bind(this)} onTouchStart={this.touchStart.bind(this)} style={{ width: this.state.csswidth, height: this.state.cssheight,backgroundColor:(this.props.bgcolor?this.props.bgcolor:"transparent") }} />
        </div>)
    }
    loadcanvas() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")
        this.ctx = canvas.getContext("2d");
        let thi$ = this;

        var img = new Image;
        //img.height =  ctx.canvas.height;
        //img.width = ctx.canvas.width;
        img.onload = () => {

            ctx.canvas.height = img.height;
            ctx.canvas.width = img.width;

            // ctx.drawImage(img,0,0); // Or at whatever offset you like
            //  ctx.canvas.width = this.width;
            //  ctx.canvas.height = this.height;
            let fixheight = window.innerHeight * 0.8
            let fixwidth = window.innerWidth * 0.9;
            let widthR = fixwidth / img.width;
            let heightR = fixheight / img.height;


            let ratios = Math.min(widthR, heightR)
            ratios = Math.floor(ratios * 100) / 100

            var calwidth = img.width * ratios;
            var calheight = img.height * ratios;
            thi$.setState({ csswidth: calwidth, cssheight: calheight })


            ctx.drawImage(img, 0, 0, img.width, img.height);// Or at whatever offset you like


            //    //  ctx.drawImage(img, 0, 0)
            //      ctx.font = "40px Courier"
            //      ctx.fillText(this.props.clear, 0, 75)


        }
        if(this.props.image){
        img.src = this.props.image;}
        else{
            ctx.canvas.height = 410;
            ctx.canvas.width = 620;

            let fixheight = window.innerHeight * 0.8
            let fixwidth = window.innerWidth * 0.9;
            let widthR = fixwidth / 620;
            let heightR = fixheight / 410;


            let ratios = Math.min(widthR, heightR)
            ratios = Math.floor(ratios * 100) / 100

            var calwidth = 620 * ratios;
            var calheight = 410 * ratios;
            thi$.setState({ csswidth: calwidth, cssheight: calheight })


        }

        this.setState({ edited: false });
    }

    touchStart(e) {
        e.preventDefault();

        this.setState({ edited: true });

        this.ctx.fillStyle = this.props.brushcolor;
        this.ctx.strokeStyle = this.props.brushcolor;
        this.ctx.lineWidth = "5";
        this.ctx.fillRect(this.offsetx(e.touches[0].pageX), this.offsety(e.touches[0].pageY), 2, 2);

        this.lastPt = { x: this.offsetx(e.touches[0].pageX), y: this.offsety(e.touches[0].pageY) };

    }
    touchMove(e) {
        e.preventDefault();

        let ctx = this.ctx;
        if (this.lastPt != null) {

            ctx.beginPath();
            ctx.moveTo(this.lastPt.x, this.lastPt.y);
            ctx.lineTo(this.offsetx(e.touches[0].pageX), this.offsety(e.touches[0].pageY));

            ctx.stroke();
        }
        this.lastPt = { x: this.offsetx(e.touches[0].pageX), y: this.offsety(e.touches[0].pageY) };


    }
    touchEnd(e) {
        e.preventDefault();
        this.lastPt = null;

    }

    offsetx(x) {

        var cssScaleX = this.refs.canvas.width / this.refs.canvas.offsetWidth;
        return (x - this.refs.canvas.offsetLeft - 1) * cssScaleX;
        //return x
    }
    offsety(y) {

         var cssScaleY = this.refs.canvas.height / this.refs.canvas.offsetHeight;
        return (y - this.refs.canvas.offsetTop) * cssScaleY;
        //return y
    }

}
