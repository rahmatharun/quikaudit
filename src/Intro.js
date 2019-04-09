import React from 'react'
import { Transition, Progress, Header,Image ,Grid} from 'semantic-ui-react'
import logo from './assets/img/quikauditfull.png';

export default class Intro extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
        }
    }

    render() {
        const {show} = this.state;

        return(
            <div className="introPage">
            <Transition unmountOnHide={true} visible={show} animation='fade' duration={2000}>
              <Header as='h2' icon textAlign='center'>
                              <Image className="introImg" centered size='massive' src={logo} />
                          </Header>
                  
              </Transition>
              </div>
        )
    }

}