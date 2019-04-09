import React, { Component } from 'react';
import $ from '../../components/api/lang';
import { Menu, Container, Icon, Button, Form, Grid, Header, Image, Message, Segment, Transition, Modal } from 'semantic-ui-react';
import audit from '../../components/api/audit';


export default class AuditList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded: false, totalAudit: 0, loopcount: 0,pendingList:[],completeList:[],followupList:[]
        }
    }

    render() {
        const { isloaded, pendingList,completeList,followupList } = this.state;
        return (
            <Transition visible={isloaded} animation='fade' duration={500}>
                <div className="fullpage">
                    <Menu color="teal" inverted borderless>
                        <Menu.Item position='left' name='back' onClick={() => {
                            this.setState({ isloaded: false });
                            const nav = this.props.history;
                            setTimeout(() => {
                                nav.goBack()
                            }, 500)
                        }} >
                            <Icon name='chevron left' />
                        </Menu.Item>
                        <Menu.Item header position='flex'>
                            <Header as='h2' textAlign='center' inverted color='white'>
                                {$.t.auditrecord}
                            </Header>
                        </Menu.Item>
                    </Menu>
                    <Container className="menuContainer">
                        <Grid  verticalAlign='middle' centered columns='equal' stretched>
                            <Grid.Column width={16} >
                                <Header disabled={pendingList.length<1} onClick={() => {
                                    if(pendingList.length>0)
                                    this.props.navigate('auditPlist',{pendingList})
                                }} block as='h2' icon>
                                    <Icon name='edit outline' />
                                    {$.t.continuetxt}
                                    <Header.Subheader>{$.t.totalaudit} : {pendingList.length}</Header.Subheader>
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={16} >
                                <Header  disabled={completeList.length<1}  onClick={() => {
                                    if(completeList.length>0)
                                    this.props.navigate('auditClist',{completeList})
                                }} block as='h2' icon>
                                    <Icon name='file alternate outline' />
                                    {$.t.viewreport}
                                    <Header.Subheader>{$.t.totalaudit} : {completeList.length}</Header.Subheader>
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={16} >
                                <Header  disabled={followupList.length<1}  onClick={() => {
                                    if(followupList.length>0)
                                    this.props.navigate('auditFlist',{followupList})
                                }} block as='h2' icon>
                                    <Icon name='copy outline' />
                                    {$.t.followupaudit}
                                    <Header.Subheader>{$.t.totalaudit} : {followupList.length}</Header.Subheader>
                                </Header>
                            </Grid.Column>
                        </Grid>
                    </Container>
                </div>
            </Transition>
        );
    }
    componentDidMount() {
        console.log(this.props.navprops);
        let {data}=this.props.navprops;
if(data){
    this.setState({ 
        isloaded:true,
        pendingList: data.filter(this.filterPList),
        completeList: data.filter(this.filterCList),
        followupList: data.filter(this.filterFList) 
        })
}
else{
    audit.getAudList().then(x=>{
        this.setState({ 
            isloaded:true,
            pendingList: x.filter(this.filterPList),
            completeList: x.filter(this.filterCList),
            followupList: x.filter(this.filterFList) 
            })
    }).catch(e=>{
        this.setState({ isloaded: true});
    }
    )
}
}
    componentDidUpdate(prevProps) {

    }
    filterPList=(item)=>{
        
        if (item.iscomplete) {
            return false;
        }
        return true;
    }
    
    filterFList=(item)=>{
        
        if (item.isFollowUp) {
            return true;
        }
        return false;
    }
    
    filterCList=(item)=>{
        
        if (item.iscomplete) {
            return true;
        }
        return false;
    }



}

