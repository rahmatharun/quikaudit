import React, { Component } from 'react';
import auth from '../../../components/api/auth';
import {  Redirect } from 'react-router-dom';
import $ from '../../../components/api/lang';
import { List, Menu, Input, Container, Icon, Button, Form, Grid, Header, Image, Message, Segment, Transition } from 'semantic-ui-react';


export default class PickScheme extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded: false,
            checklists: [],
            filterData: [],
            typing: false,
            typingTimeout: 0,
            selected: 0,
            search: "",
        }
    }

    render() {
        const { isloaded, filterData, selected } = this.state;

        if(!(auth.authStatus.checklists.length>1)){
           const item= auth.authStatus.checklists[0];
            this.props.setFormData({ checklistID: item.checklistID,ctgList:item.ctglist })
            return  <Redirect to={'/main/audit/category'}/>
        }
        return (
            <Transition as="div" visible={isloaded} animation='horizontal flip' duration={500}>
                <div className="fullpage">
                    <div className="flexPage">
                        <Menu color="teal" inverted size='huge'>
                            <Menu.Item position="left" >
                                <Header as='h2' textAlign='left' inverted color='white'>
                                    {$.t.schemetxt} :
                    </Header>
                            </Menu.Item>
                        </Menu>

                        <div className="pickerBox">

                            <Input className="searchBar" fluid icon='search' placeholder='Search...' size="huge"
                                onChange={this.handleInputChange} name="search" />
                            <List selection divided verticalAlign='middle' size='huge' className="listPremiseBox"  >
                                {
                                    filterData.map((item, i) => (
                                        <List.Item key={i} onClick={() => {
                                            this.props.setFormData({ checklistID: item.checklistID, ctgList: item.ctglist });
                                            this.setState({ isloaded: false, selected: item.checklistID });
                                            const nav = this.props.history;
                                            setTimeout(() => {
                                                nav.push(`/main/audit/category`)
                                            }, 500)
                                        }} active={selected === item.checklistID}>
                                            <List.Icon name='warehouse' />
                                            <List.Content>
                                                <List.Header >{item.schemeName}</List.Header>
                                                {/* {item.schemeVersion} */}
                                            </List.Content>
                                        </List.Item>
                                    ))
                                }
                            </List>
                        </div>
                        <div className="navButton">
                            <Button color='teal' size='huge' floated='right' basic icon='chevron right' circular
                                onClick={() => {

                                    if (this.state.selected !== 0) {

                                        this.setState({ isloaded: false });
                                        const nav = this.props.history;
                                        setTimeout(() => {
                                            nav.push(`/main/audit/category`)
                                        }, 500)
                                    }
                                    else {
                                        alert($.t.pleasefillinform);
                                    }
                                }} />
                            <Button color='teal' size='huge' floated='left' basic icon='chevron left' circular
                                onClick={() => {
                                    this.setState({ isloaded: false });
                                    const nav = this.props.history;
                                    setTimeout(() => {
                                        nav.goBack()
                                    }, 500)
                                }} />
                        </div>

                    </div>
                </div>

            </Transition>
        );
    }
    componentDidMount() {
        const checklists = auth.authStatus.checklists.filter(({ schemeLang }) => schemeLang.toLowerCase() === $.activeLang.toLowerCase())
        this.setState({
            isloaded: true,
            checklists, filterData: checklists, selected: this.props.checklistID
        });

    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const self = this;

        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout);
        }

        self.setState({
            [name]: value,
            typing: true,
            typingTimeout: setTimeout(async () => {
                const { checklists } = self.state;
                if (value.length) {
                    const filterData = checklists.filter(({ schemeName }) => schemeName.toLowerCase().indexOf(value.toLowerCase()) > -1);
                    self.setState({ filterData })
                }
                else {
                    self.setState({ filterData: checklists })
                }
            }, 300)
        });
    }

}

