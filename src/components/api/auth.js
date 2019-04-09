import { timeoutPromise } from '../function';
import { API_URL } from '../config';
import cklist from './cklist';

class auth {

    isAuthenticated = false;
    authStatus = null;
    constructor() {
    }

    isSessionExist() {
        const x = localStorage.hasOwnProperty("company");
        this.isAuthenticated = x;
        return x;
    }

    onAuth = async ({ email, password }) => {
        return new Promise((resolve, reject) => {
            timeoutPromise(10000, new Error('Timed Out!'),
                fetch(`${API_URL}/checklogin?username=${email}&password=${password}&lang=ms&uuid=qad${device.uuid}`)).then(res => res.json()).then( // eslint-disable-line
                    async data => {
                        if (typeof data.name !== "undefined") {
                            var today = new Date();

                            data.lastlogin = today;
                            data.setlang = "ms";
                            data.username = email;
                            data.pwd = password;

                            this.isAuthenticated = true;
                            this.authStatus = data;

                              for (let item of data.checklists) {
                                let t = await cklist.syncChecklist(item.checklistID);
                            }
                              
                            localStorage.setItem("company", JSON.stringify(data));
                              resolve({ isLogin: true, msg: "", data });
                        }
                        else {
                            resolve({ isLogin: false, msg: data.message });
                        }
                    })
                .catch(error => {
                    console.log(error);

                    if (error.status = 401) {
                        resolve({ isLogin: false, msg: error.response.data.message })

                    }
                    else {
                        resolve({ isLogin: false, msg: "Unable to connect server, please check your internet connection" })
                    }
                });


        });
    }

    checkAuth = async () => {

        return new Promise((resolve, reject) => {
            if (localStorage.hasOwnProperty(`company`)) {
                let value = localStorage.getItem(`company`);
                try {
                    this.authStatus = JSON.parse(value);
                    console.log(JSON.parse(value));
                    resolve(true)
                } catch (e) {
                    reject(e);
                }
            }
            else {

                resolve(false)
            }
        });

    }
    clearAuth = () => {
        localStorage.removeItem('company');
    }
}

export default new auth
