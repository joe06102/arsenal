import chalk from "chalk";
import { ILogger } from "../Abstract/Logger";

export class TerminalLogger implements ILogger {
  Info(...args: string[]): void {
    console.log(chalk.blue(`[${new Date().toLocaleString()} Info]:`), ...args);
  }
  Success(...args: string[]): void {
    console.log(
      chalk.green(`[${new Date().toLocaleString()} Success]:`),
      ...args
    );
  }
  Error(...args: string[]): void {
    console.log(chalk.red(`[${new Date().toLocaleString()} Error]:`), ...args);
  }
  Warning(...args: string[]): void {
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()} Warning]:`),
      ...args
    );
  }
}
