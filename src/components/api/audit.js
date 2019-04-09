import { timeoutPromise } from '../function';
import { API_URL } from '../config';
import{writeToFile,readFile} from './cordova'
import auth from './auth'
import { getData, setData } from './storage';

class audit {

    audList=null;
    constructor() {
    }

    saveAuditRecord = (audobj, data) => {
        return new Promise((resolve, reject) => {
          try {
            writeToFile("record", "" + audobj.filename, data, () => {
              this.addAudlist(audobj);
              resolve(true)
            });
          } catch (e) {
            console.log(e);
            reject(e);
          }
        });
      }
      getAudList=async()=>{
        return new Promise((resolve, reject) => {
        getData("audList", auth.authStatus.icno).then((data) => {
          this.audList = data;
          resolve(data);
        }).catch((e) => {reject(e)});
    })
      }
       addAudlist = async (audobj) => {

        let audList=[];
        if(this.audList){
          audList = this.audList;
          audobj.seq = audList.filter(function (cklist) {
            return cklist.audtitle === audobj.audtitle;
          }).length;
          if (this.replaceaudsession(audList, audobj)) { 
            setData("audList", audList, audobj.user.ic);} else {
            audList.push(audobj)
            // storage.setItem("audList",JSON.stringify(audList));
            setData("audList", audList, audobj.user.ic);
          }
        }else{
            audobj.seq = 0;
            if (this.replaceaudsession(audList, audobj)) { } else {
              audList.push(audobj)
              setData("audList", audList, audobj.user.ic);
            }
        }
        let thi$=this;
        setTimeout(() => {
            thi$.getAudList().then(x=>console.log(x));
        }, 1000)
       
      }
       replaceaudsession = (data, obj) => {
        var rt = false
        for (var x in data) {
          if (data[x].filename == obj.filename) data[x] = obj, rt = true;
        }
        return rt;
      }
      
      
      loadAuditRecord = (filename) => {
        return new Promise((resolve, reject) => {
          try {
            readFile("record", "" + filename, (data) => {
              resolve(JSON.parse(data))
            });
          } catch (e) {
            console.log(e);
            reject(e);
          }
        });
      }
    

}

export default new audit
