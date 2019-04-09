import React, { Component } from 'react';
import $ from '../../components/api/lang';
import { Menu, Container, Icon,List,Divider,Dropdown, Button, Form, Grid, Header, Image, Message, Segment, Transition, Modal } from 'semantic-ui-react';
import audit from '../../components/api/audit';
import moment from 'moment'
import auth from '../../components/api/auth';

export default class SettingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded: false,
            language:[],
            langlist: [],
        }
    }

    render() {
        const { isloaded,language } = this.state;
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
                                {$.t.settingtxt}
                            </Header>
                        </Menu.Item>
                    </Menu>
                    <Container className="menuContainer">
                    <List  divided verticalAlign='middle' size='huge' className="listPremiseBox"  >
                           
                    <Divider horizontal></Divider>
                        <List.Item onClick={() => {
                            // this.setState({isloaded: false });
                            // let nav = this.props.history;
                            // setTimeout(() => {
                            //     nav.push(`/main/audit/cklist/`+item.filename)
                            // }, 500)
                            }}>
                            
                            <List.Icon name='user' verticalAlign="middle" />
                            <List.Content>
                                <List.Header >{auth.authStatus.name}</List.Header>
                                <Header sub>{$.t.subscription}</Header>
                                {moment(auth.authStatus.subcrstart).format('Do MMMM YYYY')}
                                <p>{$.t.totxt}</p>
                                {moment(auth.authStatus.subcrend).format('Do MMMM YYYY')}
                                
                            </List.Content>
                            </List.Item>
                            <Divider horizontal></Divider>
                            <List.Item onClick={() => {
                                  this.setState({ isloaded: false });
                                  const nav = this.props.navigate;
                                  setTimeout(() => {
                                    nav(`setting/lang`);
                                  }, 500)
                            }}>
                            <List.Content floated='right'>
                            <List.Icon name='chevron right' verticalAlign="middle" />
                            </List.Content>
                            <List.Icon name='globe' verticalAlign="middle" />
                            <List.Content>
                                <List.Header >{$.t.lang}</List.Header>
                                {language[$.activeLang]}
                            </List.Content>
                            </List.Item>
                            <List.Item onClick={() => {
                                  this.setState({ isloaded: false });
                                  const nav = this.props.navigate;
                                  setTimeout(() => {
                                    nav(`setting/cklist`);
                                  }, 500)
                            }}>
                            <List.Content floated='right'>
                            <List.Icon name='chevron right' verticalAlign="middle" />
                            </List.Content>
                            <List.Icon name='list' verticalAlign="middle" />
                            <List.Content>
                                <List.Header >{$.t.checklisttxt}</List.Header>
                            </List.Content>
                            </List.Item>

                        </List>
                    </Container>
                </div>
            </Transition>
        );
    }
    componentDidMount() {

            $.getLangList().then(x=>{

                let langlist = [];
                Object.entries(x).forEach(
                    ([key, value]) => langlist.push({ key, text: value, value: key })
                );
                this.setState({ 
                    isloaded:true,
                    language:x,langlist
                    })
            })
            
       
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

