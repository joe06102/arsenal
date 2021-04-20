import "reflect-metadata";
import Path from "path";
import { container } from "tsyringe";
import { ConfigOptions, IConfig } from "../Abstract/Config";
import { ConfigToken } from "../Constant/Token";
import { CosmicConfig } from "../Config/CosmicConfig";
import { NotFoundError } from "../Abstract/Error";

beforeAll(() => {
  container.register<ConfigOptions>(ConfigToken.ConfigOptions, {
    useValue: { Module: "bigjoe", Required: true },
  });
});

describe("config test suit", () => {
  it("expect bigjoe.config.js to be resolved && singleton", () => {
    process.chdir(Path.join(__dirname, "TestTools/RC"));
    const config1 = container.resolve<IConfig>(CosmicConfig);
    const config2 = container.resolve<IConfig>(CosmicConfig);

    expect(config1).not.toBeFalsy();
    expect(config2).not.toBeFalsy();
    expect(config1).toBe(config2);
    expect(config1.Get("spouse.hobbies[1[")).toBe("piano");
    process.chdir(Path.join(__dirname, "../.."));
  });

  it("expect not found to be throwed", () => {
    const childContainer = container.createChildContainer();
    childContainer.register<ConfigOptions>(ConfigToken.ConfigOptions, {
      useValue: { Module: "notfound", Required: true },
    });
    // re-register to prevent CosmicConfig from being resolve from global singleton
    childContainer.register<IConfig>(ConfigToken.IConfig, {
      useClass: CosmicConfig,
    });
    expect(() => {
      childContainer.resolve<IConfig>(ConfigToken.IConfig);
    }).toThrowError(NotFoundError);
  });
});

afterAll(() => {
  container.clearInstances();
});
