import { GenerateCommandOptions } from "../types/Generator";
export default class GenerateCommand {
  private gqlSchema;
  generate(schemaUri: string, options: GenerateCommandOptions): Promise<void>;
  private generateScalarTypeAliases;
  private generateObjectTypes;
  private generateReturnTypeBuilders;
  private generateEnumTypes;
  private generateQueryFactory;
  private argsToMethodParameters;
  private toTypeAppend;
  private returnTypeInfo;
}
