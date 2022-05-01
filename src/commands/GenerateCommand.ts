import { fillStub, isUrl } from "../helpers/helpers.js";
import { introspectQuery } from "../graphql/query/introspect.js";
import * as fs from "fs";
import { pascalCase } from "change-case";
import { Arg, Field, ReturnType, RootType, Schema, Type } from "../types/GraphQL";
import { GenerateCommandOptions, ReturnTypeInfo } from "../types/Generator";
import axios from "axios";

import { default as ts } from "typescript";

type OutContentSection = string[];

const baseScalars: Record<string, string> = {
  Int: "number",
  Float: "number",
  String: "string",
  Boolean: "boolean",
  ID: "string",
};
const scalarMap = (scalarType: string) => baseScalars[scalarType] || scalarType;

export default class GenerateCommand {
  private gqlSchema: Schema | null = null;

  async generate(schemaUri: string, options: GenerateCommandOptions) {
    const outContentSections: OutContentSection = [];

    let scalarOverrides = (options.defineScalar || []).reduce((carry, item) => {
      const parts = item.split("=");
      carry[parts[0]] = parts[1];
      return carry;
    }, {} as Record<string, string>);

    try {
      if (isUrl(schemaUri)) {
        this.gqlSchema = (await axios.post(schemaUri, { query: introspectQuery }))?.data?.data?.__schema;
      } else if (fs.existsSync(schemaUri)) {
        this.gqlSchema = JSON.parse(fs.readFileSync(schemaUri, { encoding: "utf8" })).__schema;
      }
    } catch (_) {
      this.gqlSchema = null;
    }

    if (!this.gqlSchema) {
      console.error(`Could not decode json schema from ${schemaUri}`);
      process.exit(1);
    }

    const ignoreTypes = [
      this.gqlSchema.queryType?.name,
      this.gqlSchema.mutationType?.name,
      this.gqlSchema.subscriptionType?.name,
    ];

    const types = this.gqlSchema.types.filter(
      (type) => !type.name.startsWith("__") && ignoreTypes.indexOf(type.name) < 0
    );
    const objectTypes = types.filter((type) => type.kind === "OBJECT");
    const enumTypes = types.filter((type) => type.kind === "ENUM");
    const inputTypes = types.filter((type) => type.kind === "INPUT_OBJECT");
    const scalarTypes = types.filter(
      (type) => type.kind === "SCALAR" && Object.keys(baseScalars).indexOf(type.name) < 0
    );

    outContentSections.push(
      ...[
        "/**",
        " * FILE GENERATED BY GRAPHTON",
        " * DO NOT EDIT - CHANGES WILL BE OVERWRITTEN",
        " * @see https://github.com/GraphtonLib/Graphton",
        " **/",
        "",
      ]
    );

    console.log("Adding base classes...");
    outContentSections.push(
      ...[
        "// REGION: Base classes",
        fillStub("Settings", { DEFAULTPOSTURL: isUrl(schemaUri) ? schemaUri : "" }),
        fillStub("GraphtonTypes"),
        fillStub("GraphtonBaseQuery"),
        fillStub("GraphtonBaseReturnTypeBuilder"),
        fillStub("GraphtonBaseEnum"),
        fillStub(
          "GraphtonQueryTypeInterfaces",
          {
            QUERYFUNCTION: options.queryFunction,
            MUTATEFUNCTION: options.mutateFunction,
            SUBSCRIBEFUNCTION: options.subscribeFunction,
          },
          options.exportSubscriptionFactoryAs !== false ? ["SUBSCRIPTIONS"] : []
        ),
      ]
    );

    console.log("Generating types & return type builders...");
    outContentSections.push(
      ...[
        "// REGION: Types",
        ...this.generateScalarTypeAliases(scalarTypes, scalarOverrides),
        ...this.generateObjectTypes([...objectTypes, ...inputTypes]),
        ...this.generateEnumTypes(enumTypes),
        ...this.generateReturnTypeBuilders(objectTypes),
      ]
    );

    console.log("Generating query classes...");
    outContentSections.push(
      ...[
        "// REGION: Queries",
        ...this.generateQueryFactory(
          "query",
          this.gqlSchema.types.find((t) => t.name === this.gqlSchema?.queryType?.name)?.fields || [],
          options.exportQueryFactoryAs,
          options.queryFunction
        ),
      ]
    );

    console.log("Generating mutation classes...");
    outContentSections.push(
      ...[
        "// REGION: Mutations",
        ...this.generateQueryFactory(
          "mutation",
          this.gqlSchema.types.find((t) => t.name === this.gqlSchema?.mutationType?.name)?.fields || [],
          options.exportMutationFactoryAs,
          options.mutateFunction
        ),
        "",
      ]
    );

    if (options.exportSubscriptionFactoryAs !== false) {
      const subscriptionFactoryName =
        options.exportSubscriptionFactoryAs !== true ? options.exportSubscriptionFactoryAs : "Subscription";
      console.log("Generating subscription classes...");
      outContentSections.push(
        ...[
          "// REGION: Subscriptions",
          ...this.generateQueryFactory(
            "subscription",
            this.gqlSchema.types.find((t) => t.name === this.gqlSchema?.subscriptionType?.name)?.fields || [],
            subscriptionFactoryName,
            options.subscribeFunction
          ),
          "",
        ]
      );
    }

    console.log("Trimming output...");
    let outContent = outContentSections
      .join("\n")
      .replaceAll(/\n.*?eslint-disable-next-line.*?\n/g, "\n")
      .replaceAll(/^\s*[\r\n]/gm, "\n")
      .replaceAll(/^\n+/g, "")
      .replaceAll(/\n+$/g, "")
      .replaceAll(/\n{3,}/g, "\n\n");

    if (options.outputFile.endsWith(".js")) {
      console.log("Transpiling output from TS to JS...");

      outContent = ts.transpileModule(outContent, {
        compilerOptions: {
          target: ts.ScriptTarget.ESNext,
          module: ts.ModuleKind.ESNext,
          moduleResolution: ts.ModuleResolutionKind.Node12,
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          strict: true,
          skipLibCheck: true,
          declaration: true,
        },
      }).outputText;
    }

    console.log(`Writing it all to ${options.outputFile}...`);
    fs.writeFileSync(options.outputFile, outContent, { encoding: "utf8" });
    console.log("");
    console.log(`Generated ${options.outputFile}`);
    console.log("Now create something awesome!");
    console.log("");
  }

  private *generateScalarTypeAliases(types: Type[], overrides: Record<string, string>): IterableIterator<string> {
    for (const type of types) {
      yield `export type ${type.name} = ${overrides[type.name] || "string"};`;
    }
  }

  private *generateObjectTypes(types: Type[]): IterableIterator<string> {
    for (const type of types) {
      yield `export type ${type.name} = {`;

      const isInputType = type.kind == "INPUT_OBJECT";
      for (const field of (isInputType ? type.inputFields : type.fields) || []) {
        yield `  ${field.name}${this.toTypeAppend(field.type, true, !isInputType)},`;
      }

      yield "};";
    }
  }

  private *generateReturnTypeBuilders(types: Type[]): IterableIterator<string> {
    for (const type of types) {
      const returnTypes = (type.fields || [])
        .map((f) => ({ name: f.name, info: this.returnTypeInfo(f.type) }))
        .filter((f): f is { name: string; info: ReturnTypeInfo } => !!f.info);

      let simpleFields = returnTypes.filter((t) => t.info.kind == "scalar").map((t) => t.name);

      yield fillStub("ReturnTypeBuilder", {
        SIMPLEFIELDLITERALS:
          returnTypes
            .filter((t) => t.info.kind == "scalar")
            .map((t) => JSON.stringify(t.name))
            .join("|") || "never",
        SIMPLEFIELDARRAY: simpleFields.length > 0 ? JSON.stringify(simpleFields) : "",
        OBJECTFIELDOBJECT: JSON.stringify(
          returnTypes
            .filter((t) => t.info.kind == "object")
            .reduce((obj: Record<string, string>, t) => {
              obj[t.name] = `${t.info.type}ReturnTypeBuilder`;
              return obj;
            }, {})
        ).replaceAll(/"([^"]*?ReturnTypeBuilder)"/g, "$1"),
        TYPENAME: type.name,
      });
    }
  }

  private *generateEnumTypes(enumTypes: Type[]): IterableIterator<string> {
    for (const enumType of enumTypes) {
      yield fillStub("Enum", {
        ENUMCLASSNAME: enumType.name,
        POSSIBLEVALUES: (enumType.enumValues || []).map((t) => `${t.name}:${enumType.name}.${t.name}`).join(","),
        ENUMVALUES: (enumType.enumValues || [])
          .map((t) => `static readonly ${t.name}: ${enumType.name} = new ${enumType.name}(${JSON.stringify(t.name)});`)
          .join("\n    "),
        STRINGVALUES: (enumType.enumValues || []).map((t) => `${JSON.stringify(t.name)}`).join("|"),
        LIST: (enumType.enumValues || []).map((t) => `${enumType.name}.${t.name}`).join(","),
      });
    }
  }

  private *generateQueryFactory(
    rootType: RootType,
    queries: Field[],
    exportFactoryAs: string,
    executionFunctionName: string | null = null
  ): IterableIterator<string> {
    yield `export class ${exportFactoryAs} {`;

    for (const query of queries) {
      if (query.args.length < 1) {
        yield `  public static ${query.name}() {`;
        yield `    return new ${pascalCase(query.name)}${pascalCase(rootType)}();`;
        yield "  }";
      } else {
        yield `  public static ${query.name}(queryArgs?: ${pascalCase(query.name)}${pascalCase(rootType)}Arguments) {`;
        yield `    return new ${pascalCase(query.name)}${pascalCase(rootType)}(queryArgs);`;
        yield "  }";
      }
    }

    yield "}";
    yield "";

    for (const query of queries) {
      const returnTypeInfo = this.returnTypeInfo(query.type);
      const params = this.argsToMethodParameters(query.args);
      const queryClassName = `${pascalCase(query.name)}${pascalCase(rootType)}`;

      const includeInStub: string[] = [];
      if (returnTypeInfo?.kind == "object") {
        includeInStub.push("RETURNTYPEOBJECT");
      }
      if (executionFunctionName) {
        includeInStub.push("ADDEXECUTOR");
      }
      let argumentsInterfaceName = "Record<string, never>";
      if (params.typed.length > 0) {
        includeInStub.push("ARGUMENTS");
        argumentsInterfaceName = `${queryClassName}Arguments`;
      }

      yield fillStub(
        "Query",
        {
          QUERYCLASSNAME: queryClassName,
          QUERYNAME: query.name,
          ARGUMENTINTERFACEPROPERTIES: params.typed.join(";\n    "),
          ARGUMENTINTERFACENAME: argumentsInterfaceName,
          ROOTTYPE: rootType,
          RETURNTYPE: this.toTypeAppend(query.type, false),
          EXECUTIONFUNCTIONNAME: executionFunctionName || "execute",
          IMPLEMENTS: {
            mutation: `GraphtonMutation<${queryClassName}Response>`,
            query: `GraphtonQuery<${queryClassName}Response>`,
            subscription: `GraphtonSubscription<${queryClassName}Response>`,
          }[rootType],
          RETURNTYPEBUILDER:
            returnTypeInfo?.kind == "object" ? `${this.returnTypeInfo(query.type)?.type}ReturnTypeBuilder` : "null",
        },
        includeInStub
      );
      yield "";
    }
  }

  private argsToMethodParameters(args: Arg[]) {
    const typed: string[] = [];
    const untyped: string[] = [];

    for (const arg of args) {
      typed.push(
        `${arg.name}${this.toTypeAppend(arg.type, false, false)}${
          arg.defaultValue ? ` = ${JSON.stringify(arg.defaultValue)}` : ""
        }`
      );
      untyped.push(arg.name);
    }
    return { typed, untyped };
  }

  private toTypeAppend(type: ReturnType, isRootType = true, enumsAreStrings = true): string {
    const typeInfo = this.returnTypeInfo(type);

    if (!typeInfo) {
      return "?: unknown";
    }

    let typeAppend = "";

    if (!typeInfo.notNull) {
      typeAppend += `?: (${scalarMap(typeInfo.type)} | null)`;
    } else {
      typeAppend += `${isRootType ? "?" : ""}: ${
        enumsAreStrings && typeInfo.kind === "enum"
          ? `keyof typeof ${typeInfo.type}.possibleValues`
          : scalarMap(typeInfo.type)
      }`;
    }

    if (typeInfo.isListOf) {
      typeAppend += "[]";
      if (!typeInfo.listNotNull) {
        typeAppend += " | null";
      }
    }

    return typeAppend;
  }

  private returnTypeInfo(type: ReturnType, returnTypeInfo?: ReturnTypeInfo): ReturnTypeInfo | null {
    returnTypeInfo = returnTypeInfo || {
      isListOf: false,
      kind: "scalar",
      notNull: false,
      type: "",
    };

    switch (type?.kind || "") {
      case "OBJECT":
      case "INPUT_OBJECT":
        returnTypeInfo.type = type.name;
        returnTypeInfo.kind = "object";
        return returnTypeInfo;
      case "SCALAR":
        returnTypeInfo.type = type.name;
        returnTypeInfo.kind = "scalar";
        return returnTypeInfo;
      case "ENUM":
        returnTypeInfo.type = type.name;
        returnTypeInfo.kind = "enum";
        return returnTypeInfo;
      case "NON_NULL":
        if (returnTypeInfo.isListOf) {
          returnTypeInfo.listNotNull = true;
        } else {
          returnTypeInfo.notNull = true;
        }
        return type.ofType ? this.returnTypeInfo(type.ofType, returnTypeInfo) : null;
      case "LIST":
        returnTypeInfo.isListOf = true;
        return type.ofType ? this.returnTypeInfo(type.ofType, returnTypeInfo) : null;

      default:
        return null;
    }
  }
}
