
/* lib/terminal/websites/server - A simple HTTP server to keep the application open listening for browser output. */

import { Readable } from "stream";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { StringDecoder } from "string_decoder";

import log from "../utilities/log.js";
import vars from "../utilities/vars.js";

const server:Server = createServer(function terminal_websites_server(request:IncomingMessage, serverResponse:ServerResponse):void {
    let body:string = "",
        ended:boolean = false;
    const decoder:StringDecoder = new StringDecoder("utf8"),
        contentLength:number = Number(request.headers["content-length"]),

        // a handler for chunk encoded data
        requestData = function terminal_websites_server_requestData(data:Buffer):void {
            body = body + decoder.write(data);
            if (body.length > contentLength) {
                request.destroy({
                    name: "TOO_LARGE",
                    message: "Request destroyed for size in excess of its content-length header."
                });
            }
        },

        // handler for a completed response to a request
        requestEnd = function terminal_websites_server_requestEnd():void {
            const message:string = `Response from terminal. Request body size: ${body.length}`,
                readStream:Readable = Readable.from(message);
            ended = true;

            serverResponse.setHeader("cache-control", "no-store");
            serverResponse.setHeader("alt-svc", "clear");
            serverResponse.setHeader("connection", "keep-alive");
            serverResponse.setHeader("content-length", Buffer.byteLength(message));
            serverResponse.setHeader("referrer-policy", "no-referrer");
            // cspell:disable
            serverResponse.setHeader("x-content-type-options", "nosniff");
            // cspell:enable
            serverResponse.writeHead(200, {"content-type": "text/plain"});
            readStream.pipe(serverResponse);
        },

        // error handler for a request
        requestError = function terminal_websites_server_requestError(errorMessage:NodeJS.ErrnoException):void {
            const errorString:string = errorMessage.toString();
            if (errorMessage.code !== "ETIMEDOUT" && (ended === false || (ended === true && errorString !== "Error: aborted"))) {
                log([
                    `${vars.text.cyan}POST request, ${request.headers["request-type"]}, methodPOST.ts${vars.text.none}`,
                    body.slice(0, 1024),
                    "",
                    `body length: ${body.length}`,
                    vars.text.angry + errorString + vars.text.none,
                    "",
                    ""
                ]);
            }
        };
    request.on("data", requestData);
    request.on("end", requestEnd);
    request.on("error", requestError);
});

export default server;