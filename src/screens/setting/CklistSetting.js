import React, { Component } from 'react';
import $ from '../../components/api/lang';
import quikPopup from '../../components/quikPopup';
import { Menu, Container, Icon, List, Divider, Dropdown, Button, Form, Grid, Header, Image, Message, Segment, Transition, Modal } from 'semantic-ui-react';

export default class CklistSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded: false,
            checklists: [],
            filterData: [],
            typing: false,
            typingTimeout: 0,
            search: "",
        }
    }

    render() {
        const { isloaded, filterData } = this.state;
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
                                {$.t.checklisttxt}
                            </Header>
                        </Menu.Item>
                    </Menu>
                    <Container className="menuContainer">
                            <Input className="searchBar" fluid icon='search' placeholder='Search...' size="huge"
                                onChange={this.handleInputChange} name="search" />
                            <List selection divided verticalAlign='middle' size='huge' className="listPremiseBox"  >
                                {
                                    filterData.map((item, i) => (
                                        <List.Item key={i} onClick={() => {
                                        }}>
                                            <List.Icon name='warehouse' />
                                            <List.Content>
                                                <List.Header >{item.schemeName}</List.Header>
                                                {/* {item.schemeVersion} */}
                                            </List.Content>
                                        </List.Item>
                                    ))
                                }
                            </List>
                    </Container>

                </div>
            </Transition>
        );
    }
    componentDidMount() {
        const checklists = auth.authStatus.checklists.filter(({ schemeLang }) => schemeLang.toLowerCase() === $.activeLang.toLowerCase())
        this.setState({
            isloaded: true,
            checklists, filterData: checklists
        });
        // $.getLangList().then(x=>{

        //     let langlist = [];
        //     Object.entries(x).forEach(
        //         ([key, value]) => langlist.push({ key, text: value, value: key })
        //     );
        //     this.setState({ 
        //         isloaded:true,
        //         language:x,langlist
        //         })
        // })


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

