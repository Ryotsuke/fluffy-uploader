import {Credentials} from "./Credentials";
import {Site} from "./Site";
let fs = require('fs');
const CONFIGURATION = "./config.json";

interface ConfigurationInterface {
    accounts:Credentials[];
}

export class Configuration implements ConfigurationInterface {
    accounts:Credentials[];

    constructor() {
        this.accounts = [];
        this.readConfiguration();
        this.saveConfiguration();
    }

    private readConfiguration():void {
        if (fs.exists(CONFIGURATION)) {
            let contents:string = fs.readFileSync(CONFIGURATION);
            let decoded:ConfigurationInterface = JSON.parse(contents) as ConfigurationInterface;
            this.accounts = decoded.accounts;
        }
    }


    private saveConfiguration():void {
        fs.writeFileSync(CONFIGURATION, JSON.stringify(this as ConfigurationInterface));
    }

    public upsertAccount(credentials:Credentials):void {
        let atIndex = -1;
        if (this.accounts.find(function (cred:Credentials, index) {
                atIndex = index;
                return cred.site == credentials.site
            })) {
            this.accounts[atIndex] = credentials;
        } else {
            this.accounts.push(credentials);
        }
    }

    public deleteAccount(site:Site) {
        let atIndex = -1;
        if (this.accounts.find(function (cred:Credentials, index) {
                atIndex = index;
                return cred.site == site
            })) {
            this.accounts.splice(atIndex, 1);
        }
    }

    public getAccount(site:Site) {
        return this.accounts.find(function (cred:Credentials, index) {
            return cred.site == site
        });
    }
}