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
	•	Allow custom log formatters.
	•	Support structured logging (e.g., JSON output).
*/
type FunctionUseReport = {
  name: string;
  agrs: any[];
  result: any;
  callTime: Date;
  doneTime: Date;
};

const logger = (logLevel: "INFO" | "DEBUG" | "ERROR") => {
  return (fn: Function) => {
    return (...args: any[]) => {
      return fn(...args);
    };
  };
};

export default logger;
