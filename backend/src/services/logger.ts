/*
Requirements:
1.	Logging Decorator Implementation
	✓	Accept a log level (INFO, DEBUG, ERROR).
	?	Log function arguments and return values.
	•	Support both sync and async functions.
2.	Features:
	•	Allow logging to console, file, or external services.
	•	Provide a timestamp for each log entry.
	•	Support conditional logging (e.g., only log errors).
	?	Include execution time profiling (optional).
3.	Operations:
	•	@log(level="INFO") → Logs function input/output at the INFO level.
    •	@log(level="DEBUG") → Perhaps both variants at the same time?
	•	@log(level="ERROR") → Logs only when an exception occurs.
4.	Extensibility:
	✓	Allow custom log formatters.
	•	Support structured logging (e.g., JSON output).
*/
type FunctionUseReport = {
  name: string;
  agrs?: any[];
  result?: any;
  callTime?: Date;
  doneTime?: Date;
};

type LogLevel = "INFO" | "DEBUG" | "ERROR";

const standartLogFormater = (report: FunctionUseReport) => {
  return JSON.stringify(report);
};

const log = (report: string, logLevel: LogLevel) => {
  switch (logLevel) {
    case "INFO":
    case "DEBUG":
    case "ERROR":
  }
};

const logger = (logLevel: LogLevel, logFormater: (report: FunctionUseReport) => string = standartLogFormater) => {
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

      const formatedReport = logFormater(functionUseReport);

      log(formatedReport, logLevel);

      if (Object.getPrototypeOf(result).constructor === Error) throw result;
      return result;
    };
  };
};

export default logger;
