import { GenerateCommandOptions } from "../types/Generator";
export default class GenerateCommand {
    private gqlSchema;
    generate(schemaUri: string, options: GenerateCommandOptions): Promise<void>;
    private generateScalarTypeAliases;
    private generateObjectTypes;
    private generateInputObjectTypes;
    private generateEnumTypes;
    private generateObjectTypeFieldSelectors;
    private generateQueryFactory;
    private argsToMethodParameters;
    private typeToTsFieldType;
    private typeToTsType;
    private returnTypeInfo;
}
