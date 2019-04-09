import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SettingScreen from '../screens/setting/SettingScreen'
import LangSetting from '../screens/setting/LangSetting'
import CklistSetting from '../screens/setting/CklistSetting'

const SettingNavigator = (props) => {
        return (
                <Switch>
                        <PropsRoute exact path={props.match.path} {...props}  component={SettingScreen} />
                        <PropsRoute exact path={`${props.match.path}/lang`} {...props}  component={LangSetting} />
                        <PropsRoute exact path={`${props.match.path}/cklist`} {...props}  component={CklistSetting} />
                        
                </Switch>
        );

}
export default SettingNavigator


const  PropsRoute = ({ component: Component,navprops,navigate,logOut, ...rest }) => (
    <Route  {...rest} render={(props) => <Component {...props} logOut={logOut} navprops={navprops} navigate={navigate} />}
   />  
    )