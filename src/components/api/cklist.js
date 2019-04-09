import { timeoutPromise } from '../function';
import { API_URL } from '../config';

class cklist {

    activeLang = "";
    t = {};
    constructor() {
    }

    getLangList = async () => {
        return new Promise((resolve, reject) => {

            if (localStorage.hasOwnProperty("langList")) {
                let value = localStorage.getItem("langList");
                try {
                    resolve(JSON.parse(value))
                } catch (e) {
                    reject(e);
                }
            }
            else {
                timeoutPromise(10000, new Error('Timed Out!'),
                    fetch(`${API_URL}/langlist`)).then(res => res.json()).then(
                        data => {
                            localStorage.setItem("langList", JSON.stringify(data));
                            this.downloadCklist().then(x=>{
                                resolve(data);
                            })
                        })
                    .catch(error => {
                        reject(error);

                    });
            }

        });
    }
    downloadCklist = async (id) => {
        return new Promise((resolve, reject) => {
            timeoutPromise(10000, new Error('Timed Out!'),
                fetch(`${API_URL}/getcklist?&checklistID=${id}&lang=ms&uuid=qad${device.uuid}`)).then(res => res.json()).then(  // eslint-disable-line
                    data => {
                        resolve(data);
                        if(typeof data.ispass ==="undefined"){
                        localStorage.setItem(`cklist_${id}`, JSON.stringify(data));}
                    })
                .catch(error => {
                    reject(error);

                });
        });
    }

    setLang = (lang) => {
        this.activeLang = lang;
        localStorage.setItem("appLang", lang);
    }

    getLang = async () => {
        return new Promise((resolve, reject) => {
            if (localStorage.hasOwnProperty("appLang")) {
                let value = localStorage.getItem("appLang");
                try {
                    this.activeLang = value;
                    this.getLangLibrary(value).then(x=>{
                        console.log(x);
                        resolve(x)
                    }).catch(e=>reject(e))
                } catch (e) {
                    reject(e);
                }
            }
            else {
                reject("language not set")
            }
        });
    }
    getCklist = async(id)=>{
        return new Promise((resolve, reject) => {
            if (localStorage.hasOwnProperty(`cklist_${id}`)) {
                let value = localStorage.getItem(`cklist_${id}`);
                try {
                    this.t=JSON.parse(value);

                    resolve(JSON.parse(value))
                } catch (e) {
                    reject(e);
                }
            }
            else {
               this.downloadCklist(id).then(x=>{
                 //  this.getCklist(id);
                 resolve(x);
               }).catch(e=>reject(e))
            }
        });

    }

    syncChecklist = async(id)=>{
        
        return new Promise((resolve, reject) => {
            if (!(localStorage.hasOwnProperty(`cklist_${id}`))) {
              
               this.downloadCklist(id).then(x=>{
                 resolve(x);
               }).catch(e=>reject(e))
            }
            else{resolve("cklist exists")}
        });

    }

}

export default new cklist
