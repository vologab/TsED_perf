import * as Express from "express";
import {Controller, Get} from "ts-express-decorators";

@Controller("/")
export class HelloCtrl {
    @Get("/")
    async get(request: Express.Request, response: Express.Response): Promise<any> {
        return "Hello world";
    }
}
