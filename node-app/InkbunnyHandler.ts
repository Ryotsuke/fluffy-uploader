import {Handler} from "./Handler";

let electron = require('electron');
let BrowserWindow = electron.BrowserWindow;

const PROTOCOL = "https://";
const BASE_DOMAIN = "inkbunny.net";
const BASE_URL = PROTOCOL + BASE_DOMAIN;
const LOGIN_URL = PROTOCOL + BASE_DOMAIN + "/login.php";
const UPLOAD_URL = PROTOCOL + BASE_DOMAIN + "/filesedit.php?sales=no&wizardmode=yes";

export class InkbunnyHandler extends Handler {
    protected constructWindow():void {
        this.browserWindow = new BrowserWindow({width: 800, height: 600});
        this.browserWindow.loadURL(BASE_URL);
        this.webContents = this.browserWindow.webContents;
        this.webDebugger = this.webContents.debugger;
    }

    public login():Promise<string> {
        function evaluate(webview:Electron.WebContents, timeout:number, func:Function, ...args:any[]):Promise<any> {
            var fn = "(" + func.toString() + ").apply(this, " + JSON.stringify(args) + ")";
            return new Promise<any>((resolve:Function, reject:Function) => {
                let timer = setTimeout(()=> {
                    reject("Timeout waiting for evaluation result");
                }, (timeout || 20) * 1000);
                webview.executeJavaScript(fn, false, function (result) {
                    clearTimeout(timer);
                    resolve(result);
                });
            });
        }

        this.browserWindow.loadURL(LOGIN_URL);
        let webview = this.browserWindow;
        let wc = this.browserWindow.webContents;
        let webDebugger = wc.debugger;
        let account = this.credentials;
        return new Promise<string>((resolve:Function, reject:Function) => {
            webview.reload();
            //wc.openDevTools();
            wc.on('did-finish-load', function () {
                try {
                    webDebugger.attach("1.1");
                    evaluate(wc, 10, function (login, password) {
                        if (document.querySelector("input#username_sel")) {
                            (document.querySelector("input#username_sel") as HTMLInputElement).value = login;
                        } else {
                            return "No login input";
                        }
                        if (document.querySelector("input[name='password']")) {
                            (document.querySelector("input[name='password']") as HTMLInputElement).value = login;
                        } else {
                            return "No password input";
                        }
                        return null;
                    }, account.login, account.password).then(function (error) {
                        if (error) {
                            reject(error as string);
                        } else {
                            console.log("Form filled OK");
                            resolve(null);
                        }
                    }, function(error) {
                        reject(error as string);
                    });
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}