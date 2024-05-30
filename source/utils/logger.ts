import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import config from "../config";
import path from "path";
const PROJECT_ROOT = path.join(__dirname, "..");

class Logger {
  private logger: any;
  constructor() {
    this.logger = createLogger({
      transports: [
        // @ts-ignore
        new transports.DailyRotateFile({
          filename: "logs/-collection-management-system-%DATE%.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          level: "http",
          format: format.combine(
            format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
            format.align(),
            format.printf(
              (info: any) =>
                `${info.level}: ${[info.timestamp]}: ${info.message}`
            )
          ),
        }),
      ],
    });
  
    this.logger.stream = {
      write: function (message: any) {
        this.logger.info(message);
      },
    };
  }

  info = (...arg: any) =>
    this.logger.info.apply(this.logger, this.formatLogArguments(arg));

  warn = (...arg: any) =>
    this.logger.warn.apply(this.logger, this.formatLogArguments(arg));

  error = (...arg: any) =>
    this.logger.error.apply(this.logger, this.formatLogArguments(arg));

  debug = (...arg: any) =>
    this.logger.debug.apply(this.logger, this.formatLogArguments(arg));

  log = (...arg: any) => this.debug(arg);

  stream = () => this.logger.stream;

  /**
   * Attempts to add file and line number info to the given log arguments.
   */
  private formatLogArguments(args: any) {
    args = Array.prototype.slice.call(args);
    const stackInfo = this.getStackInfo(1);
    if (stackInfo) {
      // get file path relative to project root
      const calleeStr =
        "(" + stackInfo.relativePath + ":" + stackInfo.line + ")";
      if (typeof args[0] === "string") {
        args[0] = calleeStr + " " + args[0];
      } else if (typeof args[0] === "object") {
        args[0] = calleeStr + " " + JSON.stringify(args);
      } else {
        args.unshift(calleeStr);
      }
    }
    return args;
  }

  /**
   * Parses and returns info about the call stack at the given index.
   */
  private getStackInfo(stackIndex: any) {
    // get call stack, and analyze it
    // get all file, method, and line numbers
    const _err = new Error().stack || "";
    const stacklist = _err.split("\n").slice(3);

    // stack trace format:
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

    const s = stacklist[stackIndex] || stacklist[0];
    const sp = stackReg.exec(s) || stackReg2.exec(s);

    if (sp && sp.length === 5) {
      return {
        method: sp[1],
        relativePath: path.relative(PROJECT_ROOT, sp[2]),
        line: sp[3],
        pos: sp[4],
        file: path.basename(sp[2]),
        stack: stacklist.join("\n"),
      };
    }
  }
}

export default new Logger();
