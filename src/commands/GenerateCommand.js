import { fillStub, isUrl } from "../helpers/helpers.js";
import { introspectQuery } from "../graphql/query/introspect.js";
import * as fs from "fs";
import { pascalCase } from "change-case";
import axios from "axios";
import { default as ts } from "typescript";
const scalarMap = (scalarType) => ({
    'Int': 'number',
    'Boolean': 'boolean',
    'String': 'string',
    'ID': 'number',
    'DateTime': 'string',
    'Date': 'string',
    'Time': 'string',
})[scalarType] || scalarType;
export default class GenerateCommand {
    gqlSchema = null;
    async generate(schemaUri, options) {
        const outContentSections = [];
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
        }
        const ignoreTypes = [
            this.gqlSchema.queryType?.name,
            this.gqlSchema.mutationType?.name,
            this.gqlSchema.subscriptionType?.name,
        ];
        const types = this.gqlSchema.types
            .filter(type => !type.name.startsWith("__") && ignoreTypes.indexOf(type.name) < 0);
        const objectTypes = types.filter(type => type.kind === 'OBJECT');
        const enumTypes = types.filter(type => type.kind === 'ENUM');
        outContentSections.push(...[
            '// FILE GENERATED BY GRAPHTON',
            '// DO NOT EDIT - CHANGES WILL BE OVERWRITTEN',
            ''
        ]);
        console.log('Adding base classes...');
        outContentSections.push(...[
            '// REGION: Base classes',
            fillStub('Settings', { "DEFAULTPOSTURL": isUrl(schemaUri) ? schemaUri : '' }),
            fillStub('GraphtonBaseQuery'),
            fillStub('GraphtonBaseReturnTypeBuilder'),
        ]);
        console.log('Generating types & return type builders...');
        outContentSections.push(...[
            '// REGION: Types',
            ...this.generateObjectTypes(objectTypes),
            ...this.generateEnumTypes(enumTypes),
            ...this.generateReturnTypeBuilders(objectTypes),
        ]);
        console.log('Generating query classes...');
        outContentSections.push(...[
            '// REGION: Queries',
            ...this.generateQueries(this.gqlSchema.types.find(t => t.name === this.gqlSchema?.queryType?.name)?.fields || [], options.exportQueryFactoryAs),
        ]);
        console.log('Generating mutation classes...');
        outContentSections.push(...[
            '// REGION: Mutations',
            ...this.generateMutations(this.gqlSchema.types.find(t => t.name === this.gqlSchema?.mutationType?.name)?.fields || [], options.exportMutationFactoryAs),
            ``,
        ]);
        console.log(`Trimming output...`);
        let outContent = outContentSections.join("\n")
            .replaceAll(/^\s*[\r\n]/gm, "\n")
            .replaceAll(/^\n+/g, '')
            .replaceAll(/\n+$/g, '')
            .replaceAll(/\n{3,}/g, "\n\n");
        if (options.outputFile.endsWith('.js')) {
            console.log(`Transpiling output from TS to JS...`);
            outContent = ts.transpileModule(outContent, {
                "compilerOptions": {
                    "target": ts.ScriptTarget.ESNext,
                    "module": ts.ModuleKind.ESNext,
                    "moduleResolution": ts.ModuleResolutionKind.Node12,
                    "esModuleInterop": true,
                    "forceConsistentCasingInFileNames": true,
                    "strict": true,
                    "skipLibCheck": true,
                    "declaration": true
                }
            }).outputText;
        }
        console.log(`Writing it all to ${options.outputFile}...`);
        fs.writeFileSync(options.outputFile, outContent, { encoding: "utf8" });
        console.log('');
        console.log(`Generated ${options.outputFile}`);
    }
    *generateObjectTypes(types) {
        for (const type of types) {
            yield `export interface ${type.name} {`;
            yield* this.generateFields(type.fields);
            yield `}`;
        }
    }
    *generateReturnTypeBuilders(types) {
        for (const type of types) {
            const returnTypes = type.fields
                .map(f => ({ name: f.name, info: this.returnTypeInfo(f.type) }))
                .filter((f) => !!f.info);
            yield fillStub('ReturnTypeBuilder', {
                "SIMPLEFIELDLITERALS": returnTypes.filter(t => t.info.kind == "simple").map(t => JSON.stringify(t.name)).join("|") || 'never',
                "SIMPLEFIELDARRAY": JSON.stringify(returnTypes.filter(t => t.info.kind == "simple").map(t => t.name)),
                "OBJECTFIELDOBJECT": JSON.stringify(returnTypes.filter(t => t.info.kind == "object")
                    .reduce((obj, t) => {
                    obj[t.name] = `${t.info.type}ReturnTypeBuilder`;
                    return obj;
                }, {}))
                    .replaceAll(/"([^"]*?ReturnTypeBuilder)"/g, '$1'),
                "TYPENAME": type.name,
            });
        }
    }
    *generateEnumTypes(enumTypes) {
        for (const enumType of enumTypes) {
            yield `export type ${enumType.name} = ${enumType.enumValues.map(t => JSON.stringify(t.name)).join('|')};`;
        }
    }
    *generateFields(fields) {
        for (const field of fields) {
            yield `  ${field.name}${this.toTypeAppend(field.type)},`;
        }
    }
    *generateQueries(queries, exportQueryAs = 'Query') {
        yield `export class ${exportQueryAs} {`;
        for (const query of queries) {
            yield `  public static ${query.name}(queryArgs?: ${pascalCase(query.name)}QueryArguments) {`;
            yield `    return new ${pascalCase(query.name)}Query(queryArgs);`;
            yield `  }`;
        }
        yield `}`;
        yield ``;
        for (const query of queries) {
            yield this.generateQueryClass(query, 'query');
            yield ``;
        }
    }
    *generateMutations(queries, exportMutationAs = 'Mutation') {
        yield `export class ${exportMutationAs} {`;
        for (const query of queries) {
            yield `  public static ${query.name}(queryArgs: ${pascalCase(query.name)}MutationArguments) {`;
            yield `    return new ${pascalCase(query.name)}Mutation(queryArgs);`;
            yield `  }`;
        }
        yield `}`;
        yield ``;
        for (const query of queries) {
            yield this.generateQueryClass(query, "mutation");
            yield ``;
        }
    }
    argsToMethodParameters(args) {
        const typed = [];
        const untyped = [];
        for (const arg of args) {
            typed.push(`${arg.name}${this.toTypeAppend(arg.type, false)}${arg.defaultValue ? ` = ${JSON.stringify(arg.defaultValue)}` : ''}`);
            untyped.push(arg.name);
        }
        return { typed, untyped };
    }
    generateQueryClass(query, rootType) {
        const returnTypeInfo = this.returnTypeInfo(query.type);
        const params = this.argsToMethodParameters(query.args);
        const includeInStub = [];
        if (returnTypeInfo?.kind == "object") {
            includeInStub.push("RETURNTYPEOBJECT");
        }
        if (rootType == "query") {
            includeInStub.push("ADDGET");
        }
        if (rootType == "mutation") {
            includeInStub.push("ADDDO");
        }
        return fillStub('Query', {
            "QUERYCLASSNAME": `${pascalCase(query.name)}${pascalCase(rootType)}`,
            "QUERYNAME": query.name,
            "ARGUMENTINTERFACE": params.typed.join(";\n") || '[index: string]: never',
            "ROOTTYPE": rootType,
            "RETURNTYPE": this.toTypeAppend(query.type, false),
            "RETURNTYPEBUILDER": returnTypeInfo?.kind == "object"
                ? `${this.returnTypeInfo(query.type)?.type}ReturnTypeBuilder`
                : 'null',
        }, includeInStub);
    }
    toTypeAppend(type, includeOptional = true) {
        const typeInfo = this.returnTypeInfo(type);
        if (!typeInfo) {
            return '?: unknown';
        }
        let typeAppend = '';
        if (!typeInfo.notNull) {
            typeAppend += `?: (${scalarMap(typeInfo.type)} | null)`;
        }
        else {
            typeAppend += `${includeOptional ? '?' : ''}: ${scalarMap(typeInfo.type)}`;
        }
        if (typeInfo.isListOf) {
            typeAppend += '[]';
            if (!typeInfo.listNotNull) {
                typeAppend += ' | null';
            }
        }
        return typeAppend;
    }
    returnTypeInfo(type, returnTypeInfo) {
        returnTypeInfo = returnTypeInfo || {
            isListOf: false,
            kind: 'simple',
            notNull: false,
            type: ""
        };
        switch (type?.kind || '') {
            case 'OBJECT':
                returnTypeInfo.type = type.name;
                returnTypeInfo.kind = "object";
                return returnTypeInfo;
            case 'SCALAR':
            case 'ENUM':
                returnTypeInfo.type = type.name;
                returnTypeInfo.kind = "simple";
                return returnTypeInfo;
            case 'NON_NULL':
                if (returnTypeInfo.isListOf) {
                    returnTypeInfo.listNotNull = true;
                }
                else {
                    returnTypeInfo.notNull = true;
                }
                return type.ofType ? this.returnTypeInfo(type.ofType, returnTypeInfo) : null;
            case 'LIST':
                returnTypeInfo.isListOf = true;
                return type.ofType ? this.returnTypeInfo(type.ofType, returnTypeInfo) : null;
            default:
                return null;
        }
    }
}
