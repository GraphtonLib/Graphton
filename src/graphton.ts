#!/usr/bin/env node
import { Command } from 'commander';
import Generator from "./commands/Generator.js";
import {GenerateCommandOptions} from "./types/Generator";

const program = new Command();

async function main() {
    program
        .command('generate')
        .argument('<schemaUri>', 'URL to GraphQL endpoint or path to introspection json.')
        .option('-o, --outputFile <path>', 'Path to the generated js/ts file', './src/graphton.js')
        .option('-q, --queryRootName <name>', 'How you want to import your queries instance.', 'query')
        .option('-m, --mutationRootName <name>', 'How you want to import your mutations instance.', 'mutation')
        .action((...params: [string, GenerateCommandOptions]) => (new Generator()).generate(...params));
    await program.parseAsync(process.argv);
}

main();
