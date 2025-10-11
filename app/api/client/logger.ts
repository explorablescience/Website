'use client'

import { ErrorInfo } from "react";
import { postError } from "./post_manager";

/**
 * Logger class.
 */
class Logger {
    readonly log = (message: unknown) => {
        console.log(message);
    };
    readonly warn = (message: unknown) => {
        console.warn(message);
    };
    readonly error = (error: Error, info?: ErrorInfo) => {
        console.error(error);
        postError(error, info);
    };
}

const logger = new Logger();
export default logger;

/* React error boundary handler */
export function onReactError(error: Error, info?: ErrorInfo) {
    logger.error(error, info);
}
