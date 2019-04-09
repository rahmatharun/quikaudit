import React, { Component } from 'react';
import c from '../../../components/api/cklist';
import $ from '../../../components/api/lang';
import auth from '../../../components/api/auth';


import AuditSlider from './AuditSlider';
import { Dropdown,Image,Progress, Transition, Button, List, Checkbox, Header, Confirm, Divider, Icon } from 'semantic-ui-react';
import moment from 'moment'
import quikPopup from '../../../components/quikPopup';
import CommentBox from '../../../components/CommentBox'

import logo from '../../../assets/img/quikauditfull.png';
import AnotatePhoto from './AnotatePhoto';
import audit from '../../../components/api/audit'
import { getImage } from '../../../components/api/cordova';
import {colors} from '../../../components/config';

export default class AuditChecklist extends Component {
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
      
        const nav = this.props.history;
        
        return (
            <div className="flexPage centerflex auditScreen">
                <Transition as="div" visible={isloaded} animation='horizontal flip' duration={500}>
                       <div className="fullpage">
                            <div className="flexPage centerflex">
                            {cklist.length ===0 &&  <React.Fragment>
                    <Image centered size='small' src={logo} />
                <Header  style={{width:'90%'}} as='h2' icon textAlign='center'>
                                <Progress color="teal" percent={100} indicating />
                                <Header.Content> {$.t.loadingauditchecklist}</Header.Content>
                                <Header.Subheader></Header.Subheader>
                            </Header>
                            </React.Fragment>}
                            { cklist.length >0 &&
                             <React.Fragment>
                                <Button.Group className="ddlAuditSection" color='teal' size="large">
                                    <Button icon onClick={()=>{
                                        this.setState({ isloaded: false });
                                        const nav = this.props.history;
                                        setTimeout(() => {
                                            nav.goBack()
                                        }, 500)
                                    }}>
                                        <Icon name='chevron left' />
                                    </Button>
                                    <Button className="headerSelect" as="select" onChange={(e)=>this.setState({index:e.target.value})}>
                                        {sectlist.map((item, i) => <option value="audi" selected={index === i} value={i} key={i} >{item}</option>)}
                                    </Button>
                                    <Button icon onClick={()=>this.headerOption()}>
                                        <Icon name='ellipsis vertical' />
                                    </Button>
                                </Button.Group>
                                <AuditSlider activeIndex={index} data={cklist} finalSlide={this.finalSlide} renderItem={this.renderCheckList} onChange={(next)=> this.setState({ index: next })}/>
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
       this.resumeIfExist();
    }
    componentWillUnmount() {

        clearInterval(this.autosave);
      }

    resumeIfExist=()=> {
        
        //this.props.navprops.tooglemodal();
        const{parentprop}=this.props;
        if(parentprop){
        let {audobj} = this.props.parentprop;
     //  const resumeName= this.props.match.params.id
      
        if (typeof audobj !== "undefined") {
           // audit.audList
        //  let resumeObj = audit.audList.filter(({ filename }) => filename===resumeName )[0];
          this.loadAuditFile(audobj.filename)
          this.audobj = audobj;
        }else {
            this.createNewAudit();
          }
    }
        else {
          this.createNewAudit();
        }
      }

    createNewAudit=()=>{
        const { checklistID, ctg ,prmsPK} = this.props;
        console.log(checklistID);
        c.getCklist(checklistID).then(cklist => {
            console.log(cklist)
            var sectslice = [];
            var sectlist = [];
            var sectind = 0;
            for (var i = 0; i < cklist.length; i++) {

                var items = cklist[i].items;
                var sliced = [];
                var ind = 0;
                for (var j = 0; j < items.length; j++) {

                    if (typeof items[j].text_ms !== "undefined") {
                        if (items[j].ctg == "Umum" || items[j].ctg == ctg) {
                            sliced[ind] = items[j];
                            ind++;
                        }
                    }
                }
                cklist[i].items = sliced;

                if (sliced.length > 0) {
                    sectslice.push(cklist[i]);
                    sectlist.push(cklist[i].section)
                }

            }
            sectlist.push($.t.finishaudittxt);
            let thi$=this;
            setTimeout(() => {
                thi$.setState({ cklist: sectslice, sectlist: sectlist, index: 0 });
            }, 1000)
        }).catch(e=>console.log(e))

        const premise = auth.authStatus.premise.filter((x) => x.prmsPK === prmsPK)[0];
        const auduser= { name: auth.authStatus.name, ic: auth.authStatus.icno }
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();
        if (dd < 10) {
          dd = '0' + dd;
        }
        if (mm < 10) {
          mm = '0' + mm;
        }
        today = dd + '/' + mm + '/' + yyyy;
        let newtitle="";
        this.audobj = {};
        this.audobj.audtitle =(newtitle.length>0?newtitle:"Audit " + premise.prmsName + "-" + today);
        this.audobj.filename = "" + Date.now();
        this.audobj.user = auduser;
        this.audobj.premis = premise.prmsName;
        this.audobj.premisAddrs = premise.prmsAddrs;
        this.audobj.user = auduser;
        this.audobj.iscomplete=false;
        this.autosave;
    }

    loadAuditFile=(filename)=> {
        audit.loadAuditRecord(filename).then((data) => {
          this.comment = data.comment;
          this.figure = data.figure;
          this.ckbox = data.result;
          let sectlist = [];
    
          console.log(data);
          data.cklist.forEach((item) => sectlist.push(item.section))
          sectlist.push($.t.finishaudittxt)
          this.setState({ cklist: data.cklist, isOpen: false, sectlist: sectlist, index: 0 });
    
        }).catch((e) => console.log(e))
      }

    finalSlide=()=>{
        return(
            <div className="finalSlide">
                <Icon name='check circle outline' size="massive" />
            <div >
              {$.t.finishaudittxt}
              </div>
              <div className="slideButton">
              <Button size="huge" inverted fluid onClick={()=>this.saveReport()} color='white'content={$.t.confirmation} icon='chevron right' labelPosition='right'/>
              <Divider inverted horizontal></Divider>
              <Button size="huge" inverted fluid onClick={()=>this.saveExit()} color='white'content={$.t.save} icon='chevron right' labelPosition='right'/>
              </div>
            </div>
        ) 
    }
    saveReport=()=>
    {
        const{navigate}=this.props;
        this.saveAudit(()=>{
            let audrecord = {};
            audrecord.comment = this.comment; 
            audrecord.figure = this.figure;
            audrecord.result = this.ckbox;
            audrecord.cklist = this.state.cklist;

            this.setState({ isloaded: false });
            setTimeout(() => {
                navigate(`/main/audit/auditfinal`,{audrecord,audobj:this.audobj});
            }, 500)
        },true);
    }
    saveExit=()=>{
        const nav = this.props.history;
        this.saveAudit(()=>{
            this.setState({ isloaded: false });
            setTimeout(() => {
                nav.go(-5)
            }, 500)
        },1);
        
    }
    confirmExit=()=>{
        quikPopup.Open($.t.areyousuretxt,
            <React.Fragment>
            <p>
            {$.t.changeswillnotbesave}
          </p>
          <Button size="huge" color="blue" fluid onClick={()=>{
              quikPopup.Close();
                const nav = this.props.history;
                    this.setState({ isloaded: false });
                    setTimeout(() => {
                        nav.go(-5)
                    }, 500)
          }} content={$.t.yestxt} icon='chevron right' labelPosition='right'/>
              <Divider inverted horizontal></Divider>
              <Button size="huge"  fluid onClick={()=>quikPopup.Close()} color='red'content={$.t.notxt} icon='chevron right' labelPosition='right'/>
              
          </React.Fragment>)

    }
    headerOption=()=>{
        quikPopup.Open($.t.selectaction ,
            
            <List divided relaxed size="huge" selection className="optButton">
                  <List.Item onClick={() => {quikPopup.Close(); this.saveExit(); }}>
                  <List.Icon name='save' />
                  <List.Content>
                      <List.Header>{$.t.save}</List.Header>
                  </List.Content>
              </List.Item>
              <List.Item onClick={() => {this.confirmExit()}}>
                  <List.Icon name='close' />
                  <List.Content>
                      <List.Header>{$.t.canceltxt}</List.Header>
                  </List.Content>
              </List.Item>
              </List>
              )
    }
    renderCheckList = (items) => {
        return (
            <List divided verticalAlign='middle' relaxed size="large">
                {items.map((item, index) =>
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
            <List.Item onClick={() => { 
                                quikPopup.LoadingStart();
                                quikPopup.Close();
                                getImage(1).then(x=>this.handleImage(x,id)) }}>
            <List.Icon name='camera' />
            <List.Content>
                <List.Header>{$.t.cameratxt}</List.Header>
            </List.Content>
        </List.Item>
        <List.Item onClick={() => {
            
            quikPopup.LoadingStart();
            quikPopup.Close(); 
            getImage(2).then(x=>this.handleImage(x,id)) }}>
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
              <List.Item onClick={() => { quikPopup.Open($.t.nonconformance,<p style={{color:'black'}}>{item.severityLabel}</p>) }}>
                  <List.Icon name='attention' />
                  <List.Content>
                      <List.Header>{$.t.nonconformance}</List.Header>
                  </List.Content>
              </List.Item>
              <List.Item onClick={() => { quikPopup.Open($.t.referencetxt,<p style={{color:'black'}} dangerouslySetInnerHTML={{__html:ref}}></p>)}}>
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
        quikPopup.LoadingStop();
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
        if (cb === undefined) {
          cb = function () { };
        }
        let c = this.state.change;
        if (c||isSave) {
          let audrecord = {};
          audrecord.comment = this.comment; 
          audrecord.figure = this.figure;
          audrecord.result = this.ckbox;
          audrecord.cklist = this.state.cklist;
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



