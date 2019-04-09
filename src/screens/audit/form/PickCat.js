import React, { Component } from 'react';
import auth from '../../../components/api/auth';
import {  Redirect } from 'react-router-dom';
import $ from '../../../components/api/lang';
import { List, Menu, Input, Container, Icon, Button, Form, Grid, Header, Image, Message, Segment, Transition } from 'semantic-ui-react';


export default class PickCat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded: false,
            category: [],
            filterData: [],
            typing: false,
            typingTimeout: 0,
            selected: "",
            search: "",
        }
    }

    render() {
        const { isloaded, filterData, selected } = this.state;
        if(!(this.props.ctgList.length>1)){
            const item= this.props.ctgList[0];
             this.props.setFormData( { ctg: item })
             return  <Redirect to={'/main/audit/confirm'}/>
         }
        return (
            <Transition as="div" visible={isloaded} animation='horizontal flip' duration={500}>
                <div className="fullpage">
                    <div className="flexPage">
                        <Menu color="teal" inverted size='huge'>
                            <Menu.Item position="left" >
                                <Header as='h2' textAlign='left' inverted color='white'>
                                    {$.t.category} :
                    </Header>
                            </Menu.Item>
                        </Menu>

                        <div className="pickerBox">

                            <Input className="searchBar" fluid icon='search' placeholder='Search...' size="huge"
                                onChange={this.handleInputChange} name="search" />
                            <List selection divided Relaxed verticalAlign='middle' size='massive' className="listPremiseBox"  >
                                {
                                    filterData.map((item, i) => (
                                        <List.Item key={i} onClick={() => {
                                            this.setState({ selected: item,isloaded: false });
                                            this.props.setFormData({ ctg: item });
                                            const nav = this.props.history;
                                            setTimeout(() => {
                                                nav.push(`/main/audit/confirm`)
                                            }, 500)
                                        }} active={selected === item}>
                                            <List.Icon name='tag' />
                                            <List.Content>
                                                <List.Header >{item}</List.Header>
                                            </List.Content>
                                        </List.Item>
                                    ))
                                }
                            </List>
                        </div>
                        <div className="navButton">
                            <Button color='teal' size='huge' floated='right' basic icon='chevron right' circular
                                onClick={() => {

                                    if (this.state.selected !== "") {

                                        this.setState({ isloaded: false });
                                        const nav = this.props.history;
                                        setTimeout(() => {
                                                nav.push(`/main/audit/confirm`)
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
        const category = this.props.ctgList;
        console.log(category);
        this.setState({
            isloaded: true,
            category, filterData: category, selected: this.props.ctg
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
                const { category } = self.state;
                if (value.length) {
                    const filterData = category.filter((item) => item.toLowerCase().indexOf(value.toLowerCase()) > -1);
                    self.setState({ filterData })
                }
                else {
                    self.setState({ filterData: category })
                }
            }, 300)
        });
    }

}

