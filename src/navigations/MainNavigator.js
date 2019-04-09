import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import auth from '../components/api/auth';
import HomeNavigator from './HomeNavigator';
import AuditForm from '../screens/audit/AuditForm'
import AuditList from '../screens/audit/AuditList'
import CompleteList from '../screens/audit/CompleteList'
import FollowUpList from '../screens/audit/FollowUpList'
import PendingList from '../screens/audit/PendingList'
import AuditReport from '../screens/audit/form/AuditReport'
import HomeScreen from '../screens/home/HomeScreen'
import SettingNavigator from './SettingNavigator';

import { Modal,Header,Image,Progress,TransitionablePortal,Segment } from 'semantic-ui-react'
import x from '../components/quikPopup';
import logo from '../assets/img/quikauditfull.png';
import $ from '../components/api/lang';

export default class MainNavigator extends Component{
        constructor(props) {
                super(props);
                this.state = {
                    popupState:false,
                    popupTitle:null,
                    popupContent:null,
                    pageState:false,
                    pageContent:null,
                    loading:false,
                    loadingTitle:null,
                    navprops:null
                }
            }

            
        render() {
        const rootProps=this.props;
        const{popupState,popupTitle,popupContent,pageState,pageContent,loading,loadingTitle}=this.state
        return (<React.Fragment>
                
                <TransitionablePortal  open={popupState}  transition={{ animation:"fade", duration:500 }}>
                 <Modal basic dimmer="true" size="mini" open={true} onClose={x.Close} closeIcon>
                  <Segment>
                    <Header>{popupTitle}</Header>
                    <Modal.Content>
                     {popupContent}
                    </Modal.Content>
                    </Segment>
                </Modal>  
                </TransitionablePortal>
                <TransitionablePortal  open={loading} transition={{ animation:"fade", duration:500 }}>
                <Modal  basic dimmer="inverted" size="mini" open={true}>
                <Segment>
                    <Image centered size='small' src={logo} />
                <Header  style={{width:'90%'}} as='h2' icon textAlign='center'>
                                <Progress color="teal" percent={100} indicating />
                                <Header.Content> {loadingTitle?loadingTitle:$.t.loading}</Header.Content>
                                <Header.Subheader></Header.Subheader>
                            </Header>
                    </Segment>
                </Modal>   
                </TransitionablePortal>
                <Switch>
                                <this.PropsRoute  exact path={this.props.match.path} component={HomeScreen} />
                                <this.PropsRoute path={`${this.props.match.path}/audit`} component={AuditForm} /> 
                          <this.PropsRoute path={`${this.props.match.path}/auditlist`} component={AuditList} /> 
                          <this.PropsRoute path={`${this.props.match.path}/auditClist`} component={CompleteList} /> 
                          <this.PropsRoute path={`${this.props.match.path}/auditFlist`} component={FollowUpList} /> 
                          <this.PropsRoute path={`${this.props.match.path}/auditPlist`} component={PendingList} /> 
                          <this.PropsRoute path={`${this.props.match.path}/auditReport`} component={AuditReport} /> 
                          <this.PropsRoute path={`${this.props.match.path}/setting`} component={SettingNavigator} /> 
                         
                </Switch>
                {pageState &&
                <div className="quikPopup">{pageContent}</div>
                }
                 
        </React.Fragment>
        );
}
componentDidMount(){
        
        x.LoadingStart=(loadingTitle)=>{
                this.setState({loading:true,loadingTitle});
            }
        x.LoadingStop=()=>{
                setTimeout(() => {this.setState({loading:false,loadingTitle:null});}, 500);
            }
        x.Close=()=>{
                this.setState({
                popupState:false});
                setTimeout(() => {
                        this.setState({ 
                        popupTitle:null,
                        popupContent:null});}, 500);
            }
             x.Open=(title,content)=>{
                if(this.state.popupState){ 
                x.Close();
                setTimeout(() => {
                    this.setState({
                        popupState:true,
                        popupTitle:title,
                        popupContent:content});}, 600);
                
                // this.setState({
                //     popupState:true,
                //     popupTitle:title,
                //     popupContent:content});
            }
                else{
                    this.setState({
                        popupState:true,
                        popupTitle:title,
                        popupContent:content});}
                
            }
          
            x.pageClose=()=>{
                this.setState({
                        pageState:false,
                        pageContent:null,});
            }
            x.pageOpen=(content)=>{
                if(this.state.popupState) x.Close();
                if(this.state.pageState) 
                {x.pageClose();
                        setTimeout(() => {
                                this.setState({
                                        pageState:true,
                                        pageContent:content,});
                                
                            }, 1000);
                }
                else{
                this.setState({
                        pageState:true,
                        pageContent:content,});}
            }

            
}
navigate=(path,navprops)=>{
        this.setState({navprops});
        let nav = this.props.history;
        console.log(`${this.props.match.path}/${path}`);
        nav.push(`${this.props.match.path}/${path}`);
    }

 PropsRoute = ({ component: Component, ...rest }) => (
    <Route  {...rest} render={(props) => <Component {...props} logOut={this.props.logOut} navprops={this.state.navprops} navigate={this.navigate} />}
   />  
    )
}
