import { GenerateCommandOptions } from "../types/Generator";
export default class Generator {
    private gqlSchema;
    generate(schemaUri: string, options: GenerateCommandOptions): Promise<void>;
    private generateObjectTypes;
    private generateEnumTypes;
    private generateFields;
    private generateQueries;
    private generateMutations;
    private argsToMethodParameters;
    private generateQueryClass;
    private generateMutationClass;
    private static findReturnType;
    private static toTypeAppend;
}
