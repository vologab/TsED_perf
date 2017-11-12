require('reflect-metadata');

import * as express from "express";

import { Container, injectable } from 'inversify';
import { interfaces, controller, httpGet, InversifyExpressServer, TYPE } from 'inversify-express-utils';

@controller("/")
@injectable()
class HelloController implements interfaces.Controller {
    @httpGet("/")
    private index(req: express.Request, res: express.Response, next: express.NextFunction): string {
        return "Hello world";
    }
}

// set up container
let container = new Container();

// note that you *must* bind your controllers to Controller
container.bind<interfaces.Controller>(TYPE.Controller).to(HelloController).whenTargetNamed('HelloController');

// create server
let server = new InversifyExpressServer(container);
server.setConfig((app) => {
});

let app = server.build();
app.listen(8080);
