import React, { Component } from 'react';
import auth from '../../components/api/auth';
import  $ from '../../components/api/lang';
import { Button, Form, Grid, Header, Image, Message, Segment ,Transition} from 'semantic-ui-react';
import LoadingWrapper from '../../components/LoadingWrapper';
import logo from '../../assets/img/quikauditfull.png';
import '../../assets/css/Login.css'


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded:false,
            email: "", password: "",
            errMsg: "",
            isFormLoading:false,
        }   

       // auth.checkAuth().then(x => this.setState({ isloaded: true }))
    }
    componentDidMount() {
        this.setState({isloaded:true });
    }

    render() {
        const {email, password, errMsg,isloaded,isFormLoading } = this.state
        return (
            
            <Transition visible={isloaded} animation='horizontal flip' duration={500}>
            <div className='login-form'>
                {/*
              Heads up! The styles below are necessary for the correct render of this example.
              You can do same with CSS, the main idea is that all the elements up to the `Grid`
              below must have a height of 100%.
            */}
                <Grid textAlign='center' style={{ height: '100%',margin:0 }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 400 }}>
                    <LoadingWrapper isloading={isFormLoading} title="Loading.." >
                            <React.Fragment>
                        <Header as='h2' color='teal' icon>
                        <Image src={logo}/> 
                            <Header.Content>{$.t.login}</Header.Content>
                        </Header>
                        <Form size='large' onSubmit={this.handleSubmit} error>
                                <Segment color={errMsg.length > 0 ? 'red' : ''} stacked>
                                    <Transition visible={errMsg.length > 0} animation='scale' duration={500}>
                                    <Message error header='Login Failed' content={errMsg} />
                                    </Transition>
                                    <Form.Input fluid icon='user' iconPosition='left' placeholder={$.t.companyid}
                                        value={email}
                                        name="email"
                                        type="text"
                                        onChange={this.handleInputChange} required />
                                    <Form.Input
                                        fluid
                                        icon='lock'
                                        iconPosition='left'
                                        placeholder={$.t.password}
                                        type='password'
                                        value={password}
                                        name="password"
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                <Button color='teal' fluid size='large'>{$.t.login}</Button>
                            </Segment>
                        </Form>
                        </React.Fragment>
                        </LoadingWrapper>
                    </Grid.Column>
                </Grid>
            </div>
            
            </Transition>
        );
    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit = (event) => {
        this.setState({ errMsg: "",isFormLoading:true })
        this.login();
        event.preventDefault();
    }

    login = () => {
        const { email, password } = this.state;
        const data = { email, password };
        auth.onAuth(data).then(results => {
            console.log(results)
            if (results.isLogin) {
                this.setState({ isloaded:false });
                setTimeout(()=>{this.props.updateLoginState(); }, 500)
            }
            else {
                
                setTimeout(()=>{ this.setState({ errMsg: $.t.loginfail,isFormLoading:false }) }, 500)
                
            }
        });
    }
}


