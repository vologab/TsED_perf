import {
    Controller, Get, Render, Post, 
    Authenticated, Required, BodyParams,
    Delete
} from "ts-express-decorators";
import * as Express from "express";

@Controller("/")
export class HelloCtrl {
    @Get("/")
    async get(request: Express.Request, response: Express.Response): Promise<any> {
        return 'Hello world';
    }
}
