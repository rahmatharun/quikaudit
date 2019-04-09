import React from 'react';
import {  generatePDF } from '../../components/function';
import audit from '../../components/api/audit';
import PieChart from '../../components/PieChart';
//import CommentBox from '../../component/CommentBox';
import auditNC from './auditNC';
import { setData, getData } from '../../component/storage';
import auditViewReport from '../Report/auditViewReport';

import CanvasDrawer from '../../component/CanvasDrawer';

export default class auditFinal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoad: true,
            comment: '',
            final: false,
            user: {},
            sign: 0, auditee: '', auditeePost: '',
            signImg: {},
            needFollowUp: false,
        }
        this.serv = [];
        this.audrecord;
    }

    render() {
        let nc1 = (typeof this.serv[1] !== "undefined" ? this.serv[1].data.length : 0);
        let nc2 = (typeof this.serv[2] !== "undefined" ? this.serv[2].data.length - this.serv[2].pass : 0);
        let nc3 = (typeof this.serv[3] !== "undefined" ? this.serv[3].data.length - this.serv[3].pass : 0);
        let nc4 = (typeof this.serv[4] !== "undefined" ? this.serv[4].data.length - this.serv[4].pass : 0);
        let nc5 = (typeof this.serv[5] !== "undefined" ? this.serv[5].data.length - this.serv[5].pass : 0);
        let pass = nc1
            + (nc2 > 0 ? this.serv[2].pass : 0)
            + (nc3 > 0 ? this.serv[3].pass : 0)
            + (nc4 > 0 ? this.serv[4].pass : 0)
            + (nc5 > 0 ? this.serv[5].pass : 0)
        let total = pass + nc2 + nc3 + nc4 + nc5;


        let totalpass = (pass / total) * 360;
        let minor = (nc2 / total) * 360;
        let major = (nc3 / total) * 360;
        let st = (nc4 / total) * 360;
        let sc = (nc5 / total) * 360;

        let passpc = ((pass / total) * 100).toFixed(2);
        let minorpc = ((nc2 / total) * 100).toFixed(2);
        let majorpc = ((nc3 / total) * 100).toFixed(2);
        let stpc = ((nc4 / total) * 100).toFixed(2);
        let scpc = ((nc5 / total) * 100).toFixed(2);
        let rendernc = [];

        rendernc.push(
            <ListItem modifier="chevron" tappable>
                <div class="left">
                    <Icon icon="ion-pie-graph" style={{ fontSize: '2em', color: colors[0][0] }} />
                </div>
                <div class="center">
                    <span class="list-item__title">{nc[0]}</span><span class="list-item__subtitle">{
                        (pass) + "/" + total
                    }</span>
                </div>


            </ListItem>
        )
        return (
            <Page id="auditFinal"
                renderModal={() => {

                }}
                renderToolbar={this.renderToolbar.bind(this)}
            >
                <Modal isOpen={this.state.isLoad}>
                    <p>
                        <Icon style={{ color: 'white', fontSize: '5em' }} spin icon='md-spinner' />
                    </p>
                    <p>Loading...</p>
                </Modal>
                <div style={{ margin: "2vmin", backgroundColor: "white", border: "1px solid #ccc", borderRadius: "1vmin" }}>
                    <ListHeader style={{ fontSize: 15 }} className="testClass"> Performance </ListHeader>
                    <PieChart includeLabels={true} data={[totalpass, minor, major, st, sc]}
                        labels={[passpc + "%", minorpc + "%", majorpc + "%", stpc + "%", scpc + "%"]}
                        legend={[]}
                    />
                </div>

                <List modifier="inset"
                    dataSource={this.serv}
                    renderHeader={() =>
                        <ListHeader style={{ fontSize: 15 }} className="testClass"> Details </ListHeader>}
                    renderRow={(row, idx) => {
                        if (idx > 1) {
                            rendernc.push(
                                <ListItem modifier="chevron" onClick={() => this.closeNC(idx)} tappable>
                                    <div class="left">
                                        <Icon icon="ion-pie-graph" style={{ fontSize: '2em', color: colors[idx - 1][0] }} />
                                    </div>
                                    <div class="center">
                                        <span class="list-item__title">{nc[idx - 1]}</span><span class="list-item__subtitle">{
                                            (row.data.length - row.pass) + "/" + row.data.length

                                        }</span>
                                    </div>


                                </ListItem>);
                        }
                        if (idx == this.serv.length - 1) { return rendernc }
                    }}
                />
                <List modifier="inset" style={{ marginTop: "2vmin", marginBottom: "2vmin" }}>
                    <ListHeader style={{ fontSize: 15 }}> Actions </ListHeader>
                    <ListItem tappable>
                        <div class="left">
                            <Checkbox
                                inputId="followup" onChange={event => { this.setState({ needFollowUp: event.target.checked }) }} checked={this.state.needFollowUp}
                            />
                        </div>
                        <div class="center" htmlFor="followup">
                            <span class="list-item__title">Need to Follow-Up?</span>
                            <span class="list-item__subtitle">State if the document need follow up audit.</span>
                        </div>
                    </ListItem>
                    <ListItem modifier="chevron" onClick={this.addNotes.bind(this)} tappable>
                        <div class="left">
                            <Icon icon="ion-compose" style={{ fontSize: '2em', }} />
                        </div>
                        <div class="center">
                            <span class="list-item__title">Notes</span>
                            <span class="list-item__subtitle">Summary comment for overall audit performance</span>
                        </div>
                    </ListItem>

                    <ListItem modifier="chevron" onClick={this.signaudit.bind(this)} tappable>
                        <div class="left">
                            <Icon icon="ion-document-text" style={{ fontSize: '2em', }} />
                        </div>
                        <div class="center">
                            <span class="list-item__title">Finishing Report</span>
                            <span class="list-item__subtitle">Proceed to signing and closing the audits.</span>
                        </div>
                    </ListItem>
                </List>

                <Modal isOpen={this.state.final}>
                    {this.state.sign ? (
                        <p>Saya akui audit dijalankan dengan penuh integriti dan tiada sebarang pemalsuan dokumen dan bukti dan penyembunyian fakta dilaporkan</p>
                    ) : (
                            <p>Saya akui audit yang telah dijalankan di premis dibawah pengawasan saya dilaksanakan secara sepenuhnya dan saya akui dan bersetuju untuk menerima laporan yang dikeluarkan dan segala tindakan pembetulan yang perlu dilaksanakan</p>
                        )}
                    <CanvasDrawer ref='signImg' brushcolor="#000" bgcolor="#FFF" />
                    {this.state.sign ? (

                        [<p><Input
                            value={this.state.auditee} float
                            onChange={(event) => { this.setState({ auditee: event.target.value }) }}
                            modifier='material' className="modalinput"
                            placeholder='Name' /></p>, <p>
                            <Input
                                value={this.state.auditeePost} float
                                onChange={(event) => { this.setState({ auditeePost: event.target.value }) }}
                                modifier='material' className="modalinput"
                                placeholder='Position' /></p>]

                    ) : ([
                        <p>{this.state.user.name}</p>,
                        <p>Ceritfied Halal Auditor</p>]
                        )}


                    <div className="buttonright">

                        <Button modifier='outline' onClick={this.signNext.bind(this)}>{(this.state.sign ? "Finish" : "Next")} <Icon icon='ion-chevron-right'></Icon></Button>
                        <Button modifier='outline' onClick={() => { this.setState({ final: false }) }}>Cancel <Icon icon='ion-chevron-right'></Icon></Button>

                    </div>
                </Modal>
            </Page>
        );
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
        );
    }

    componentDidMount() {
        this.loadReport();
        getData("loginuser").then((user) => {
            console.log(user)
            this.setState({ user })
        })
    }

    loadReport() {
        let audObj = this.props.navprops.audObj;
        if (typeof audObj !== "undefined") {

            loadAuditRecord(audObj.filename).then((data) => {
                this.audrecord = data;
                this.serv = []

                data.cklist.forEach(({ items }) => {
                    items.forEach((data) => {
                        if (typeof this.serv[data.severity] == "undefined") {
                            this.serv[data.severity] = { data: [data], pass: 0 }
                        }
                        else { this.serv[data.severity].data.push(data) }
                        if (this.audrecord.result[data.id]) {
                            this.serv[data.severity].pass++;
                        }

                    })
                })
                setTimeout(() => {
                    this.setState({ isLoad: false });
                }, 1000);
            }).catch((e) => console.log(e))
        }
    }
    calculateNC(id) {


    }

    closeNC(id) {
        let nav = this.props.navigator;
        nav.pushPage({
            component: auditNC, props: {
                title: nc[id - 1],
                ncList: this.serv[id].data,
                result: this.audrecord.result, comment: this.audrecord.comment,
                figure: this.audrecord.figure,
                saveUpdate: (x) => {
                    this.audrecord.result = x.result;
                    this.audrecord.comment = x.comment;
                    this.audrecord.figure = x.figure;
                    this.serv[id].pass = x.pass;
                    this.saveAudit();
                }
            }
        })
    }
    saveAudit(cb) {
        if (cb === undefined) {
            cb = function () { };
        }
        saveAuditRecord(this.props.navprops.audObj, this.audrecord).then((success) => cb()).catch((e) => console.log(e));


    }
    signaudit() {
        let canvas = this.refs.signImg.refs.canvas;
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        this.setState({ sign: 0 });
        this.setState({ final: true });

    }
    signNext() {
        let canvas = this.refs.signImg.refs.canvas;
        let pngUrl = canvas.toDataURL();

        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        let x = this.state.sign
        if (x) {
            this.setState({ final: false, isLoad: true, });
            this.audrecord.notes = this.state.comment;
            this.audrecord.auditor = this.signImg;
            this.audrecord.auditee = { name: this.state.auditee, post: this.state.auditeePost, sign: pngUrl, date: Date.now() }
            let audobj = this.props.navprops.audObj;
            audobj.iscomplete = true;
            audobj.dateComplete = Date.now();
            audobj.isFollowUp = this.state.needFollowUp;


            saveAuditRecord(audobj, this.audrecord).then((success) => console.log("final save")).catch((e) => console.log(e));
            generatePDF(audobj, this.audrecord).then((data) => {

                this.setState({ isLoad: false, });

                this.props.navigator.replacePage({
                    component: auditViewReport, props: {
                        title: "Report",
                        pdffile: data,
                    }
                })
            }).catch((e) => console.log(e));

        }
        else {
            this.signImg = { sign: pngUrl, date: Date.now() };
            this.setState({ final: false, sign: x + 1, isLoad: true, });
            setTimeout(() => {
                this.setState({ final: true, isLoad: false, });
            }, 1000);
        }
    }


    addNotes() {
        var thi$ = this;
        this.props.navigator.pushPage({
            component: CommentBox, props: {
                title: "Audit Summary", savedtext: thi$.state.comment, saveComment: (x) => {
                    thi$.setState({ comment: x });
                }
            }
        })
    }

}
const colors = [
    ["#33ff33", "#33ff33"], // blue
    ["#ffff4d", "#ffff4d"], // yellow green
    ["#ffb84d", "#ffb84d"], // yellow
    ["#ac7339", "#ac7339"], // orange
    ["#ff1a1a", "#ff1a1a"], // red
    ["#e2bcbd", "#9e2126"] // purple
]
const nc = ["Lulus", "Kecil", "Besar", "Serius Teknikal", "Serius Syariah"]