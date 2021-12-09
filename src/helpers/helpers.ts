import { readFileSync }from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export function isUrl(urlString: string) {
    let url;

    try {
        url = new URL(urlString);
    } catch (_) {
        return false;
    }

    return ['http:', 'https:'].indexOf(url.protocol) > -1;
}


export function fillStub(stub: string, substitutions: Record<string, string> = {}, conditions: string[] = []): string {
    let stubContent = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', 'stubs', `${stub}.stub.ts`), {encoding: 'utf8'});
    for(const [searchValue, replaceValue] of Object.entries(substitutions)) {
        stubContent = stubContent.replaceAll(`/*${searchValue}*/`, replaceValue)
            .replaceAll(RegExp(`.\\/\\*\\*${searchValue}\\*\\*\\/.`, 'g'), replaceValue)
            .replaceAll(`__${searchValue}__`, replaceValue);
    }

    for(const condition of conditions) {
        stubContent = stubContent.replaceAll(`/*IF:${condition}*/`, '')
            .replaceAll(`/*ENDIF:${condition}*/`, '');
    }

    stubContent = stubContent.replaceAll(/\/\*IF:[A-Z]+?\*\/[^]*?\/\*ENDIF:[A-Z]+?\*\//g, '')
        .replaceAll(/\/\*IGNORE\*\/[^]*?\/\*ENDIGNORE\*\//g, '');

    stubContent = stubContent.replaceAll(/\/\*.*?\*\//g, '')
        .replaceAll(/'\/\*\*.*?\*\*\/'/g, '')
        .replaceAll(/__.*?__/g, '');

    return stubContent;
}

type HttpMethod = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
export function httpRequest<T>(method: HttpMethod, url: string, data: Record<string, unknown>, headers: Record<string, string> = {}): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, url, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/json');
        for(const [name, value] of Object.entries(headers)) {
            xhr.setRequestHeader(name, value);
        }
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(<T>xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };

        xhr.send(JSON.stringify(data));
    });
}
