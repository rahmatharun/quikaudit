import React, { Component } from 'react';
import c from '../../../components/api/cklist';
import $ from '../../../components/api/lang';
import auth from '../../../components/api/auth';


import { Container,Image,Progress, Transition, Button, List, Checkbox, Header, Menu, Divider, Icon } from 'semantic-ui-react';

import quikPopup from '../../../components/quikPopup';
import CommentBox from '../../../components/CommentBox'

import logo from '../../../assets/img/quikauditfull.png';
import AnotatePhoto from './AnotatePhoto';
import audit from '../../../components/api/audit'
import { getImage } from '../../../components/api/cordova';
import {colors} from '../../../components/config';

export default class AuditNCList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirm:false,
            isloaded: false,
            gotChecklist: true,
            cklist: [],
            loadingMsg: "",
            sectlist: [],
            index: 0,
            change: 0,
            open: false,
            activeItem: {},
            editedImg:null,
            isfoto: false
        }

        this.audobj = {}
        this.comment = {};
        this.ckbox = {};
        this.figure = {};
        this.audList = [];
    }


    render() {
        const { isloaded, cklist, sectlist, index ,confirm} = this.state;
      
        const{label,data}=this.props.navprops.nc;
        const nav = this.props.history;
        
        return (
            <div className="flexPage centerflex auditScreen">
                <Transition as="div" visible={isloaded} animation='horizontal flip' duration={500}>
                       <div className="fullpage">
                            <div className="flexPage centerflex">
                            {data.length ===0 &&  <React.Fragment>
                    <Image centered size='small' src={logo} />
                <Header  style={{width:'90%'}} as='h2' icon textAlign='center'>
                                <Progress color="teal" percent={100} indicating />
                                <Header.Content> {$.t.loadingauditchecklist}</Header.Content>
                                <Header.Subheader></Header.Subheader>
                            </Header>
                            </React.Fragment>}
                            { data.length >0 &&
                             <React.Fragment>
                                 <Menu color="teal" inverted borderless>
                        <Menu.Item position='left' name='back' onClick={() => {
                            this.setState({ isloaded: false });
                            const nav = this.props.history;
                            setTimeout(() => {
                                nav.goBack()
                            }, 500)
                        }} >
                              <Icon size="big"  className="headerButton"  name='chevron left' />
                        </Menu.Item>
                        <Menu.Item header position='flex'>
                            <Header as='h2' textAlign='center' inverted color='white'>
                                {label}
                            </Header>
                        </Menu.Item>
                        <Menu.Item position='right' name='back' onClick={()=>this.saveExit()} >
                        <Icon size="big"  className="headerButton" name='save' />
                        </Menu.Item>
                    </Menu>
                    
                    {/* <AuditSlider activeIndex={index} data={cklist} finalSlide={this.finalSlide} renderItem={this.renderCheckList} onChange={(next)=> this.setState({ index: next })}/> */}
                                
                    <div className="auditPerformance">
                    <Divider inverted horizontal />
                        {this.renderCheckList()}
                    </div>
                                </React.Fragment>
                            }
                            </div>
                        </div>

                </Transition>
           
            </div>
        );
    }
    componentDidMount() {
        this.setState({ isloaded: true });
        const{audobj,audrecord}=this.props.navprops;
        this.audobj = audobj;
        this.comment = audrecord.comment;
        this.figure = audrecord.figure;
        this.ckbox = audrecord.result;
    }
   
    componentWillUnmount() {
        clearInterval(this.autosave);
      }
  
    saveExit=()=>{
        const nav = this.props.history;
        this.saveAudit(()=>{
            this.setState({ isloaded: false });
            setTimeout(() => {
                nav.goBack();
            }, 500)
        },1);
        
    }
   

    renderCheckList = () => {
        
        const{data}=this.props.navprops.nc;
        console.log(data);
        return (
            <List divided verticalAlign='middle' relaxed size="large">
                {data.map((item, index) =>
                    <List.Item  key={index} className="cklistItem"  style={{
                        borderLeft:` 2vw solid ${colors[item.severity-1][0]}`,
                        }}>
                        <List.Content floated='right' verticalAlign="middle">
                            <Checkbox id={`checkbox-${item.id}`} onChange={(e, data) => { this.ckbox[item.id] = data.checked; this.haschange() }} checked={this.ckbox[item.id]===true} disabled={this.ckbox[item.id]==='disable'}/>
                        </List.Content>
                        <List.Icon >
                            <Button circular icon='ellipsis vertical' onClick={() => this.actionButton(item)} />
                        </List.Icon>
                        <List.Content verticalAlign="middle" className={this.ckbox[item.id]==='disable'?'disabled':''}>
                            <label for={`checkbox-${item.id}`}>{item.text_ms}</label>
                            {this.comment[item.id] &&
                                <p className="commentTxt" onClick={() => {this.makeComment(item.id) }}>{this.comment[item.id]} </p>}
                            {this.figure[item.id] &&
                                <div id={`fgr_${item.id}`} className="fgrFrame">
                                    {this.figure[item.id].map(
                                        (foto, index) => {
                                            return (
                                                <a key={index} className="thumbnail" onClick={() => { this.anotatePhoto(foto.src,item.id,index); }}>
                                                    <img className={foto.post} src={foto.src+'?t=' + new Date().getTime()} />
                                                </a>
                                            );
                                        })}

                                </div>
                            }
                        </List.Content>
                    </List.Item>
                )}

            </List>
        )
    }
    haschange = () => {
        let c = this.state.change
        this.setState({ change: c + 1 })
    }


    show = () => this.setState({ open: true })
    close = () => this.setState({ open: false, isfoto: false })
    actionEvidence=(id)=>{
        quikPopup.Open($.t.takepicturefrom ,
            
      <List divided relaxed size="huge" selection className="optButton">
            <List.Item onClick={() => { getImage(1).then(x=>this.handleImage(x,id)) }}>
            <List.Icon name='camera' />
            <List.Content>
                <List.Header>{$.t.cameratxt}</List.Header>
            </List.Content>
        </List.Item>
        <List.Item onClick={() => { getImage(2).then(x=>this.handleImage(x,id)) }}>
            <List.Icon name='image' />
            <List.Content>
                <List.Header>{$.t.gallerytxt}</List.Header>
            </List.Content>
        </List.Item>
        </List>
        )
    }
    actionButton = (item) => {
        let ref = "";
        for (var z = 0; z < item.info.length; z++) {

          ref += "<b>" + item.info[z].doc + " "+$.t['page']+"." + item.info[z].pgNo + " " + item.info[z].LnNo + "</b><br/>" + item.info[z].text.replace(/'/g, "\\'").replace(/\r?\n/g, '') + "<br><br>";
        }
      quikPopup.Open($.t.selectaction,
      <List divided relaxed size="huge" selection className="optButton">
     {this.ckbox[item.id]!=="disable" &&
     <React.Fragment>
              <List.Item onClick={() => { this.actionEvidence(item.id) }}>
                  <List.Icon name='attach' />
                  <List.Content>
                      <List.Header>{$.t.collectevidencetxt}</List.Header>
                  </List.Content>
              </List.Item>
              <List.Item onClick={() => { this.makeComment(item.id) }}> 
                  <List.Icon name='write' />
                  <List.Content>
                      <List.Header>{$.t.notes}</List.Header>
                  </List.Content>
              </List.Item>
              </React.Fragment>}
              <List.Item onClick={() => { quikPopup.Open($.t.nonconformance,item.severityLabel) }}>
                  <List.Icon name='attention' />
                  <List.Content>
                      <List.Header>{$.t.nonconformance}</List.Header>
                  </List.Content>
              </List.Item>
              <List.Item onClick={() => { quikPopup.Open($.t.referencetxt,<p dangerouslySetInnerHTML={{__html:ref}}></p>)}}>
                  <List.Icon name='book' />
                  <List.Content>
                      <List.Header>{$.t.referencetxt}</List.Header>
                  </List.Content>
              </List.Item>
              <List.Item onClick={() => { this.disableItem(item.id) }}>
                  <List.Icon name='strikethrough' />
                  <List.Content>
                      <List.Header>{this.ckbox[item.id]!=="disable"?$.t.notapplicable:$.t.applicable}</List.Header>
                  </List.Content>
              </List.Item>
         
      <List.Item onClick={() => { quikPopup.Close() }} color="red">
          <List.Content>
              <Header color="red">{$.t.canceltxt}</Header>
          </List.Content>
      </List.Item>

  </List>
      )
    }

    handleImage = (x,id) => {
        quikPopup.Close(); 
        this.anotatePhoto(x,id,null)
       // this.haschange()
    }
    anotatePhoto=(img,id,index)=>{
        quikPopup.pageOpen(
            <AnotatePhoto close={this.closeAnotate} deleteImage={()=>this.deleteImage(id,index)} image={img} saveimage={(img,or)=>this.saveimage(img,or,id,index)}/>
            ); 
    }
    closeAnotate=()=>{
        quikPopup.pageClose();
    }
    deleteImage=(id,index)=>{
        if (index !==null){
        this.figure[id].splice(index, 1);
        this.haschange();
        }
        quikPopup.pageClose();
    }
    saveimage=(img,or,id,index)=>{
        if (!this.figure[id]) {
            this.figure[id] = [];
        }

        if (index !== null){
        this.figure[id].splice(index, 1,{ src: img, post: or })
        }else{
        this.figure[id].push({ src: img, post: or });}
        this.haschange()
        
        quikPopup.pageClose();

    }
    disableItem=(id)=>{
        if(this.ckbox[id]!=="disable"){
        this.ckbox[id]="disable"}
        else{
        this.ckbox[id]=false}
        this.haschange()
        quikPopup.Close(); 
        }

    makeComment=(id)=>{
        
        quikPopup.pageOpen(
        <CommentBox save={(data)=>{
            this.comment[id]=data;
            this.haschange();
        }} 
        delete={()=>{
            this.comment[id]="";
            this.haschange();
        }}
        savedtext={this.comment[id]}
         />
        )
    }

    saveAudit=(cb,isSave) =>{
        
        const prevrecord=this.props.navprops.audrecord;
        if (cb === undefined) {
          cb = function () { };
        }
        let c = this.state.change;
        if (c||isSave) {
          let audrecord = {};
          audrecord.comment = this.comment; 
          audrecord.figure = this.figure;
          audrecord.result = this.ckbox;
          audrecord.cklist = prevrecord.cklist;
          audit.saveAuditRecord(this.audobj, audrecord).then((success) => cb()).catch((e) => console.log(e));
          this.clearchange();
        }
      }

      clearchange() {
        this.setState({ change: 0 })
      }
    
      autosave=setInterval(()=>{
        this.saveAudit();
      }, 60000);
    }



