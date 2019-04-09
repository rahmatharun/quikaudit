import React, { Component } from 'react';
import $ from '../../components/api/lang';
import quikPopup from '../../components/quikPopup';
import { Menu, Container, Icon, Button, Form, Input, Header, Image, List, Segment, Transition, Modal } from 'semantic-ui-react';


export default class CompleteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded: false,
            auditlist: [],
            filterData: [],
            typing: false,
            typingTimeout: 0,
            search: "",
        }
    }

    render() {
        const { isloaded,filterData } = this.state;
        return (
            <Transition visible={isloaded} animation='fade' duration={500}>
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
                        <Menu.Item  position='flex'>
                            <Header as='h2' textAlign='center' inverted color='white'>
                                {$.t.reporttxt}
                    </Header>
                        </Menu.Item>
                    </Menu>
                    <Container className="menuContainer">
                        <Input className="searchBar" fluid icon='search' placeholder='Search...' size="huge"
                            onChange={this.handleInputChange} name="search" />
                        <List selection divided verticalAlign='middle' size='huge' className="listPremiseBox"  >
                            {filterData &&
                                filterData.map((item, i) => (
                                    <List.Item key={i} onClick={() => {this.reportOption(item);}}>
                                        <List.Icon name='marker' verticalAlign="middle" />
                                        <List.Content>
                                            <List.Header >{item.audtitle}</List.Header>
                                            {item.premisAddrs}
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
        const {completeList}=this.props.navprops;
        completeList.reverse();
        this.setState({ isloaded: true, auditlist: completeList, filterData:completeList});
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
        const { auditlist } = self.state;
        if (value.length) {
          const filterData = auditlist.filter(({ audtitle }) => audtitle.toLowerCase().indexOf(value.toLowerCase()) > -1 );
          self.setState({ filterData })
        }
        else {
          self.setState({ filterData: auditlist })
        }
      }, 300)
    });
  }
  reportOption=(item)=>{
      
    quikPopup.Open($.t.viewreport ,
        
  <List divided relaxed size="huge" selection className="optButton">
        <List.Item onClick={() => { this.openReport(true,item)}}>
        <List.Icon name='file alternate' />
        <List.Content>
            <List.Header>{$.t.fullreport}</List.Header>
        </List.Content>
    </List.Item>
    <List.Item onClick={() => {  this.openReport(false,item) }}>
        <List.Icon name='file alternate outline' />
        <List.Content>
            <List.Header>{$.t.auditsummary}</List.Header>
        </List.Content>
    </List.Item>
    </List>
    )
}
openReport=(isfull,item)=>{
    quikPopup.Close();
    this.setState({isloaded: false });
    let nav = this.props.navigate;
    setTimeout(() => {
        nav('auditReport',{audobj:item,isfull})
    }, 500)
    
}

}

