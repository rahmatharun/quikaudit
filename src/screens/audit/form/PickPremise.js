import React, { Component } from 'react';
import auth from '../../../components/api/auth'
import {  Redirect } from 'react-router-dom';
import $ from '../../../components/api/lang';
import { List, Menu, Input, Container, Icon, Button, Form, Grid, Header, Image, Message, Segment, Transition } from 'semantic-ui-react';


export default class PickPremise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloaded: false,
      premise: [],
      filterData: [],
      typing: false,
      typingTimeout: 0,
      selected: 0,
      search: "",
    }
  }

  render() {
    const { isloaded, filterData, selected } = this.state;
    if(!(auth.authStatus.premise.length>1)){
      this.props.setFormData({ prmsPK: auth.authStatus.premise[0].prmsPK });
      return  <Redirect to={`${this.props.match.path}/scheme`
    }/>}
    return (
      <Transition as="div" visible={isloaded} animation='horizontal flip' duration={500}>
        <div className="fullpage">
          <div className="flexPage">
            <Menu color="teal" inverted size='huge'>
              <Menu.Item position="left" >
                <Header as='h2' textAlign='left' inverted color='white'>
                  {$.t.selectpremisetxt} :
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
                      this.props.setFormData({ prmsPK: item.prmsPK });
                      this.setState({ selected: item.prmsPK, isloaded: false });
                      let nav = this.props.history;
                      setTimeout(() => {
                        nav.push(`${this.props.match.path}/scheme`)
                      }, 500)
                    }} active={selected === item.prmsPK}>
                      <List.Icon name='marker'  verticalAlign="middle" />
                      <List.Content>
                        <List.Header >{item.prmsName}</List.Header>
                        {item.prmsAddrs}
                      </List.Content>
                    </List.Item>
                  ))
                }
              </List>
            </div>
            <div className="navButton">
              <Button color='teal' size='huge' floated='right' basic icon='chevron right' circular
                onClick={() => {
                  
                  if(this.state.selected!==0){
                    
                    this.setState({ isloaded: false });
                    const nav = this.props.history;
                      setTimeout(() => {
                        nav.push(`${this.props.match.path}/scheme`)
                      }, 500)
                  }
                  else{
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
    this.setState({ isloaded: true, premise: auth.authStatus.premise, filterData: auth.authStatus.premise, selected: this.props.prmsPK });

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
        const { premise } = self.state;
        if (value.length) {
          const filterData = premise.filter(({ prmsName, prmsAddrs }) => prmsName.toLowerCase().indexOf(value.toLowerCase()) > -1 || prmsAddrs.toLowerCase().indexOf(value.toLowerCase()) > -1);
          self.setState({ filterData })
        }
        else {
          self.setState({ filterData: premise })
        }
      }, 300)
    });
  }

}

