#!/usr/bin/env node
import { Command } from 'commander';
import GenerateCommand from "./commands/GenerateCommand.js";
import {GenerateCommandOptions} from "./types/Generator";

const program = new Command();

async function main() {
    program
        .command('generate')
        .argument('<schemaUri>', 'URL to GraphQL endpoint or path to introspection json.')
        .option('-o, --outputFile <path>', 'Path to the generated js/ts file', './src/graphton.generated.ts')
        .option('-q, --exportQueryFactoryAs <name>', 'How you want to import your queries instance.', 'Query')
        .option('-m, --exportMutationFactoryAs <name>', 'How you want to import your mutations instance.', 'Mutation')
        .action((...params: [string, GenerateCommandOptions]) => (new GenerateCommand()).generate(...params));
    await program.parseAsync(process.argv);
}

main();
