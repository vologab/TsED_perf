import {ServerLoader, ServerSettings} from "ts-express-decorators";

@ServerSettings({
    endpointUrl: "/",
    mount: {
        "/": "${rootDir}/TsED_controller.js"
    },
    port: 8080,
    logger: {
        logRequest: false
    }
})

export class Server extends ServerLoader {

    public $onReady() {
        console.log("Server started...");
    }

    public $onServerInitError(err) {
        console.error(err);
    }
}

new Server().start();
