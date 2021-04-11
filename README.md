一个用于创建命令行的框架。优点是轻量、灵活。

# 为什么叫 Arsenal

Arsenal 源于 switch 上首发的机甲游戏 [《恶魔机甲》](https://www.nintendo.com/games/detail/daemon-x-machina-switch/)中的基础机甲，在其基础之上可以增强为多种类型的机甲。

# 概念

Arsenal 核心基于 AOP 实现了灵活的插件机制。每一个指令都是一条独立的管道（Pipeline），每条管道都有一个独立的上下文（Context）用于挂载需要共享的数据， 每条管道上可以任意插入多个切入点（CutPoint）。

```shell
                                                       ---| CutPoint 1 |          --- | CutPoint 2 |
                                                      /                          /
                                                     /                          /
                                  ---| CommandA | --------| Command Context |----------------------- | OUTPUT |
                                 /
                                /
| Input |---| Arsenal Core |-------------------------------------------------------------------------------------
                                          \                          \
                                           \                          \
                                            ---| CommandB |            --- | CommandC |

```

# 管道（Pipeline）

Arsenal 中的管道分为 3 种类型，分别是：**基础管道（BasicPipeline）**，**可中断管道（BailPipeline）**，**并行管道（ParallelPipeline）**。

管道主要提供 3 个能力：

1. **注册切入点**
1. **按照规则去执行 & 调度切入点**
1. **提供独立的上下文**

定义一个基础管道（injectable 主要负责依赖注入，下面模块会详细说明）：

```typescript
import { BasicPipeline, injectable } from "arsenal";
import { LoginCutPoint } from "../CutPoint/LoginCutPoint";

@injectable()
export class InitPipeline extends BasicPipeline {
  constructor(private loginCP: LoginCutPoint) {
    super();
    this.Register(loginCP);
    this.Context.Set("bigjoe", "bj");
  }
}
```

## 基础管道（BasicPipeline)

基础管道只支持注册**基础切入点**，并且会按照注册顺序执行切入点，支持同步、异步的切入点处理函数。

## 可中断管道（BailPipeline)

可中断管道只支持注册**可中断切入点**，并且会按照注册顺序执行切入点，支持同步、异步的切入点处理函数。不同于基础管道，如果切入点的上一个处理函数返回了 Error 实例，则立即中断处理流程，不会再执行后续切入点。

## 并行管道（ParallelPipeline)

并行管道只支持注册**并行切入点**，并且会并行的执行切入点，支持同步、异步的切入点处理函数（对于同步处理函数，并行的效果等同于基础管道）。

# 切入点（CutPoint）

切入点对应了 3 种类型的管道，分别是：**基础切入点（BasicCutPoint）**，**可中断切入点（BailCutPoint）**，**并行切入点（ParallelCutPoint）**。

切入点主要功能就是依据当前管道传入的上下文，做出相对应的处理，并且在需要时将处理结果挂载到上下文。

定义一个基础切入点：

```typescript
import {
  IPipelineContext,
  BasicCutPoint,
  inject,
  injectable,
  ILogger,
  Token,
} from "arsenal";

@injectable()
export class LoginCutPoint extends BasicCutPoint {
  // 定义切入点的名称
  Name = LoginCutPoint.name;

  constructor(@inject(Token.LoggerToken.ILogger) private logger: ILogger) {
    super();
  }

  // 定义切入点的处理函数
  async Intercept(ctx: IPipelineContext): Promise<void> {
    this.logger.Info(`[${LoginCutPoint.name}] ctx: ${ctx.Get("options.name")}`);
  }
}
```

## 基础切入点（BasicCutPoint)

按照注册顺序被执行。`Intercept` 支持同步、异步。

## 可中断切入点（BailCutPoint)

按照注册顺序被执行。`Intercept` 支持同步、异步。不同于基础切入点，可中断切入点支持返回 Error 实例，用于立即中断管道中后续切入点的执行。

## 并行切入点（ParallelCutPoint)

并行地被执行。`Intercept` 支持同步、异步（推荐只在使用异步，同步效果同基础切入点）。

# 命令（Command）

命令是命令行中常见的参数，例如 npm 支持 `install`， `uninstall` 等命令；

Arsenal 中定义了命令的结构 `IArsenalCommand`，用户在自定义命令时只需要实现该结构即可。

命令包含了如下属性：

- Name：命令的名称，例如 `install`
- Description: 命令的描述信息，当用户不知道该命令的作用时，可以通过 `myArsenal command --help` 在终端查看描述信息
- Options: 命令支持哪些参数，例如 `npm install --dev=true`, --dev 就是参数，具体格式见下文
- Pipeline：命令对应的**管道实例**，可以通过构造函数注入、手动调用 `container.resolve` 来构造，**不要通过 `new` 来构造**。

例如，创建一个初始化的命令：

```typescript
import { IArsenalCommand, IArsenalCommandOption, injectable } from "arsenal";
import { InitPipeline } from "../Pipeline/InitPipeline";

@injectable()
export class InitCommand implements IArsenalCommand {
  Name = "init";
  Description = "init your cli";
  Options: IArsenalCommandOption<string>[] = [
    {
      Name: "--name [string]",
      Required: true,
      Description: "your app name",
      Type: "static",
      Parse: (val: string) => val,
    },
  ];

  constructor(public Pipeline: InitPipeline) {}
}
```

## 命令参数 IArsenalCommandOption

整体结构类似 `IArsenalCommand`, 需要注意 `Name` 属性必须以 `--` 开头，详细可以参见 [commander.js](https://github.com/tj/commander.js)

```typescript
export interface IArsenalCommandOption<T = string> {
  Type: string;
  Name: string;
  Description: string;
  Default?: T;
  Required?: boolean;
  Parse?: (raw: string) => T;
}
```

# 应用入口

```typescript
import { Arsenal } from "Arsenal";
import { InitCommand } from "./Command/Init";

const arsenal = new Arsenal()
  // 配置资源文件的名称
  .ConfigRC((options) => (options.ConfigFile = "demorc.js"))
  // 配置版本号，建议直接从package.json中获取
  .ConfigVersion("1.0.0")
  // 配置自定义的依赖注入服务
  .ConfigService((container) => {})
  // 注册一个Command，可以连续注册
  .ConfigCommand(InitCommand)
  // 运行程序
  .Run();
```

# 控制反转

为了提高代码的可测试性、可维护性、整洁度等，Arsenal 推荐全部使用**依赖注入容器**来实例化依赖的服务，并在启动前手动在 `ConfigService` 中注册自己定义的依赖。

Arsenal 中的依赖注入基于 [tsyringe](https://github.com/microsoft/tsyringe)实现。

Arsenal 内置了部分模块的依赖注入，用于可直接引用：

- ILogger：用于日志打印，默认实现为控制台打印（单例）：

  ```typescript
  export interface ILogger {
    Info(...args: string[]): void;
    Success(...args: string[]): void;
    Error(...args: string[]): void;
    Warning(...args: string[]): void;
  }
  ```

- IConfig: 用于获取自定义的配置文件，默认实现为只支持 `commonjs` 格式的配置文件（单例，key 支持多层级，例如 a.b.c）：
  ```typescript
  export interface IConfig {
    Get<T>(key: string): T;
  }
  ```

如果需要在 `Pipeline` 或者 `CutPoint` 中使用时，可以直接借助构造函数注入的方式。

为了减少错误，Arsenal 导出了一个 `Token` 模块，包含了内置服务的注册名称：

```typescript
import { BasicCutPoint, inject, injectable, ILogger, Token } from "Arsenal";

@injectable()
export class LoginCutPoint extends BasicCutPoint {
  Name = LoginCutPoint.name;

  constructor(@inject(Token.LoggerToken.ILogger) private logger: ILogger) {
    super();
  }

  async Intercept(ctx): Promise<void> {
    this.logger.Info(`[${LoginCutPoint.name}] ctx: ${ctx.Get("options.name")}`);
  }
}
```

# 完整 Demo

查看源代码中 Example 目录

# 建议

Arsenal 目前还是初版，如果有意见，欢迎 issue 交流。
