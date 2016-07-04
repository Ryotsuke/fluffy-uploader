import {Credentials} from "./Credentials";
import {Site} from "./Site";
import {InkbunnyHandler} from "./InkbunnyHandler";
import {Handler} from "./Handler";

export function createHandler(credentials:Credentials):Handler {
    switch (credentials.site) {
        case Site.InkBunny:
            return new InkbunnyHandler(credentials);
        default:
    }
    throw new Error("Site not implemented " + Site[credentials.site]);
}