import ReactDOM from "react-dom";
import React, { Component } from 'react';

const rootdom = document.getElementById("popup");

class quikPopup {

    constructor() {
        this.pageOpen=null;
        this.pageClose=null;
        this.Open=null;
        this.Close=null;
        this.LoadingStart=null;
        this.LoadingStop=null;
    }

    // Open = (child) => {
    //    return ReactDOM.createPortal(
    //         <Popup onClick={(e)=>{this.Close()}}>
    //         {child}
    //      </Popup>,
    //         rootdom
    //       );
    // }
    // Close = () => {
    //     ReactDOM.render("", rootdom);
    // }  
}

function Popup(props) {
    return (
        <div className="quikPopup" onClick={props.onClick}>
        <div>
            {props.children}
        </div>
        </div>
    );
}

export default new quikPopup

