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
    
    public login() {
        
    } 
}