
import {  PieChartImg2 } from './PieChart';
import stockLogo from '../assets/img/quikauditfull.png';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {colors} from './config';

import $ from './api/lang'
export const timeoutPromise = (timeout, err, promise) => {
    return new Promise(function (resolve, reject) {
        promise.then(resolve, reject);
        setTimeout(reject.bind(null, err), timeout);
    });
}

  
  export const generatePDF = async (audaObj, audRecord,isfull) => {
    return new Promise(async (resolve, reject) => {
      try {
  
        let docDefinition = {
  pageSize: 'A4',
  pageOrientation: 'portrait',
  pageMargins: [ 40, 60, 40, 60 ],
          footer: function (currentPage, pageCount) {
            if (currentPage > 1) {
              return [
                {
                  text: $.t.confidential, margin: [0, 0, 40, 1],
                  alignment: 'right',
                  bold: true,
                  italics: true
                },
                {
                  text: $.t.pagetxt+' ' + currentPage, margin: [0, 0, 40, 40],
                  alignment: 'right'
                }
              ];
            }
          },
          header: (currentPage, pageCount, pageSize) => {
            // you can apply any logic and return any valid pdfmake element
            if (currentPage > 1) {
              return [
                {
                  text: (isfull?'':$.t.summary+' ')+ audaObj.audtitle, margin: [0, 10, 40, 0],
                  alignment: 'right',
                  italics: true
                },
              ]
            }
          },
          content: [{
            image: 'logo',
            width: 300,
            alignment: 'center',
            margin: [0, 20]
          }, {
            text: (isfull?'':$.t.summary+' ')+audaObj.audtitle,
            fontSize: 28,
            bold: true,
            alignment: 'center',
            margin: [0, 30]
          }, {
            text: $.t.conductedfor,
            fontSize: 14,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 30]
          }, {
            text: audaObj.premis,
            fontSize: 28,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 40]
          }]
        }
  
  
        docDefinition.content.push({
          text: $.t.auditlocation,
          bold: true
        });
        docDefinition.content.push({
          text: audaObj.premisAddrs,
          margin: [0, 0, 0, 10]
        });
  
        docDefinition.content.push({
          text: $.t.conductedat,
          bold: true
        });
        docDefinition.content.push({
          text: getRealdate(audaObj.filename),
          margin: [0, 0, 0, 10]
        });
  
        docDefinition.content.push({
          text: "Auditor :",
          bold: true
        });
        docDefinition.content.push({
          text: audaObj.user.name,
          margin: [0, 0, 0, 10]
        });
  
        docDefinition.content.push({
          text: $.t.completedon,
          bold: true
        });
        docDefinition.content.push({
          text: getRealdate(audaObj.dateComplete),
          margin: [0, 0, 0, 10]
        });
        docDefinition.images = {};
        let attachmentlist = []
  
        await renderReport(docDefinition, attachmentlist, audRecord,isfull);
  
        let left = {
          table: {
            widths: [170],
            body: [{
              text: " "
            }]
          },
          layout: 'noBorders'
        };
        let mid = {
          table: {
            widths: [170],
            body: [{
              text: " "
            }]
          },
          layout: 'noBorders'
        };
        let right = {
          table: {
            widths: [170],
            body: [{
              text: " "
            }]
          },
          layout: 'noBorders'
        };
      
        if (typeof audRecord.auditor.sign !== "undefined") {
          left = {
            table: {
              widths: [170],
              body: [
                [{
                  text: $.t.auditedby,
                  bold: true
                }],
                [{
                  image: audRecord.auditor.sign,
                  width: 100,
                  margin: [0, 20, 0, 0]
                }],
                [{
                  text: audaObj.user.name,
                  bold: true
                }],
                [{
                  text: "Auditor"
                }],
                [{
                  text: getRealdate(audRecord.auditor.date)
                }]
              ]
            },
            layout: 'noBorders'
          }
        };
      
        if (typeof audRecord.auditee !== "undefined") {
          right = {
            table: {
              widths: [170],
              body: [
                [{
                  text: $.t.auditee,
                  bold: true
                }],
                [{
                  image: audRecord.auditee.sign,
                  width: 100,
                  margin: [0, 20, 0, 0]
                }],
                [{
                  text: audRecord.auditee.name,
                  bold: true
                }],
                [{
                  text: audRecord.auditee.post
                }],
                [{
                  text: getRealdate(audRecord.auditee.date)
                }]
              ]
            },
            layout: 'noBorders'
          }
        };
      
        let auditorsign = {
      
          table: {
            dontBreakRows: true,
            margin: [0, 20, 0, 0],
            widths: [175, 175, 175],
            body: [
              [left, mid, right]
            ]
          },
          layout: 'noBorders'
        }
        docDefinition.content.push(auditorsign);
      
        let Apndx = {
          pageBreak: 'before',
          margin: [0, 0, 0, 20],
          table: {
            
            dontBreakRows: true,
            widths: ['*'],
            body: [
              [{
                alignment: 'center',
                text:  $.t.appendix,
                fillColor: '#000000',
                color: '#ffffff',
                bold: true,
                fontSize: 18
              }],
      
            ]
          }
        }
        if (attachmentlist.length > 0) {
      
          docDefinition.content.push(Apndx);
          docDefinition.content.push(attachmentlist);
  
        }
        docDefinition.images.logo = await toDataUrl(stockLogo, 'image/jpg', 300);
        pdfMake.createPdf(docDefinition).getDataUrl(function (dataurl) {
          console.log("pdfcreated");
          //console.log(dataurl);
          //openpdf2(dataurl);
          resolve(dataurl);
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }
  
  const getRealdate = (militime) => {
    let today = new Date(parseInt(militime));
    return today.toLocaleString();
  
  }
  
  const toDataUrl = async (src, outputFormat, size) => {
    return new Promise(async (resolve, reject) => {
      var img = new Image();
      img.onload = () => {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        var calwidth;
        var calheight;
  
        if (img.width < img.height) {
          var fixsize = (2/3)*size;
          calwidth = fixsize;
          calheight = (fixsize / img.width) * img.height;
        } else {
          calwidth = size;
          calheight = (size / img.width) * img.height;
        }
  
        canvas.height = calheight;
        canvas.width = size;
        ctx.drawImage(img, canvas.width / 2 - calwidth / 2, 0, calwidth, calheight)
        dataURL = canvas.toDataURL(outputFormat);
  
        resolve(dataURL);
      };
      img.src = src;
    })
  }
  
  const renderReport = async (docDefinition, attachmentlist, data,isfull) => {
  
    let sectcnt = 0;
    let analyser = [];
    let total=0;
    let pass=0;
    if(isfull){
    for (let section of data.cklist) {
      if (!section.section) {
        console.log('section is undefined');
        continue;
      }
      await addSectionReport(docDefinition, attachmentlist, section, sectcnt, data, analyser);
      sectcnt += 1;
    }
  
     total=(typeof analyser[1] !== "undefined" ? analyser[1].data.length : 0);
     pass=total;

     analyser=analyser.filter(n => n);
     for (let x of analyser) {
      {pass+=x.pass;
      total+=x.total;}
     }
  }
    else{
      for (let section of data.cklist) {
        if (!section.section) {
          console.log('section is undefined');
          continue;
        }
        for (let checklistItem of section.items) {
            let itemid = checklistItem.id;
          
            if (data.result[itemid] != "disable") {
                total++;
      
              if (typeof analyser[checklistItem.severity] == "undefined") {
                analyser[checklistItem.severity] = { total:1, failed: 0,label:checklistItem.severityLabel,value:checklistItem.severity,data:[] }
              }
              else { analyser[checklistItem.severity].total++ }
          
              if (data.result[itemid]) {
                pass++;
              }
              else{
                analyser[checklistItem.severity].failed++
                analyser[checklistItem.severity].data.push(checklistItem);
              }
            }
      }
    }
    analyser=analyser.filter(n => n);
    }

    let totalpass = (pass / total) * 360;
    let passpc = ((pass / total) * 100).toFixed(2);
    let chartdata={value:[totalpass],label:[passpc + "%"],legend:[$.t.passtxt],colors:[colors[0]]};


    
    let smry = {
      pageBreak: 'before',
      margin: [0, 0, 0, 20],
      table: {
        
        dontBreakRows: true,
        widths: ['*'],
        body: [
          [{
            alignment: 'center',
            text: $.t.summary,
            fillColor: '#000000',
            color: '#ffffff',
            bold: true,
            fontSize: 18
          }],
  
        ]
      }
    }
  
    let tblsmry = {
      table: {
        
        dontBreakRows: true,
        widths: ['*', 'auto', 'auto'],
        body: [
          [{
            text:  $.t.status,
            fillColor: '#000000',
            color: '#ffffff'
          }, {
            text: $.t.total,
            fillColor: '#000000',
            color: '#ffffff'
          }, {
            text: $.t.percent + '(%)',
            fillColor: '#000000',
            color: '#ffffff'
          }],
          [{
            text: $.t.comply,
            fillColor: '#33ff33',
            color: '#000000'
          }, {
            text: pass + '',
            fillColor: '#33ff33',
            color: '#000000'
          }, {
            text: passpc,
            fillColor: '#33ff33',
            color: '#000000'
          }]
        ]
      }
    }

    for (let x of analyser) {
      let ncr=x.failed;
      x.percent = ((ncr / total) * 100).toFixed(2);
     chartdata.value.push((ncr/total)* 360);
     chartdata.label.push( x.percent+'%');
     chartdata.legend.push(x.label);
     chartdata.colors.push(colors[x.value-1]);

     tblsmry.table.body.push(
      [{
        text: x.label,
        fillColor: colors[x.value-1][0],
        color: '#000000'
      }, {
        text: ncr + '',
        fillColor:  colors[x.value-1][0],
        color: '#000000'
      }, {
        text: x.percent,
        fillColor: colors[x.value-1][0],
        color: '#000000'
      }]
    )
    }

  

    tblsmry.table.body.push([{
      text: $.t.totalchecklist,
      fillColor: '#aaaaaa',
      color: '#000000'
    }, {
      text: total + '',
      fillColor: '#aaaaaa',
      color: '#000000'
    }, {
      text: '100',
      fillColor: '#aaaaaa',
      color: '#000000'
    }])
   
    docDefinition.content.push(smry);
  
    docDefinition.content.push(tblsmry);
  

    let chart = await PieChartImg2(
      chartdata, "right",
    );

    docDefinition.images.graph = chart;
  
    docDefinition.content.push({
      text: $.t.chart,
      bold: true,
      fontSize: 16,
      alignment: 'center',
      margin: [0, 10, 0, 0]
    });
    docDefinition.content.push({
      image: 'graph',
      width: 490,
      alignment: 'center',
      margin: [0, 0, 0, 0]
    });
  
    if (data.notes.length > 0) {
      docDefinition.content.push({
        text: $.t.conclusiontxt,
        bold: true,
        fontSize: 16,
        margin: [0, 0, 0, 0]
      });
  
      docDefinition.content.push({
        margin: [0, 10, 0, 0],
        table: {
          widths: ['*'],
          body: [
            [{
              text: data.notes,
              bold: false,
              fontSize: 18
            }],
  
          ],
        },
        layout: 'noBorders'
      });
    
    }
  
    if(!isfull){
      for (let i = analyser.length - 1; i >=0 ; i--) {
        let x=analyser[i]
        if(x.data.length>0){
        await addSectionReport(docDefinition, attachmentlist, {items:x.data,section:x.label,color:colors[x.value-1][0]}, sectcnt, data, []);
        sectcnt += 1;}
    }
    
    }
  }
  
  const addSectionReport = async (docDefinition, attachmentlist, section, sectcnt, record, analyser) => {
    let fgrcnt = 0;
    let sectionItems = section.items;
    let sectionName = section.section;
    let comment = record.comment, figure = record.figure, results = record.result;
    let sectionHeader = {
      pageBreak: 'before',
      margin: [0, 0, 0, 20],
      table: {
        
        dontBreakRows: true,
        widths: ['*'],
        body: [
          [{
            alignment: 'center',
            text: String.fromCharCode(65 + sectcnt) + '. ' + sectionName,
            fillColor: (section.color?section.color:'#000000'),
            color: (section.color?'#000000':'#ffffff'),
            bold: true,
            fontSize: 18
          }],
  
        ]
      }
    }
    let item = {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto'],
        body: [
          [{
            text:  $.t.numbershrt+'.',
            bold: true
          }, {
            text:  $.t.checklisttxt,
            bold: true
          }, {
            text:  $.t.appendix,
            bold: true
          }, {
            text:  $.t.status,
            bold: true
          }, {
            text:  $.t.referencetxt,
            bold: true
          }]
        ]
      }
    }
  
    let ckno = 0;
  
    for (let checklistItem of sectionItems) {
      let itemid = checklistItem.id;
    
      if (results[itemid] != "disable") {

        if (typeof analyser[checklistItem.severity] == "undefined") {
          analyser[checklistItem.severity] = {total:1,pass:0, failed: 0,label:checklistItem.severityLabel,value:checklistItem.severity,data:[] }
        }
        else { analyser[checklistItem.severity].total++ }
    
        if (results[itemid]) {
          analyser[checklistItem.severity].pass++;
        }
        else{
          analyser[checklistItem.severity].failed++;
        }
  
        ckno += 1;
        let resultcol = [];
        let result = "";
        let apdxsmall = []
        let text = "";
        text = checklistItem.text_ms;
  
        if (typeof comment[itemid] !== "undefined") {
          text += '\n\n' +$.t.notes +" " + ': \n' + comment[itemid];
        }
        if (results[itemid] == true) {
          result = $.t.passtxt;
        } else {
            result =checklistItem.severityLabel;
          
        }
        resultcol.push({
          text: result || $.t.undefined
        });
  
        if (typeof figure[itemid] !== "undefined") {
  
          for (var z = 0; z < figure[itemid].length; z++) {
            let fgrbig = await toDataUrl(figure[itemid][z].src, 'image/jpg', 300);
            let fgrsmall = await toDataUrl(figure[itemid][z].src, 'image/jpg', 100);
            fgrcnt++;
            var img =  $.t.figuretxt+" " + (sectcnt + 1) + "." + fgrcnt;
            var templist = {
              image: fgrbig, // a long dataURI string,
              alignment: 'center',
              width: 300,
              margin: [0, 30, 0, 30]
            }
  
            var templist2 = {
              image: fgrsmall, // a long dataURI string,
              alignment: 'center',
              width: 100,
              margin: [0, 10, 0, 10]
            }
            attachmentlist.push(templist);
            attachmentlist.push({
              text: img,
              bold: true,
              alignment: 'center'
            });
  
            apdxsmall.push({
              text: Number(z + 1) + ") " + img
            });
            apdxsmall.push(templist2);
  
          }
        }
        var infolist = {
          ul: []
        };
        if (typeof checklistItem.info !== "undefined") {
          for (var z = 0; z < checklistItem.info.length; z++) {
            var infodtl = checklistItem.info[z];
            infolist.ul.push(infodtl.doc + " "+$.t.page + infodtl.pgNo + " " + infodtl.LnNo);
          }
        }
  
        item.table.body.push([
          ckno + '',
          text,
          apdxsmall,
          resultcol,
          infolist,
        ]);
      }
    }
  
    docDefinition.content.push(sectionHeader);
    docDefinition.content.push(item);
    //      docDefinition.content.push(sectionComments);
  }
