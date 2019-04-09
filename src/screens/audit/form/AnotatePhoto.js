import React from 'react';
import CanvasDrawer from '../../../components/CanvasDrawer';
//import { colorOpt, CameraOpt } from './api';
//import { savefileimg } from './cordovafunct';

import {  TwitterPicker } from 'react-color';
import { Button, Header, Icon, Modal,Confirm ,List,Transition,Popup } from 'semantic-ui-react'
const rootdom = document.getElementById("root");
import { getImage,savefileimg } from '../../../components/api/cordova';
import $ from '../../../components/api/lang';

export default class AnotatePhoto extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			brushcolor: "red",
			loadImg: props.image,
			confirmDelete:false,
			camOpen:false,
			isloaded:false
		};
	}
	componentDidMount() {

		this.setState({isloaded:true})
	}

	render() {
		const { close,deleteImage } = this.props;
		const { loadImg, brushcolor,confirmDelete,camOpen,isloaded } = this.state;
		return (
			<div id="anotatePage" className="fullpage" style={{position:'absolute', top:0,left:0, backgroundColor:'black'}}>
			<Transition as="div" visible={isloaded} animation='fade' duration={500}>
			<div>
				<div  className="flexPage spaceBtwflex">
			 <Button.Group basic inverted size="huge" fluid>
					<Button inverted icon  onClick={close}>
						<Icon name='chevron left' />
					</Button>
					<Button inverted floated="right" icon onClick={()=>{this.setState({confirmDelete:true})}}>
						<Icon name='eraser' />
					</Button>
					<Button inverted icon onClick={this.changeimage}>
						<Icon name='camera retro' />
					</Button>
				</Button.Group >
					<CanvasDrawer image={loadImg} ref='canvasimage' brushcolor={brushcolor} />

					<Button.Group inverted  size="huge" fluid>
					<Button inverted icon  onClick={this.clearimg}>
						<Icon name='repeat' />
					</Button>
					
					<Popup
    trigger={<Button inverted color='inherit' style={{color:brushcolor}} floated="right" icon>
	<Icon name='paint brush' />
</Button>}
	on='click'
	position="top center"
  >
  <TwitterPicker color={brushcolor} onChangeComplete={ (color, event) =>this.setState({ brushcolor: color.hex }) } />
  
  </Popup>
					<Button inverted icon onClick={this.saveimage}>
						<Icon name='save' />
					</Button>
				</Button.Group>
			  </div>
			  </div>
				</Transition>
				
{confirmDelete &&
				<Confirm open={confirmDelete} onCancel={()=>{this.setState({confirmDelete:false})}} onConfirm={deleteImage} />}
			
			<Modal dimmer="blurring" size="mini" open={camOpen} onClose={this.camClose} closeIcon>
                    <Modal.Header>{$.t.takepicturefrom }</Modal.Header>
                    <Modal.Content>
                        <List divided relaxed size="huge" selection className="optButton"><React.Fragment>
                                <List.Item onClick={() => { getImage(1).then(this.handleImage) }}>
                                    <List.Icon name='camera' />
                                    <List.Content>
                                        <List.Header>{$.t.cameratxt}</List.Header>
                                    </List.Content>
                                </List.Item>
                                <List.Item onClick={() => { getImage(2).then(this.handleImage) }}>
                                    <List.Icon name='image' />
                                    <List.Content>
                                        <List.Header>{$.t.gallerytxt}</List.Header>
                                    </List.Content>
                                </List.Item>
                            </React.Fragment>
                            <List.Item onClick={() => { this.camClose() }} color="red">
                                <List.Content>
                                    <Header color="red">{$.t.canceltxt}</Header>
                                </List.Content>
                            </List.Item>

                        </List>
                    </Modal.Content>

                </Modal>
			</div>
		)
	}
	
	renderBottomToolbar() {
		return (
			<BottomToolbar modifier="transparent" style={{ display: 'flex', justifyContent: 'space-between' }} >

				<ToolbarButton onClick={this.clearimg.bind(this)} >
					<Icon icon='ion-refresh'></Icon>
				</ToolbarButton>

				<ToolbarButton onClick={this.colorpicker.bind(this)} >
					<Icon style={{ color: this.state.brushcolor }} icon='ion-android-color-palette'></Icon>
				</ToolbarButton>
				<ToolbarButton onClick={this.saveimage.bind(this)} >
					<Icon icon='ion-checkmark-round'></Icon>
				</ToolbarButton>
			</BottomToolbar >

		);
	}

	saveimage=()=>{

		let name = this.state.loadImg.split("/").pop();
		//	let newimg=this.refs.canvasimage.refs.canvas.toDataURL();
		let ctx = this.refs.canvasimage.refs.canvas.getContext("2d");
		let orentation = ctx.canvas.height > ctx.canvas.width ? "portrait" : "landscape";

		if (this.refs.canvasimage.state.edited) {
			this.refs.canvasimage.refs.canvas.toBlob((blob) => {
				savefileimg(blob, name, (t) => {
					this.props.saveimage(t, orentation);
				})

			});
		}
		else {
			this.props.saveimage(this.state.loadImg, orentation);
		}


	}
	clearimg=()=> {
		this.refs.canvasimage.loadcanvas();
	}
	colorpicker() {
		let thi$ = this;
		colorOpt((c) => {
			thi$.setState({ brushcolor: c })
		});
	}

	changeimage=()=> {
		this.setState({camOpen:true})
	}
	handleImage = x => {
			this.setState({ loadImg: x });
			this.refs.canvasimage.loadcanvas();
        this.camClose();
    }
	camClose=()=>{
		this.setState({camOpen:false})
	}
}
