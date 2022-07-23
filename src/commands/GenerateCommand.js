import { fillStub, isUrl } from "../helpers/helpers.js";
import { introspectQuery } from "../graphql/query/introspect.js";
import * as fs from "fs";
import { pascalCase } from "change-case";
import axios from "axios";
import { default as ts } from "typescript";
const baseScalars = {
    Int: "number",
    Float: "number",
    String: "string",
    Boolean: "boolean",
    ID: "string",
};
const scalarMap = (scalarType) => baseScalars[scalarType] || scalarType;
export default class GenerateCommand {
    gqlSchema = null;
    async generate(schemaUri, options) {
        const outContentSections = [];
        let scalarOverrides = (options.defineScalar || []).reduce((carry, item) => {
            const parts = item.split("=");
            carry[parts[0]] = parts[1];
            return carry;
        }, {});
        try {
            if (isUrl(schemaUri)) {
                this.gqlSchema = (await axios.post(schemaUri, { query: introspectQuery }))?.data?.data?.__schema;
            }
            else if (fs.existsSync(schemaUri)) {
                this.gqlSchema = JSON.parse(fs.readFileSync(schemaUri, { encoding: "utf8" })).__schema;
            }
        }
        catch (_) {
            this.gqlSchema = null;
        }
        if (!this.gqlSchema) {
            console.error(`Could not decode json schema from ${schemaUri}`);
            process.exit(1);
            return;
        }
        const rootTypes = {
            query: this.gqlSchema.queryType?.name,
            mutation: this.gqlSchema.mutationType?.name,
            subscription: this.gqlSchema.subscriptionType?.name,
        };
        const types = this.gqlSchema.types.filter((type) => !type.name.startsWith("__") && Object.values(rootTypes).indexOf(type.name) < 0);
        const objectTypes = types.filter((type) => type.kind === "OBJECT");
        const enumTypes = types.filter((type) => type.kind === "ENUM");
        const inputTypes = types.filter((type) => type.kind === "INPUT_OBJECT");
        const scalarTypes = types.filter((type) => type.kind === "SCALAR");
        outContentSections.push(...[
            "/**",
            " * FILE GENERATED BY GRAPHTON",
            " * DO NOT EDIT - CHANGES WILL BE OVERWRITTEN",
            " * @see https://github.com/GraphtonLib/Graphton",
            " **/",
            "",
        ]);
        console.log("Adding base classes...");
        outContentSections.push(...[
            "// REGION: Base classes",
            fillStub("Settings", { DefaultPostUrl: isUrl(schemaUri) ? schemaUri : "" }),
            fillStub("GraphtonBaseQuery"),
            fillStub("GraphtonBaseEnum"),
            fillStub("GraphtonQueryTypeInterfaces", {
                QueryFunction: options.queryFunction,
                MutateFunction: options.mutateFunction,
                SubscribeFunction: options.subscribeFunction,
            }, options.exportSubscriptionFactoryAs !== false ? ["Subscriptions"] : []),
        ]);
        console.log("Generating types...");
        outContentSections.push(...[
            "// REGION: Types",
            ...this.generateScalarTypeAliases(scalarTypes, scalarOverrides),
            ...this.generateObjectTypes(objectTypes),
            ...this.generateInputObjectTypes(inputTypes),
            ...this.generateEnumTypes(enumTypes),
            ...this.generateObjectTypeFieldSelectors(objectTypes),
        ]);
        if (rootTypes.query) {
            console.log("Generating query classes...");
            outContentSections.push(...[
                "// REGION: Queries",
                ...this.generateQueryFactory("query", [
                    ...(this.gqlSchema.types.find((t) => t.name === rootTypes.query)?.fields ||
                        []),
                ], options.exportQueryFactoryAs, options.queryFunction),
            ]);
        }
        if (rootTypes.mutation) {
            console.log("Generating mutation classes...");
            outContentSections.push(...[
                "// REGION: Mutations",
                ...this.generateQueryFactory("mutation", [
                    ...(this.gqlSchema.types.find((t) => t.name === rootTypes.mutation)
                        ?.fields || []),
                ], options.exportMutationFactoryAs, options.mutateFunction),
                "",
            ]);
        }
        if (options.exportSubscriptionFactoryAs !== false && rootTypes.subscription) {
            const subscriptionFactoryName = options.exportSubscriptionFactoryAs !== true ? options.exportSubscriptionFactoryAs : "Subscription";
            console.log("Generating subscription classes...");
            outContentSections.push(...[
                "// REGION: Subscriptions",
                ...this.generateQueryFactory("subscription", [
                    ...(this.gqlSchema.types.find((t) => t.name === rootTypes.subscription)
                        ?.fields || []),
                ], subscriptionFactoryName, options.subscribeFunction),
                "",
            ]);
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
                    moduleResolution: ts.ModuleResolutionKind.NodeJs,
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
    *generateScalarTypeAliases(types, overrides) {
        for (const type of types) {
            yield `export type ${type.name} = ${overrides[type.name] || "string"};`;
        }
    }
    *generateObjectTypes(types) {
        let fieldObjectMap = {};
        for (const type of types) {
            fieldObjectMap[type.name] = {};
            yield `export type ${type.name} = {`;
            for (const field of type.fields || []) {
                yield `  ${field.name}: ${this.typeToFieldType(field.type)};`;
                let typeInfo = this.returnTypeInfo(field.type);
                fieldObjectMap[type.name][field.name] =
                    ["SCALAR", "ENUM"].indexOf(typeInfo.childKind) > -1 ? null : typeInfo.name;
            }
            yield "};";
        }
        yield `const fieldObjectMap: Record<string, Record<string, string|null>> = ${JSON.stringify(fieldObjectMap)};`;
    }
    *generateInputObjectTypes(types) {
        for (const type of types) {
            yield `export type ${type.name} = {`;
            for (const field of type.inputFields || []) {
                yield `  ${field.name}: ${this.typeToFieldType(field.type)};`;
            }
            yield "};";
        }
    }
    *generateEnumTypes(enumTypes) {
        for (const enumType of enumTypes) {
            yield fillStub("Enum", {
                EnumClassName: enumType.name,
                PossibleValues: (enumType.enumValues || []).map((t) => `${t.name}:${enumType.name}.${t.name}`).join(","),
                EnumValues: (enumType.enumValues || [])
                    .map((t) => `static readonly ${t.name}: ${enumType.name} = new ${enumType.name}(${JSON.stringify(t.name)});`)
                    .join("\n    "),
            });
        }
    }
    *generateObjectTypeFieldSelectors(types) {
        for (const type of types) {
            let fields = type.fields.map((f) => {
                let typeInfo = this.returnTypeInfo(f.type);
                switch (typeInfo?.childKind || "") {
                    case "ENUM":
                    case "SCALAR":
                        return `${f.name}?: {};`;
                    default:
                        return `${f.name}?: ${typeInfo.name}FieldSelector;`;
                }
            });
            yield `export type ${type.name}FieldSelector = {`;
            yield `  _all?: {};`;
            yield `  ${fields.join("\n  ")}`;
            yield `};`;
        }
        yield ``;
    }
    *generateQueryFactory(rootType, queries, exportFactoryAs, executionFunctionName = null) {
        yield `export class ${exportFactoryAs} {`;
        for (const query of queries) {
            if (query.args.length < 1) {
                yield `  public static ${query.name}() {`;
                yield `    return new ${pascalCase(query.name)}${pascalCase(rootType)}();`;
                yield "  }";
            }
            else {
                yield `  public static ${query.name}(queryArgs: ${pascalCase(query.name)}${pascalCase(rootType)}Arguments) {`;
                yield `    return (new ${pascalCase(query.name)}${pascalCase(rootType)}()).setArgs(queryArgs);`;
                yield "  }";
            }
        }
        yield "}";
        yield "";
        for (const query of queries) {
            const returnTypeInfo = this.returnTypeInfo(query.type);
            const params = this.argsToMethodParameters(query.args);
            const queryClassName = `${pascalCase(query.name)}${pascalCase(rootType)}`;
            let extendClasses = [`GraphtonBaseQuery<${queryClassName}Response>`];
            let extendClassesWithoutGenerics = [`GraphtonBaseQuery`];
            const includeInStub = new Set();
            if (executionFunctionName) {
                includeInStub.add("AddExecutor");
            }
            let argumentType = "Record<string, never>";
            if (params.typed.length > 0) {
                includeInStub.add("HasArguments");
                includeInStub.add("Extends");
                argumentType = `${queryClassName}Arguments`;
                extendClasses.push(`GraphtonQueryHasArguments<${argumentType}>`);
                extendClassesWithoutGenerics.push(`GraphtonQueryHasArguments`);
            }
            if (returnTypeInfo.childKind == "OBJECT") {
                includeInStub.add("ReturnsObject");
                includeInStub.add("Extends");
                extendClasses.push(`GraphtonQueryReturnsObject<${this.returnTypeInfo(query.type)?.name}FieldSelector, ${returnTypeInfo.name}>`);
                extendClassesWithoutGenerics.push(`GraphtonQueryReturnsObject`);
            }
            const fillImplements = (type) => `${type}<${queryClassName}Response & { [p:string]: any; axiosResponse: AxiosResponse; }>`;
            yield fillStub("Query", {
                QueryClassName: queryClassName,
                QueryName: query.name,
                ArgumentTypeFields: params.typed.join(";\n    "),
                ArgumentType: argumentType,
                RootType: rootType,
                ReturnType: this.typeToFieldType(query.type),
                ReturnTypeName: returnTypeInfo.name,
                ExecutionFunctionName: executionFunctionName || "execute",
                Implements: {
                    mutation: fillImplements("GraphtonMutation"),
                    query: fillImplements("GraphtonQuery"),
                    subscription: fillImplements("GraphtonSubscription"),
                }[rootType],
                Extends: extendClasses.join(", "),
                ExtendsWithoutGenerics: extendClassesWithoutGenerics.join(", "),
            }, [...includeInStub]);
            yield "";
        }
    }
    argsToMethodParameters(args) {
        const typed = [];
        const untyped = [];
        for (const arg of args) {
            typed.push(`${arg.name}: ${this.typeToFieldType(arg.type)}${arg.defaultValue ? ` = ${JSON.stringify(arg.defaultValue)}` : ""}`);
            untyped.push(arg.name);
        }
        return { typed, untyped };
    }
    typeToFieldType(typeRef) {
        const typeInfo = this.returnTypeInfo(typeRef);
        if (!typeInfo) {
            return "unknown";
        }
        let notNull = !typeInfo.notNull ? "|null|undefined" : "";
        let isListOf = typeInfo.isListOf ? "[]" : "";
        let listNotNull = typeInfo.isListOf && !typeInfo.listNotNull ? "|null|undefined" : "";
        return `(${typeInfo.name}${notNull})${isListOf}${listNotNull}`;
    }
    returnTypeInfo(typeRef, returnTypeInfo) {
        returnTypeInfo = returnTypeInfo || {
            name: "",
            type: "",
            isListOf: false,
            childKind: "SCALAR",
            notNull: false,
            listNotNull: false,
        };
        switch (typeRef?.kind || "") {
            case "OBJECT":
            case "INPUT_OBJECT":
            case "SCALAR":
            case "ENUM":
            case "INTERFACE":
            case "UNION":
                returnTypeInfo.name = typeRef.name;
                returnTypeInfo.childKind = typeRef.kind;
                return returnTypeInfo;
            case "NON_NULL":
                returnTypeInfo.notNull = true;
                return this.returnTypeInfo(typeRef.ofType, returnTypeInfo);
            case "LIST":
                returnTypeInfo.isListOf = true;
                if (returnTypeInfo.notNull) {
                    returnTypeInfo.notNull = false;
                    returnTypeInfo.listNotNull = true;
                }
                return this.returnTypeInfo(typeRef.ofType, returnTypeInfo);
        }
    }
}
