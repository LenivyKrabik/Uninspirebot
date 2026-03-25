/*
Requirements:
1.	Logging Decorator Implementation
	✓	Accept a log level (INFO, DEBUG, ERROR).
	✓	Log function arguments and return values.
	•	Support both sync and async functions.
2.	Features:
	✓	Allow logging to console, file, or external services.
	✓	Provide a timestamp for each log entry.
	✓	Support conditional logging (e.g., only log errors).
	✓	Include execution time profiling (optional).
3.	Operations:
	✓	@log(level="INFO") → Logs function input/output at the INFO level.
	✓	@log(level="ERROR") → Logs only when an exception occurs.
4.	Extensibility:
	✓	Allow custom log formatters.
	•	Support structured logging (e.g., JSON output).
*/
/*
My notes:
- Fix situation when file to write to doesn't exist
*/
import fs from "fs";

type FunctionUseReport = {
  name: string;
  agrs?: any[];
  result?: any;
  callTime?: Date;
  doneTime?: Date;
};

type LogLevel = "INFO" | "ERROR";
type LogVaraint = "CONSOLE" | "FILE" | "CUSTOM";
type LogDestination = string | ((text: string) => void) | undefined; //Add custom path

const standartLogFormater = (report: FunctionUseReport) => {
  return JSON.stringify(report);
};

const log = (
  report: FunctionUseReport,
  logLevel: LogLevel,
  logFormater: (report: FunctionUseReport) => string,
  logVariant: LogVaraint,
  logDestination: LogDestination,
) => {
  const formatedReport = logFormater(report);
  const resultIsError = Object.getPrototypeOf(report.result).constructor === Error;
  if (logLevel === "INFO" || (logLevel === "ERROR" && resultIsError)) {
    switch (logVariant) {
      case "CONSOLE":
        console.log(formatedReport);
        break;
      case "FILE":
        if (typeof logDestination !== "string") throw new Error("Log path is not a path");
        fs.appendFileSync(logDestination, formatedReport);
        break;
      case "CUSTOM":
        if (typeof logDestination !== "function") throw new Error("Callback is not a function");
        logDestination(formatedReport);
    }
  }
};

const logger = (
  logLevel: LogLevel,
  logFormater: (report: FunctionUseReport) => string = standartLogFormater,
  logVariant: LogVaraint = "CONSOLE",
  logDestination?: LogDestination,
) => {
  return (fn: Function) => {
    const functionUseReportBase: FunctionUseReport = { name: fn.name };
    return (...args: any[]) => {
      const functionUseReport = structuredClone(functionUseReportBase);
      functionUseReport.agrs = args;
      functionUseReport.callTime = new Date();
      let result;
      try {
        result = fn(...args);
      } catch (error) {
        result = error;
      }

      functionUseReport.result = result;
      functionUseReport.doneTime = new Date();

      log(functionUseReport, logLevel, logFormater, logVariant, logDestination);

      if (Object.getPrototypeOf(result).constructor === Error) throw result;
      return result;
    };
  };
};

export default logger;
