import { GenerateCommandOptions } from "../types/Generator";
export default class Generator {
    private gqlSchema;
    generate(schemaUri: string, options: GenerateCommandOptions): Promise<void>;
    private generateTypes;
    private generateFields;
    private generateQueries;
    private argsToMethodParameters;
    private generateQueryClass;
    private static findReturnType;
    private static toTypeAppend;
}
