import {Credentials} from "./Credentials";

export class Handler {
    protected browserWindow:Electron.BrowserWindow;
    protected webContents:Electron.WebContents;
    protected webDebugger:Electron.Debugger;

    constructor(public credentials:Credentials) {
        this.constructWindow();
    }

    protected constructWindow():void {
        throw new Error("Abstract method not implemented");
    }

    showWindow() {

    }

    hideWindow() {

    }

    isLoggedIn():boolean {
        return false;
    }
    
    login():Promise<string> {
        return Promise.reject<string>("Not implemented");
    }
}