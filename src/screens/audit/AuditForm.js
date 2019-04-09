import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PickPremise from './form/PickPremise';
import PickScheme from './form/PickScheme';
import PickCat from './form/PickCat';
import StartAudit from './form/StartAudit';
import AuditFinal from './form/AuditFinal';
import AuditReport from './form/AuditReport';
import AuditChecklist from './form/AuditChecklist';
import AuditNCList from './form/AuditNCList';

import '../../assets/css/Audit.css'

export default class AuditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded: false,
            prmsPK: 0, checklistID: 0, ctgList:[],ctg: "",startdate:null,
            navprops:null,
            parentprops:props.navprops,
        }
    }

    render() {
        const { isloaded,parentprops,navprops, prmsPK,checklistID,ctg,ctgList ,startdate} = this.state;
        return (
            <Switch>
                <Route
                    exact path={this.props.match.path} 
                    render={(props) => <PickPremise {...props} prmsPK={prmsPK} setFormData ={ this.setFormData }/>}
                />
                <Route
                 path={`${this.props.match.path}/scheme`} 
                render={(props) => <PickScheme {...props} checklistID={checklistID} setFormData ={ this.setFormData }/>}
                />
                <Route
                 path={`${this.props.match.path}/category`} 
                render={(props) => <PickCat {...props} ctg={ctg} ctgList={ctgList} setFormData ={ this.setFormData }/>}
                />
                
                <Route
                 path={`${this.props.match.path}/confirm`} 
                render={(props) => <StartAudit {...props} ctg={ctg} checklistID={checklistID} prmsPK={prmsPK} setFormData ={ this.setFormData } />}
                />
                 <Route
                 path={`${this.props.match.path}/cklist/:id?`} 
                render={(props) => <AuditChecklist {...props} navigate={this.navigate}  parentprops={parentprops} ctg={ctg} checklistID={checklistID} prmsPK={prmsPK} startdate={startdate} startAudit ={ this.startAudit } />}
                />
                <Route
                 path={`${this.props.match.path}/auditfinal`} 
                render={(props) => <AuditFinal {...props} navprops={navprops} navigate={this.navigate} />}
                />
                 <Route
                 path={`${this.props.match.path}/auditreport`} 
                render={(props) => <AuditReport {...props} navprops={navprops} navigate={this.navigate} />}
                />
                 <Route
                 path={`${this.props.match.path}/auditnc`} 
                render={(props) => <AuditNCList {...props} navprops={navprops} navigate={this.navigate} />}
                />
            </Switch>
        );
    }
    componentDidMount() {
        this.setState({ isloaded: true });

    }
    componentDidUpdate(prevprops){
        if(prevprops.navprops!==this.props.navprops){
            this.setState({ parentprops:this.props.navprops });
        }
    }
    navigate=(path,navprops)=>{
       
        this.setState({navprops});
        let nav = this.props.history;
        nav.push(path);
    }

    setFormData = (data) => {
        this.setState(data);
    }
    startAudit=(datetime)=>{
        alert("start audit");
        this.setState({prmsPK: 0, checklistID: 0, ctgList:[],ctg: ""});
    }

}

