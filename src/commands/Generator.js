import { fillStub, isUrl } from "../helpers/helpers.js";
import { introspectQuery } from "../graphql/query/introspect.js";
import * as fs from "fs";
import { pascalCase } from "change-case";
import axios from "axios";
const scalarMap = (scalarType) => ({
    'Int': 'number',
    'Boolean': 'boolean',
    'String': 'string',
    'ID': 'number',
    'DateTime': 'string',
    'Date': 'string',
    'Time': 'string',
})[scalarType] || scalarType;
export default class Generator {
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
        console.log('Generating types...');
        outContentSections.push(...[
            '// REGION: Types',
            ...this.generateObjectTypes(objectTypes),
            ...this.generateEnumTypes(enumTypes),
            ``,
        ]);
        console.log('Adding base classes...');
        outContentSections.push(...[
            '// REGION: Base classes',
            fillStub('Settings', { "DEFAULTPOSTURL": isUrl(schemaUri) ? schemaUri : '' }),
            fillStub('GraphtonBaseQuery'),
            ``,
        ]);
        console.log('Generating query classes...');
        outContentSections.push(...[
            '// REGION: Queries',
            ...this.generateQueries(this.gqlSchema.types.find(t => t.name === this.gqlSchema?.queryType?.name)?.fields || [], options.exportQueryFactoryAs),
            ``,
        ]);
        console.log('Generating mutation classes...');
        outContentSections.push(...[
            '// REGION: Mutations',
            ...this.generateMutations(this.gqlSchema.types.find(t => t.name === this.gqlSchema?.mutationType?.name)?.fields || [], options.exportMutationFactoryAs),
            ``,
        ]);
        console.log(`Writing it all to ${options.outputFile}...`);
        fs.writeFileSync(options.outputFile, outContentSections.join("\n"), { encoding: "utf8" });
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
    *generateEnumTypes(enumTypes) {
        for (const enumType of enumTypes) {
            yield `export type ${enumType.name} = ${enumType.enumValues.map(t => JSON.stringify(t.name)).join('|')};`;
        }
    }
    *generateFields(fields) {
        for (const field of fields) {
            yield `  ${field.name}${Generator.toTypeAppend(field.type)},`;
        }
    }
    *generateQueries(queries, exportQueryAs = 'query') {
        yield `class GraphtonQueryBuilderFactory {`;
        for (const query of queries) {
            const { typed, untyped } = this.argsToMethodParameters(query.args);
            yield `  public static ${query.name}(${typed.join(', ')}) {`;
            yield `    return new ${pascalCase(query.name)}Query(${untyped.join(', ')});`;
            yield `  }`;
        }
        yield `}`;
        yield `export const ${exportQueryAs} = new GraphtonQueryBuilderFactory();`;
        yield ``;
        for (const query of queries) {
            yield this.generateQueryClass(query);
            yield ``;
        }
    }
    *generateMutations(queries, exportMutationAs = 'mutation') {
        yield `class GraphtonMutationBuilderFactory {`;
        for (const query of queries) {
            const { typed, untyped } = this.argsToMethodParameters(query.args);
            yield `  public static ${query.name}(${typed.join(', ')}) {`;
            yield `    return new ${pascalCase(query.name)}Mutation(${untyped.join(', ')});`;
            yield `  }`;
        }
        yield `}`;
        yield `export const ${exportMutationAs} = new GraphtonMutationBuilderFactory();`;
        yield ``;
        for (const query of queries) {
            yield this.generateMutationClass(query);
            yield ``;
        }
    }
    argsToMethodParameters(args) {
        const typed = [];
        const untyped = [];
        for (const arg of args) {
            typed.push(`${arg.name}${Generator.toTypeAppend(arg.type, false)}${arg.defaultValue ? ` = ${JSON.stringify(arg.defaultValue)}` : ''}`);
            untyped.push(arg.name);
        }
        return { typed, untyped };
    }
    generateQueryClass(query) {
        const returnType = Generator.findReturnType(query.type);
        const fieldNames = this.gqlSchema?.types.find(t => t.name == returnType)?.fields.map(f => f.name) || [];
        const params = this.argsToMethodParameters(query.args);
        return fillStub('Query', {
            "QUERYCLASSNAME": `${pascalCase(query.name)}Query`,
            "FIELDS": JSON.stringify(fieldNames),
            "FIELDSTUPLE": fieldNames.map(f => JSON.stringify(f)).join('|') || 'string',
            "QUERYNAME": query.name,
            "TYPEDPARAMS": params.typed.join(', '),
            "PARAMS": params.untyped.join(', '),
            "ROOTTYPE": 'query',
            "RETURNTYPE": Generator.toTypeAppend(query.type, false),
        }, ["USEGET"]);
    }
    generateMutationClass(query) {
        const returnType = Generator.findReturnType(query.type);
        const fieldNames = this.gqlSchema?.types.find(t => t.name == returnType)?.fields.map(f => f.name) || [];
        const params = this.argsToMethodParameters(query.args);
        return fillStub('Query', {
            "QUERYCLASSNAME": `${pascalCase(query.name)}Mutation`,
            "FIELDS": JSON.stringify(fieldNames),
            "FIELDSTUPLE": fieldNames.map(f => JSON.stringify(f)).join('|') || 'string',
            "QUERYNAME": query.name,
            "TYPEDPARAMS": params.typed.join(', '),
            "PARAMS": params.untyped.join(', '),
            "ROOTTYPE": 'mutation',
            "RETURNTYPE": Generator.toTypeAppend(query.type, false),
        }, ["USEDO"]);
    }
    static findReturnType(type) {
        if (type?.kind === 'OBJECT') {
            return type.name;
        }
        if (type?.ofType?.kind === 'OBJECT') {
            return type.ofType.name;
        }
        if (type?.ofType?.ofType?.kind === 'OBJECT') {
            return type.ofType.ofType.name;
        }
        if (type?.ofType?.ofType?.ofType?.kind === 'OBJECT') {
            return type.ofType.ofType.ofType.name;
        }
        return null;
    }
    static toTypeAppend(type, includeOptional = true) {
        let currentType = type || null;
        if (!currentType) {
            return ``;
        }
        const directTypes = ['OBJECT', 'SCALAR', 'ENUM'];
        const nonNullTypes = ['NON_NULL'];
        const listTypes = ['LIST'];
        const optional = includeOptional ? '?' : '';
        if (directTypes.indexOf(currentType.kind) > -1) {
            return `?: ${scalarMap(currentType.name)} | null`;
        }
        if (nonNullTypes.indexOf(currentType.kind) > -1 && currentType.ofType) {
            currentType = currentType.ofType;
            if (directTypes.indexOf(currentType.kind) > -1) {
                return `${optional}: ${scalarMap(currentType.name)}`;
            }
            if (listTypes.indexOf(currentType.kind) > -1 && currentType.ofType) {
                currentType = currentType.ofType;
                if (directTypes.indexOf(currentType.kind) > -1) {
                    return `?: (${scalarMap(currentType.name)}|null)[]`;
                }
                if (nonNullTypes.indexOf(currentType.kind) > -1 && currentType.ofType) {
                    currentType = currentType.ofType;
                    return `${optional}: ${scalarMap(currentType.name)}[]`;
                }
            }
        }
        return ``;
    }
}
