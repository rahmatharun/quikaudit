import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import auth from '../components/api/auth';
import HomeScreen from '../screens/home/HomeScreen'

import AuditForm from '../screens/audit/AuditForm'

const HomeNavigator = (props) => {
        return (
                <Switch>
                        <Route path={props.match.path}   component={HomeScreen} />
                </Switch>
        );

}
export default HomeNavigator
