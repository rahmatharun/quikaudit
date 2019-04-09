import React, { Component } from 'react';
import $ from '../../../components/api/lang';
import auth from '../../../components/api/auth';
import PieChart from '../../../components/PieChart';
import CanvasDrawer from '../../../components/CanvasDrawer';
import { Menu, Container,Divider, Icon,Progress, Button, Checkbox, Input, Header, Image, List, Segment, Transition, Modal } from 'semantic-ui-react';

import quikPopup from '../../../components/quikPopup';
import CommentBox from '../../../components/CommentBox';

import audit from '../../../components/api/audit'
import {generatePDF} from '../../../components/function'

import logo from '../../../assets/img/quikauditfull.png';
const colors = [
    ["#33ff33", "#33ff33"], // blue
    ["#ffff4d", "#ffff4d"], // yellow green
    ["#ffb84d", "#ffb84d"], // yellow
    ["#ac7339", "#ac7339"], // orange
    ["#ff1a1a", "#ff1a1a"], // red
    ["#e2bcbd", "#9e2126"] // purple
]
export default class AuditList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded: false, 
            isLoad: true,
            comment: '',
            final: false,
            user: {},
            sign: 0, auditee: '', auditeePost: '',
            signImg: {},
            needFollowUp: false,
            stat:[],
            chartdata:{},
        }
        
        this.serv = [];
        this.nc = []; 
        this.myRef = React.createRef();
    }

    render() {
        const { isloaded,isLoad, stat,chartdata,comment } = this.state;

        
        return (
            <Transition visible={isloaded} animation='fade' duration={500}>
                <div className="fullpage">
                <div className="fullpage">
                    <Menu color="teal" inverted>
                    <Menu.Item name='back'  onClick={()=>{
                                        this.setState({ isloaded: false });
                                        const nav = this.props.history;
                                        setTimeout(() => {
                                            nav.goBack()
                                        }, 500)
                                    }} >
                    <Icon name='chevron left' />
                    </Menu.Item>
                        <Menu.Item position='flex'>
                            <Header as='h2' textAlign='center' inverted color='white'>
                                {$.t.auditperformance}
                    </Header>
                        </Menu.Item>
                    </Menu>
                    {isLoad ===true &&  <div className="flexPage centerflex">
                    <Image centered size='small' src={logo} />
                <Header  style={{width:'90%'}} as='h2' icon textAlign='center'>
                                <Progress color="teal" percent={100} indicating />
                                <Header.Content> {$.t.loading}</Header.Content>
                                <Header.Subheader></Header.Subheader>
                            </Header>
                            </div>}
                    { isLoad===false &&
                    <Container className="auditPerformance">
                    <PieChart includeLabels={true} data={chartdata} legendset={false}/>
                    <List selection divided verticalAlign='middle' size='medium' className="listPremiseBox"  >
                            {
                                chartdata.legend.map((row, idx) =>
                                <List.Item key={idx} onClick={() => {
                                    if (idx>0)
                                    this.props.navigate(`/main/audit/auditnc`,{  ...this.props.navprops,nc:stat[idx-1]  });
                                }}>
                                                    <List.Content floated='right'>
                                                        {chartdata.marks[idx]}
                                                    </List.Content>
                                                    <List.Icon name='square full' verticalAlign="middle" style={{ fontSize: '2em', color: chartdata.colors[idx][0] }}  />
                                                    <List.Content>
                                                    <List.Header >{row}</List.Header>
                                                    </List.Content>
                                            </List.Item> 
                               )
                            }
                        </List>
                        {comment &&
                                <p className="commentTxt" >{comment} </p>}
                        <Button size="huge"  fluid  onClick={() => {this.makeComment() }} color='teal'content={$.t.notes} icon='sticky note'/>
                        <br/>
                        <Checkbox slider  as={Header} size="large"  onChange={(e, data) => { this.setState({needFollowUp: data.checked});}} label={$.t.followupaudit}/>
                        <Divider inverted horizontal></Divider>
                        <Button size="huge"  fluid onClick={()=>this.dosign()} color='teal'content={$.t.signaturetxt} icon='pencil' />
    
                    </Container>
                            }
                </div>
                </div>
            </Transition>
        );
    }
    componentDidMount() {
        this.loadReport();
        this.setState({ isloaded: true});
    }

    loadReport() {
        const{audrecord,audobj}=this.props.navprops
        let stat=[]

        let total=0;
        let pass=0;
        for (let section of audrecord.cklist) {
            if (!section.section) {
              console.log('section is undefined');
              continue;
            }
            for (let checklistItem of section.items) {
                let itemid = checklistItem.id;
              
                if (audrecord.result[itemid] != "disable") {
                    total++;
          
                  if (typeof stat[checklistItem.severity] == "undefined") {
                    stat[checklistItem.severity] = { total:1, failed: 0,label:checklistItem.severityLabel,value:checklistItem.severity,data:[] }
                  }
                  else { stat[checklistItem.severity].total++ }
              
                  if (audrecord.result[itemid]) {
                    pass++;
                  }
                  else{
                    stat[checklistItem.severity].failed++
                    stat[checklistItem.severity].data.push(checklistItem);
                  }
                }
          }
        }

    let totalpass = (pass / total) * 360;
    let passpc = ((pass / total) * 100).toFixed(2);
    let chartdata={value:[totalpass],label:[passpc + "%"],legend:[$.t.passtxt],colors:[colors[0]],marks:[pass + "/" + total]};
    
    stat=stat.filter(n => n);
    for (let x of stat) {
      let ncr=x.failed;
      x.percent=((ncr / total) * 100).toFixed(2);
     chartdata.value.push((ncr/total)* 360);
     chartdata.label.push(x.percent+'%');
     chartdata.legend.push(x.label);
     chartdata.colors.push(colors[x.value-1]);
     chartdata.marks.push(ncr + "/" + x.total);
    }
    this.setState({ isLoad: false, stat,chartdata});
}
    
    dosign=(nex)=>{
        if(!nex){
            this.setState({ sign: 0});
        }
        quikPopup.pageOpen(
            <div  className="flexPage centerflex" style={{position:'absolute', top:0,left:0, backgroundColor:'lightgray', padding:'0 3vw'}}>
            <CanvasDrawer  ref={this.myRef} brushcolor="#000" bgcolor="#FFF" />
            <br/>
            {nex ? (

                [<p>
                    <Input className="searchBar" fluid icon='people' placeholder='Name...' size="huge"
                            onChange={(event) => { this.setState({ auditee: event.target.value }) }} name="Name" /></p>, <p>
                    <Input className="searchBar" fluid icon='people' placeholder='Position...' size="huge"
                            onChange={(event) => { this.setState({ auditeePost: event.target.value }) }} name="Position" />
                   </p>]

            ) : (
                <Header size='large'  color="teal">{auth.authStatus.name}
                    <Header.Subheader>Auditor</Header.Subheader>
                </Header>
                )}


            <div className="buttonright">
            {nex ? (
                <Button size="huge"  fluid onClick={()=>this.signNext()} color='teal'content={ $.t.finishaudittxt} icon='checkmark' labelPosition='right'/>
            ) : (
                <Button size="huge"  fluid onClick={()=>this.signNext()} color='teal'content={ $.t.nextbtn} icon='chevron right' labelPosition='right'/>
            )}
            
            <Divider inverted horizontal></Divider>
            <Button size="huge"  fluid onClick={()=>quikPopup.pageClose()} color='red'content={$.t.canceltxt} icon='chevron right' labelPosition='right'/>
    
            </div>
            </div>
              )
    }
    
    signNext=()=> {
        const{audrecord,audobj}=this.props.navprops
        const {auditee,auditeePost}=this.state;
        let canvas = this.myRef.current.refs.canvas;

        if(this.isCanvasBlank(canvas)){
            alert($.t.pleaseinsertsignature);
        }
        else{
        let pngUrl = canvas.toDataURL();

        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        let x = this.state.sign
        if (x) {
            if(auditee.length>0 && auditeePost.length>0){
            quikPopup.pageClose();
            this.setState({ final: false, isLoad: true, });
            audrecord.notes = this.state.comment;
            audrecord.auditor = this.signImg;
            audrecord.auditee = { name: this.state.auditee, post: this.state.auditeePost, sign: pngUrl, date: Date.now() }
            
            audobj.iscomplete = true;
            audobj.dateComplete = Date.now();
            audobj.isFollowUp = this.state.needFollowUp;


           audit.saveAuditRecord(audobj, audrecord).then((success) => console.log("final save")).catch((e) => console.log(e));
            generatePDF(audobj, audrecord,true).then((data) => {

                this.setState({ isLoad: false, });
                
            this.props.navigate(`/main/audit/auditreport`,{
                title: $.t.reporttxt,
                pdffile: data,
                filename: audobj.audtitle,
            });
            }).catch((e) => console.log(e));}
            else{
                alert($.t.completeconfirmationform);
            }

        }
        else {
            
            this.signImg = { sign: pngUrl, date: Date.now() };
            this.setState({ final: false, sign: x + 1, isLoad: true, });
            this.dosign(1);
            setTimeout(() => {
                this.setState({ final: true, isLoad: false, });
                
            }, 1000);
        }}
    }
    makeComment=()=>{
        
        quikPopup.pageOpen(
        <CommentBox save={(data)=>{
            this.setState({comment:data})
        }} 
        delete={()=>{
            this.setState({comment:''})
        }}
        savedtext={this.state.comment}
         />
        )
    }
     isCanvasBlank=(canvas) =>{
        let blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;

        return canvas.toDataURL() == blank.toDataURL();
    }

}

