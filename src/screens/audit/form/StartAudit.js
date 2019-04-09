import React, { Component } from 'react';
import auth from '../../../components/api/auth';
import $ from '../../../components/api/lang';
import { Item, List, Menu, Input, Container, Icon, Button, Form, Grid, Header, Image, Message, Segment, Transition } from 'semantic-ui-react';
import moment from 'moment'

export default class StartAudit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded: false,
            datetime:moment()
        }
    }

    render() {
        const { isloaded,datetime } = this.state;
        const { prmsPK, checklistID, ctg } = this.props;
        const premise = auth.authStatus.premise.filter((x) => x.prmsPK === prmsPK)[0];
        const checklist = auth.authStatus.checklists.filter((x) => x.checklistID === checklistID)[0];
        return (
            <Transition as="div" visible={isloaded} animation='horizontal flip' duration={500}>
                <div className="fullpage">
                    <div className="flexPage">
                        <Menu color="teal" inverted size='huge' borderless>
                            <Menu.Item position="flex" >
                                <Header as='h2' textAlign='left' inverted>
                                    {$.t.confirmation} :
                    </Header>
                            </Menu.Item>
                        </Menu>

                        <div className="confirmBox">
                            
                            <Header size='medium'>
                            {$.t.premisetxt}
                            <Header size='large'  color="teal">{premise.prmsName}
                            <Header.Subheader>{premise.prmsAddrs}</Header.Subheader>
                            </Header>
                            
                            </Header>
                            <Header size='medium'>
                            {$.t.schemetxt}
                            <Header size='large'  color="teal">{checklist.schemeName}
                            <Header.Subheader>{ctg}</Header.Subheader>
                            </Header>
                            
                            </Header>

                            <Header size='medium'>
                            {$.t.date}
                            <Header size='large'  color="teal">{datetime.format('MMMM Do YYYY')}
                            <Header.Subheader>{datetime.format('hh:mm:ss a')}</Header.Subheader>
                            </Header>
                            </Header>

                        </div>
                        <div className="navButton">

                        <Button basic fluid  size='big' color='teal' content={$.t.startaudittxt}
                         onClick={() => {
                            this.setState({ isloaded: false });
                            const nav = this.props.history;
                            this.props.setFormData({ startdate:datetime })
                            setTimeout(() => {
                                nav.push(`/main/audit/cklist`)
                            }, 500)
                        }}
                        /><br/>
                        <Button basic fluid  size='big' color='red' content={$.t.backtxt} 
                         onClick={() => {
                            this.setState({ isloaded: false });
                            const nav = this.props.history;
                            setTimeout(() => {
                                nav.goBack()
                            }, 500)
                        }}
                        /><br/>
                         <Button basic fluid  size='big' color='red' content={$.t.canceltxt} 
                         onClick={() => {
                            this.setState({ isloaded: false });
                            const nav = this.props.history;
                            setTimeout(() => {
                                nav.go(-5)
                            }, 500)
                        }}
                        />
                        </div>

                    </div>
                </div>

            </Transition>
        );
    }
    componentDidMount() {
        this.setState({
            isloaded: true,
        });

        this.clock = setInterval(
            () => this.setState({datetime:moment()}),
            1000
          );

    }
    componentWillMount(){
        if(this.clock) clearInterval(this.clock);
    }



}

