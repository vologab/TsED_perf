import {ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware} from "ts-express-decorators";
import Path = require("path");

@ServerSettings({
    endpointUrl: "/",
    mount: {
        "/": "${rootDir}/TsED_controller.js"
    }
})

export class Server extends ServerLoader {

    public $onReady(){
        console.log('Server started...');
    }

    public $onServerInitError(err){
        console.error(err);
    }
}

new Server().start();
