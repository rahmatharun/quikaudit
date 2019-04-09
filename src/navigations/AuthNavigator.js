import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import  auth  from '../components/api/auth';
import Login from '../screens/auth/Login';
import MainNavigator from './MainNavigator';
import AuditForm from '../screens/audit/AuditForm'

 

export default class AuthNavigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated:false,
            isloaded:false
        }
        
        auth.checkAuth().then(x=>this.setState({isloaded:true,isAuthenticated:x}))
     // auth.isSessionExist();
    }
    componentDidMount(){
     //   auth.checkAuth().then(x=>this.setState({isAuthenticated:x.isActive}))
    }

    render() {
        return ( this.state.isloaded &&
                <Switch>
                    <this.PrivateRoute  path="/main" component={MainNavigator} />
                    {/* <this.PrivateRoute exact path="/audit"   component={AuditForm} /> */}
                    <this.AuthRoute  component={Login} />
                </Switch>
        );
    }
    AuthRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => {
            props.updateLoginState=this.updateLoginState;
            return(
            this.state.isAuthenticated !== true? <Component {...props} />: <Redirect to='/main' />
        )
    }} />
    )

    PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => {
            props.logOut=this.logOut;
            return (  this.state.isAuthenticated === true? <Component {...props} />: <Redirect to='/' />
        )
        return(<h1></h1>)
    }} />
    )
    logOut=()=>{
        auth.clearAuth();
        this.setState({isAuthenticated:false});
    }

    updateLoginState=()=>{
        this.setState({isAuthenticated:auth.isAuthenticated})
    }
}


