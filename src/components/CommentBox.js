import React from 'react';
//import { Toolbar, Page, ToolbarButton, BackButton, Icon } from 'react-onsenui';

import {Segment, Button, Header, Icon, Modal, Confirm, List, Transition, Popup } from 'semantic-ui-react'

import quikPopup from './quikPopup';
import $ from './api/lang';
import '../assets/css/notepadEffect.css'


export default class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false,

    };
  }
  componentDidMount() {

  }
  render() {
    const { confirmDelete } = this.state;
    return (
      <div id="anotatePage" className="fullpage pagecolor" style={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'red' }}>
        <div className="flexPage spaceBtwflex">
          <Segment className="pageheader" inverted color='teal'>
            <Icon size="big"  className="headerButton" name='chevron left' onClick={()=>{quikPopup.pageClose()}} />
            <Header className="headerTitle" size='big'>{$.t.notes}</Header>
            <div>
              <Icon size="big" className="headerButton" name='eraser' onClick={()=>{this.props.delete(); quikPopup.pageClose();}} />
              <Icon size="big"  className="headerButton" name='save' onClick={()=>{this.props.save(document.getElementById("commentText").innerText); quikPopup.pageClose();}} />
            </div>
          </Segment>

          <article id="commentText" class="notepad" contenteditable="true">
            {this.props.savedtext && this.props.savedtext.split('\n').map((item, key) => {
              return <span key={key}>{item}<br /></span>
            })}
          </article>
        </div>


        {confirmDelete &&
          <Confirm open={confirmDelete} onCancel={() => { this.setState({ confirmDelete: false }) }} onConfirm={deleteImage} />}

      </div>);
  }
  componentDidMount() {
    // document.getElementById("commentText").focus();

  }
  renderToolbar() {
    const backButton = <BackButton onClick={() => { this.props.navigator.popPage() }}>Back</BackButton>;
    return (
      <Toolbar Modifier="transparent cover-content" className='opacityheader'>

        <div className='left'>{backButton}</div>
        <div className="center" style={{ display: "flex", justifyContent: "center", height: '100%', alignItems: "center", flexDirection: "column" }}>

          {this.props.navprops.title}

        </div>
        <div className="right" >

          <ToolbarButton onClick={this.ClearComment.bind(this)} style={{ padding: '0 20px', fontSize: '1.5em', display: 'inline-flex', alignItem: 'center' }} >
            <Icon icon='md-delete'></Icon>
          </ToolbarButton>
          <ToolbarButton onClick={this.saveComment.bind(this)} style={{ padding: '0 20px', fontSize: '1.5em', display: 'inline-flex', alignItem: 'center' }} >
            <Icon icon='md-check'></Icon>
          </ToolbarButton>
        </div>
      </Toolbar>
    );
  }
  saveComment() {
    this.props.navprops.saveComment(document.getElementById("commentText").innerText);
    this.props.navigator.popPage()
  }
  ClearComment() {
    document.getElementById("commentText").innerText = "";

  }
}
