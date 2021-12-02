#!/usr/bin/env node
import { Command } from 'commander';
import Generator from "./commands/Generator.js";
const program = new Command();
async function main() {
    program
        .command('generate')
        .argument('<schemaUri>', 'URL to GraphQL endpoint or path to introspection json.')
        .option('-o, --outputFile <path>', 'Path to the generated js/ts file', './src/graphton.js')
        .option('-q, --exportQueryFactoryAs <name>', 'How you want to import your queries instance.', 'query')
        .option('-m, --exportMutationFactoryAs <name>', 'How you want to import your mutations instance.', 'mutation')
        .action((...params) => (new Generator()).generate(...params));
    await program.parseAsync(process.argv);
}
main();
