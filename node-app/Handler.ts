import {Site} from "./Site";
import {Credentials} from "./Credentials";


export class Handler {
    protected browserWindow:Electron.BrowserWindow;
    protected webContents:Electron.WebContents;
    protected webDebugger:Electron.Debugger;

    constructor(public credentials:Credentials) {
        this.constructWindow();
    }

    protected constructWindow() {
        throw new Error("Abstract method not implemented");
    }

    showWindow() {

    }

    hideWindow() {

    }

    isLoggedIn():boolean {
        return false;
    }
}