import { timeoutPromise } from '../function';
import { API_URL } from '../config';

class lang {

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
                            this.downloadLang().then(x=>{
                                resolve(data);
                            })
                        })
                    .catch(error => {
                        reject(error);

                    });
            }

        });
    }
    downloadLang = async () => {
        return new Promise((resolve, reject) => {
            timeoutPromise(10000, new Error('Timed Out!'),
                fetch(`${API_URL}/lang2`)).then(res => res.json()).then(
                    data => {
                        let newLang = {};
                        Object.entries(data).forEach(
                            ([key, value]) => {
                                Object.entries(value).forEach(
                                    ([lang, value]) => {
                                        if (newLang.hasOwnProperty(lang)) {
                                            newLang[lang][key]=value;
                                        }
                                        else {
                                            newLang[lang] = { [key]: value }
                                        }
                                        newLang[lang][key]=value;
                                    }
                                );
                            }
                        );

                        Object.entries(newLang).forEach(
                            ([key, value]) => {
                                localStorage.setItem(`lang_${key}`, JSON.stringify(value));
                            }
                        );
                        resolve(newLang);
                    })
                .catch(error => {
                    reject(error);

                });
        });
    }

    setLang = (lang) => {
        this.activeLang = lang;
        localStorage.setItem("appLang", lang);
        this.getLangLibrary(lang).then(x=>{
            
        }).catch(e=>console.log(e))
    }

    getLang = async () => {
        return new Promise((resolve, reject) => {
            let version="2.0.2"
            if (localStorage.hasOwnProperty("version")) {
                let value = localStorage.getItem("version");
               if (value!==version){
                this.downloadLang().then(x=>{
                    localStorage.setItem("version", version);
                })
               }
            }else{
                this.downloadLang().then(x=>{
                    localStorage.setItem("version", version);
                })
            }
            
            if (localStorage.hasOwnProperty("appLang")) {
                let value = localStorage.getItem("appLang");
                try {
                    this.activeLang = value;
                    this.getLangLibrary(value).then(x=>{
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
    getLangLibrary = async(lang)=>{
        return new Promise((resolve, reject) => {
            if (localStorage.hasOwnProperty(`lang_${lang}`)) {
                let value = localStorage.getItem(`lang_${lang}`);
                try {
                    this.t=JSON.parse(value);

                    resolve(JSON.parse(value))
                } catch (e) {
                    reject(e);
                }
            }
            else {
               this.downloadLang().then(x=>{
                   this.getLang();
               }).catch(e=>reject(e))
            }
        });

    }

}

export default new lang
