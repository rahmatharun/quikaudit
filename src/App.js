import React, { Component } from 'react';
import AuthNavigator from './navigations/AuthNavigator';
import Intro from './Intro';
import { Button, Modal, Dropdown } from 'semantic-ui-react'
import './assets/css/App.css';
import 'semantic-ui-css/semantic.min.css'

import lang from './components/api/lang';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            intro: true,
            open: false,
            langlist: [],
            deviceReady: false,
        }
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }

    render() {
        const { intro, open, langlist, deviceReady } = this.state;
        if (intro === true || deviceReady === false) return (
            <React.Fragment>
                <Intro show={(intro === true || deviceReady === false)} />
                <Modal basic size="small" open={open} onClose={this.close}
                    closeOnEscape={false}
                    closeOnDimmerClick={false}
                >
                    <Modal.Header icon='settings' content='Language' />
                    <Modal.Content>
                        <Dropdown
                            button
                            className='icon'
                            labeled
                            icon='world'
                            options={langlist}
                            closeOnChange
                            text='Select Language'
                            fluid
                            onChange={this.setLang}
                        />
                    </Modal.Content>

                </Modal>
            </React.Fragment>
        )
        else {
            return (<AuthNavigator />);
        }
    }
    componentDidMount() {
        lang.getLang().then((x) => {
            this.setState({ intro: false })
        }).catch(e => {
            lang.getLangList().then(x => {
                let langlist = [];
                Object.entries(x).forEach(
                    ([key, value]) => langlist.push({ key, text: value, value: key })
                );
                this.setState({ langlist });
                this.show();
            }).catch(e => {
                console.log(e);
                alert("Please make sure you have an active internet connection.")
            })
            // this.show();
        })

    }

    onDeviceReady = () => {
        console.log("device Ready");
        console.log(device.cordova);  // eslint-disable-line
        this.setState({ deviceReady: true });
    }

    show = () => this.setState({ open: true })
    close = () => this.setState({ open: false })
    setLang = (e, data) => {
        lang.setLang(data.value);
        this.close();

        setTimeout(() => {
            this.setState({ intro: false });
        }, 1500)
    }

}

export default App;
