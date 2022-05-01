#!/usr/bin/env node
import { Command } from "commander";
import GenerateCommand from "./commands/GenerateCommand.js";
const program = new Command();
async function main() {
    program
        .command("generate")
        .argument("<schemaUri>", "URL to GraphQL endpoint or path to introspection json.")
        .option("-o, --outputFile <path>", "Path to the generated js/ts file", "./src/graphton.generated.ts")
        .option("-q, --exportQueryFactoryAs <name>", "How you want to import your query factory.", "Query")
        .option("-m, --exportMutationFactoryAs <name>", "How you want to import your mutation factory.", "Mutation")
        .option("-s, --exportSubscriptionFactoryAs [name]", 'If you want a subscription factory, if no name provided "Subscription" will be used.', false)
        .option("-Q, --queryFunction <name>", "The name of the function that posts the query.", "get")
        .option("-M, --mutateFunction <name>", "The name of the function that posts the mutation.", "do")
        .option("-S, --subscribeFunction <name>", "The name of the function that posts the subscription.", "subscribe")
        .option("-d, --defineScalar <scalars...>", "Define custom scalars and their TS type. Use this if you don't want (some) scalars to be typed as string by default. (eg. --defineScalar Date=number Time=any)")
        .action((...params) => new GenerateCommand().generate(...params));
    await program.parseAsync(process.argv);
}
main();
