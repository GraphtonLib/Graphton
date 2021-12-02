import {fillStub, isUrl} from "../helpers/helpers.js";
import axios from "axios";
import {introspectQuery} from "../graphql/query/introspect.js";
import * as fs from "fs";
import {pascalCase} from "change-case";
import {Arg, Field, ReturnType, Schema, Type} from "../types/GraphQL";
import {GenerateCommandOptions} from "../types/Generator";

type OutContentSection = string[];

const scalarMap = (scalarType: string) => ({
    'Int': 'number',
    'Boolean': 'boolean',
    'String': 'string',
    'ID': 'number',
    'DateTime': 'string',
    'Date': 'string',
    'Time': 'string',
})[scalarType] || scalarType;


export default class Generator {
    private gqlSchema: Schema|null = null;

    async generate(schemaUri: string, options: GenerateCommandOptions) {
        const outContentSections: OutContentSection = [];

        try {
            if(isUrl(schemaUri)) {
                this.gqlSchema = (await axios.post(schemaUri, {query: introspectQuery}))?.data?.data?.__schema;
            } else if (fs.existsSync(schemaUri)) {
                this.gqlSchema = JSON.parse(fs.readFileSync(schemaUri, {encoding: "utf8"}));
            }
        } catch (_) {
            this.gqlSchema = null;
        }

        if(!this.gqlSchema) {
            console.error(`Could not decode json schema from ${schemaUri}`);
            process.exit(1);
        }

        const ignoreTypes = [
            this.gqlSchema.queryType?.name,
            this.gqlSchema.mutationType?.name,
            this.gqlSchema.subscriptionType?.name,
        ];

        const types = this.gqlSchema.types
            .filter(type => type.kind === 'OBJECT' && !type.name.startsWith("__") && ignoreTypes.indexOf(type.name) < 0);

        outContentSections.push(...[
            '// FILE GENERATED BY GRAPHTON',
            '// DO NOT EDIT - CHANGES WILL BE OVERWRITTEN',
            ''
        ]);

        console.log('Generating types...');
        outContentSections.push(...[
            '// REGION: Types',
            ...this.generateTypes(types),
            ``,
        ]);

        console.log('Adding base classes...');
        outContentSections.push(...[
            '// REGION: Base classes',
            fillStub('Settings', {"DEFAULTPOSTURL": isUrl(schemaUri) ? schemaUri : ''}),
            fillStub('GraphtonBaseQuery'),
            ``,
        ]);

        console.log('Generating query classes...');
        outContentSections.push(...[
            '// REGION: Queries',
            ...this.generateQueries(
                this.gqlSchema.types.find(t => t.name === this.gqlSchema?.queryType?.name)?.fields || [],
                options.queryRootName
            ),
            ``,
        ]);

        fs.writeFileSync(options.outputFile, outContentSections.join("\n"), {encoding:"utf8"});
    }

    private *generateTypes(types: Type[]): IterableIterator<string> {
        for(const type of types) {
            yield `export interface ${type.name} {`;
            yield* this.generateFields(type.fields);
            yield `}`;
        }
    }

    private *generateFields(fields: Field[]): IterableIterator<string> {
        for(const field of fields) {
            yield `  ${field.name}${Generator.toTypeAppend(field.type)}`;
        }
    }

    private *generateQueries(queries: Field[], queryRootName = 'query'): IterableIterator<string> {
        yield `class GraphtonQueryBuilder {`;

        for(const query of queries) {
            const {typed, untyped} = this.argsToMethodParameters(query.args);

            yield `  public static ${query.name}(${typed.join(', ')}) {`;
            yield `    return new ${pascalCase(query.name)}Query(${untyped.join(', ')});`;
            yield `  }`;
        }

        yield `}`;
        yield `export const ${queryRootName} = new GraphtonQueryBuilder();`;
        yield ``;

        for(const query of queries) {
            yield this.generateQueryClass(query);
            yield ``;
        }
    }

    private argsToMethodParameters(args: Arg[]) {
        const typed: string[] = [];
        const untyped: string[] = [];
        for (const arg of args) {
            typed.push(`${arg.name}${Generator.toTypeAppend(arg.type)}${arg.defaultValue ? ` = ${JSON.stringify(arg.defaultValue)}` : ''}`);
            untyped.push(arg.name);
        }
        return {typed, untyped};
    }

    private generateQueryClass(query: Field): string {
        const returnType = Generator.findReturnType(query.type);

        const fieldNames = this.gqlSchema?.types.find(t=>t.name==returnType)?.fields.map(f=>f.name) || [];
        const params = this.argsToMethodParameters(query.args);

        return fillStub('Query', {
            "QUERYCLASSNAME": `${pascalCase(query.name)}Query`,
            "FIELDS": JSON.stringify(fieldNames),
            "FIELDSTUPLE": fieldNames.map(f => JSON.stringify(f)).join('|'),
            "QUERYNAME": query.name,
            "TYPEDPARAMS": params.typed.join(', '),
            "PARAMS": params.untyped.join(', '),
        });
    }

    private static findReturnType(type: ReturnType): string|null {
        if(type?.kind === 'OBJECT') {
            return type.name;
        }
        if(type?.ofType?.kind === 'OBJECT') {
            return type.ofType.name;
        }
        if(type?.ofType?.ofType?.kind === 'OBJECT') {
            return type.ofType.ofType.name;
        }
        if(type?.ofType?.ofType?.ofType?.kind === 'OBJECT') {
            return type.ofType.ofType.ofType.name;
        }

        return null;
    }

    private static toTypeAppend(type: ReturnType): string {
        let currentType = type || null;

        if(!currentType) {
            return ``;
        }

        const directTypes = ['OBJECT', 'SCALAR', 'ENUM'];
        const nonNullTypes = ['NON_NULL'];
        const listTypes = ['LIST'];


        if(directTypes.indexOf(currentType.kind) > -1) {
            return `?: ${scalarMap(currentType.name)},`;
        }

        if(nonNullTypes.indexOf(currentType.kind) > -1 && currentType.ofType) {
            currentType = currentType.ofType;
            if(directTypes.indexOf(currentType.kind) > -1) {
                return `: ${scalarMap(currentType.name)},`;
            }

            if(listTypes.indexOf(currentType.kind) > -1 && currentType.ofType) {
                currentType = currentType.ofType;
                if(directTypes.indexOf(currentType.kind) > -1) {
                    return `: ${scalarMap(currentType.name)}?[],`;
                }

                if(nonNullTypes.indexOf(currentType.kind) > -1 && currentType.ofType) {
                    currentType = currentType.ofType;
                    return `: ${scalarMap(currentType.name)}[],`;
                }
            }
        }

        return ``;
    }
}
