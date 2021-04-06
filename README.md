# 概念

```shell
                                      ___ | CommandA |
                                    /
| User Input |----| Command Bus |--------------------------
                                          \
                                            ¯¯¯¯ | CommandB |

```

# 应用入口

```typescript
import { CommandBus } from './commands/bus'

const arsenal =
  new Arsenal()
      .configRC(options => options.config = 'xxxrc.js')
      .configService(container => ｛
           container.bind('ILogger', MockLogger)
      }
      .configCommand(CommandBus)
      .run()
```

# Commands 定义

```typescript
import { ArsenalCommand } from "arsenal";

export class InitCommand extends ArsenalCommand {
  Name: "init";
  Description: "this is init command";
  Options: [];
}
```

# 拓展内置模块

```typescript
import { ArsenalComponent, PipelineContext } from "arsenal";

// Watcher.ts
@scoped(Lifecycle.Singleton)
export class WatcherComponent extends ArsenalComponent {
  constructor(logger: ILogger) {}

  Load(ctx: PipelineContext) {
    //do some initialization with context
  }

  Unload() {
    // do some cleaning
  }
}
```

# Pipeline 使用

## CutPointA

```typescript
import { Config } from "arsenal";

@injectable()
class CutPointA extends BasicCutPoint {
  constructor(private config?: Config) {}

  cut(builder) {
    builder.register("A", this);
    builder.registerBefore("A", this, "B");
    builder.registerAfter("A", this, "B");
  }

  intercept(ctx) {
    // do sth with ctx
    const options = ctx.options;
    // mount sth on ctx
    ctx.cutA = 1111;
  }
}
```

```typescript
import { A } from "./CutPoints/A";
import { B } from "./CutPoints/B";

@injectable()
class InitPipeline extends BasicPipeline {
  constructor(private a: A, private b: B) {
    this.register(a);
    this.register(b);
  }
}
```
