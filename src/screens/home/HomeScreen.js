import React, { Component } from 'react';
import $ from '../../components/api/lang';
import { Menu, Container, Icon, Button, Form, Grid, Header, Image, Message, Segment, Transition,Modal } from 'semantic-ui-react';
import audit from '../../components/api/audit';
import auth from '../../components/api/auth';


export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded: false,totalAudit:0,loopcount:0,data:[]
        }
    }

    render() {
        const { isloaded,totalAudit,data } = this.state;
        return (
            <Transition visible={isloaded} animation='fade' duration={500}>
                <div className="fullpage">
                    <Menu color="teal" inverted widths={3}>
                        <Menu.Item>
                            <Header as='h2' textAlign='center' inverted color='white'>
                                QuikAudit
                    </Header>
                        </Menu.Item>
                    </Menu>
                    <Container className="menuContainer">
                        <Grid verticalAlign='middle' centered columns='equal' stretched>
                        <Grid.Column width={16} >
                                <Header onClick={() => {
                                    this.props.history.push(`${this.props.match.path}/audit`)
                                }} block as='h2' icon>
                                    <Icon name='clipboard check' />
                                    {$.t.newaudit}
                                    <Header.Subheader>{$.t.loadingauditchecklist}</Header.Subheader>
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={16} >
                                <Header onClick={() => {
                                    this.props.navigate('auditlist',{data})
                                }} block as='h2' icon>
                                    <Icon name='list alternate outline' />
                                    {$.t.auditrecord}
                                    <Header.Subheader>{$.t.totalaudit} : {totalAudit}</Header.Subheader>
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={16} >
                                <Header onClick={() => {  this.props.navigate('setting')}} block as='h2' icon>
                                    <Icon name='settings' />
                                    {$.t.settingtxt}
                                    {/* <Header.Subheader>Log out from apps.</Header.Subheader> */}
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={16} >
                                <Header onClick={() => { this.props.logOut() }} block as='h2' icon>
                                    <Icon name='sign-out' />
                                    {$.t.logout}
                                    {/* <Header.Subheader>Log out from apps.</Header.Subheader> */}
                                </Header>
                            </Grid.Column>
                        </Grid>
                    </Container>
                </div>
            </Transition>
        );
    }
    componentDidMount() {
        const checklists = auth.authStatus.checklists
        console.log(checklists);
        audit.getAudList().then(x=>{
            console.log(x)
            this.setState({ isloaded: true,totalAudit:x?x.length:0,data:x });
        }).catch(e=>{
            this.setState({ isloaded: true,totalAudit:0});
        }
        )
    }
    componentDidUpdate(prevProps) {
        
        // if(this.props.location.pathname=="/main"){
        //     audit.getAudList().then(x=>{
        //         if(x.length!==this.state.totalAudit){
        //         this.setState({ totalAudit:x?x.length:0 });}
        //     }).catch(e=>{
        //     }
        //     )
        //     } 
      
      }
      

}

