import { readFileSync }from "fs";
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';


export function isUrl(urlString: string) {
    let url;

    try {
        url = new URL(urlString);
    } catch (_) {
        return false;
    }

    return ["http:", "https:"].indexOf(url.protocol) > -1;
}


export function fillStub(stub: string, substitutions: Record<string, string> = {}): string {
    let stubContent = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', 'stubs', `${stub}.stub.ts`), {encoding: "utf8"});
    for(const [searchValue, replaceValue] of Object.entries(substitutions)) {
        stubContent = stubContent.replaceAll(`/*${searchValue}*/`, replaceValue)
            .replaceAll(`'/**${searchValue}**/'`, replaceValue)
            .replaceAll(`__${searchValue}__`, replaceValue);
    }

    return stubContent;
}
