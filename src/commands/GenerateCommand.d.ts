import { GenerateCommandOptions } from '../types/Generator';
export default class GenerateCommand {
    private gqlSchema;
    generate(schemaUri: string, options: GenerateCommandOptions): Promise<void>;
    private generateObjectTypes;
    private generateReturnTypeBuilders;
    private generateEnumTypes;
    private generateQueryFactory;
    private argsToMethodParameters;
    private generateQueryClass;
    private toTypeAppend;
    private returnTypeInfo;
}
