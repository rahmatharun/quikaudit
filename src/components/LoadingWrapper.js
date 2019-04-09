import React from 'react'
import { Transition, Progress, Header,Image } from 'semantic-ui-react'
import logo from '../assets/img/quikauditfull.png';

export default class LoadingWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: props.isloading,
            showLoading: props.isloading,
        }
    }
    render() {
        const { isLoading, showLoading } = this.state;
        return (
            <React.Fragment>
                <Transition visible={!isLoading} onHide={()=>{this.setState({showLoading:isLoading})}} animation='scale' duration={500}>
                <div>
                {this.props.children}
                </div>
                </Transition>
                <Transition unmountOnHide={true} visible={showLoading} onHide={()=>{
                  this.setState({isLoading:showLoading})
                   
                    }}  animation='scale' duration={500}>
                    <React.Fragment>
                    <Image centered size='small' src={logo} />
                <Header  style={{width:'90%'}} as='h2' icon textAlign='center'>
                                <Progress color="teal" percent={100} indicating />
                                <Header.Content> {this.props.title}</Header.Content>
                                <Header.Subheader>{this.props.subtitle}</Header.Subheader>
                            </Header>
                            </React.Fragment>
                </Transition>
            </React.Fragment>
        )
    }
    componentDidUpdate(prevProps, prevState) {
        // only update chart if the data has changed
        if (prevProps.isloading !== this.props.isloading) {
            if(this.props.isloading===false){
                this.setState({ showLoading: this.props.isloading })
            }
            else{
            this.setState({ isLoading: this.props.isloading })}
        }
    }
}

