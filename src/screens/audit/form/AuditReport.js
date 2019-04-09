import React from 'react';  
import pdfMake from "pdfmake/build/pdfmake";
import $ from '../../../components/api/lang';
import quikPopup from '../../../components/quikPopup';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Document,Page } from 'react-pdf';
import { Menu, Container,Divider, Icon,Progress, Button, Form, Input, Header, Image, List, Segment, Transition, Modal } from 'semantic-ui-react';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
import logo from '../../../assets/img/quikauditfull.png';

import audit from '../../../components/api/audit'
import {generatePDF} from '../../../components/function'
import {sharefile} from '../../../components/api/cordova'

export default class AuditReport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pdffile: props.navprops.pdffile,
            numPages: 0,
            pagesRendered: 0,
            isloaded:false,
            filename:'',
        }
        quikPopup.LoadingStart($.t.generatingreport);
    }
    render() {
        const { numPages, pagesRendered,isloaded,filename,pdffile } = this.state;

        /**
         * The amount of pages we want to render now. Always 1 more than already rendered,
         * no more than total amount of pages in the document.
         */
        const pagesRenderedPlusOne = Math.min(pagesRendered + 1, numPages);


        return (
            <Transition visible={isloaded} animation='fade' duration={500}>
            <div className="fullpage">
                <Menu color="teal" inverted borderless>
                <Menu.Item name='back'  onClick={()=>{
                                    this.setState({ isloaded: false });
                                    const nav = this.props.history;
                                    setTimeout(() => {
                                        nav.go(-5);
                                    }, 500)
                                }} >
                <Icon name='chevron left' />
                </Menu.Item>
                    <Menu.Item position='flex'>
                        <Header as='h2' textAlign='center' inverted color='white'>
                            {$.t.reporttxt} 
                        </Header>
                    </Menu.Item>
                    {/* <Menu.Item name='download' position="right"  onClick={()=>{downloadfile(filename,pdffile);}} >
                        <Icon name='download' />
                    </Menu.Item> */}
                    <Menu.Item name='share' position="right"  onClick={()=>{sharefile(filename,pdffile);}} >
                        <Icon name='share alternate' size='big' />
                    </Menu.Item>
                </Menu>
                
                {/* {isLoad ===true &&   <div className="flexPage centerflex">
                <Image centered size='small' src={logo} />
            <Header  style={{width:'90%'}} as='h2' icon textAlign='center'>
                            <Progress color="teal" percent={100} indicating />
                            <Header.Content> {$.t.generatingreport}</Header.Content>
                        </Header>
                        </div>} */}
                <div className="reportContainer">
              <Document
                    file={this.state.pdffile}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                >
                    {
                        Array.from(
                            new Array(pagesRenderedPlusOne),
                            (el, index) => {
                                const isCurrentlyRendering = pagesRenderedPlusOne === index + 1;
                                const isLastPage = numPages === index + 1;
                                const needsCallbackToRenderNextPage = isCurrentlyRendering && !isLastPage;

                                return (
                                    <Page
                                        key={`page_${index + 1}`}
                                        onRenderSuccess={
                                            needsCallbackToRenderNextPage ? this.onRenderSuccess : null
                                        }
                                        pageNumber={index + 1}
                                        width={window.innerWidth*0.96} 
                                        className="PdfPage"
                                    />
                                );
                            },
                        )
                    }
                </Document>
                </div>
                        
            </div>
        </Transition>
          

        )
    }
    componentDidMount(){
        this.setState({ isloaded: true});
        this.loadpdf();
    }
    loadpdf() {
        
        if (this.props.navprops.pdffile) {
            this.setState({ pdffile: this.props.navprops.pdffile,filename:this.props.navprops.filename});
        }
        else {
            const{audobj,isfull}=this.props.navprops;
            console.log(audobj);

            audit.loadAuditRecord(audobj.filename).then((audrecord) => {
                generatePDF(audobj, audrecord,isfull).then((data) => {
                    this.setState({ pdffile: data,filename:audobj.audtitle });
                    
                }).catch((e) => console.log(e));
            }).catch((e) => console.log(e));
           

        }
    }

    renderToolbar() {
        const backButton = <BackButton onClick={() => this.props.navigator.popPage()}>Back</BackButton>;
        return (
            <Toolbar>
                <div className='left'>{backButton}</div>
                <div className="center" style={{ display: "flex", justifyContent: "center", height: '100%', alignItems: "center", flexDirection: "column" }}>

                    {this.props.navprops.title}

                </div>
                <div className="right" >
                    <ToolbarButton disabled={true}></ToolbarButton>
                </div>
            </Toolbar>
        )
    }


    onDocumentLoadSuccess = ({ numPages }) =>
    {    this.setState({
            numPages,
            pagesRendered: numPages,
        });
        quikPopup.LoadingStop();
    }

    onRenderSuccess = () =>
        this.setState(prevState => ({
            pagesRendered: prevState.pagesRendered + 1,
        }));




}