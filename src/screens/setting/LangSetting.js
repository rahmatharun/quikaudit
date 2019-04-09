import React, { Component } from 'react';
import $ from '../../components/api/lang';
import quikPopup from '../../components/quikPopup';
import { Menu, Container, Icon,List,Divider,Dropdown, Button, Form, Grid, Header, Image, Message, Segment, Transition, Modal } from 'semantic-ui-react';
import audit from '../../components/api/audit';

import auth from '../../components/api/auth';

export default class LangSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded: false,
            language:[],
            langOpen:false,
            langlist: [],
        }
    }

    render() {
        const { isloaded,language,langOpen,langlist } = this.state;
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
                                this.setState({ langOpen: true });
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
                                quikPopup.LoadingStart();
                                $.downloadLang().then(x=>{
                                    $.getLang().then(x2=>{
                                        quikPopup.LoadingStop();
                                        this.props.location.reload();
                                    })
                                })
                            }}>
                            <List.Content floated='right'>
                            <List.Icon name='chevron right' verticalAlign="middle" />
                            </List.Content>
                            <List.Icon name='download' verticalAlign="middle" />
                            <List.Content>
                                <List.Header >{$.t.update}</List.Header>
                                
                            </List.Content>
                            </List.Item>

                        </List>
                    </Container>
                    <Modal basic size="small" open={langOpen} onClose={()=>{this.setState({ langOpen: false });}}
                    closeOnEscape={false}
                    closeOnDimmerClick={false}
                >
<Modal.Header icon='settings' content='Language' />
                    <Modal.Content>
                        <Dropdown
                            button
                            className='icon'
                            labeled
                            icon='world'
                            options={langlist}
                            closeOnChange
                            text='Select Language'
                            fluid
                            onChange={(e,data)=>{
                                $.setLang(data.value);
                                this.setState({ langOpen: false });
                                this.props.location.reload();
                                
                            }}
                        />
                    </Modal.Content>

                </Modal>
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

