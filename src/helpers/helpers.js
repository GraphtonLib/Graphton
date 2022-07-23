import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
export function isUrl(urlString) {
    let url;
    try {
        url = new URL(urlString);
    }
    catch (_) {
        return false;
    }
    return ["http:", "https:"].indexOf(url.protocol) > -1;
}
export function fillStub(stub, substitutions = {}, conditions = []) {
    let stubContent = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "..", "stubs", `${stub}.stub.ts`), {
        encoding: "utf8",
    });
    for (const [searchValue, replaceValue] of Object.entries(substitutions)) {
        stubContent = stubContent
            .replaceAll(`/*${searchValue}*/`, replaceValue)
            .replaceAll(RegExp(`.\\/\\*\\*${searchValue}\\*\\*\\/.`, "g"), replaceValue)
            .replaceAll(`_t_${searchValue}_t_`, replaceValue);
    }
    for (const condition of conditions) {
        stubContent = stubContent.replaceAll(`/*IF:${condition}*/`, "").replaceAll(`/*ENDIF:${condition}*/`, "");
    }
    stubContent = stubContent
        .replaceAll(/\/\*IF:([A-Za-z]+?)\*\/[^]*?\/\*ENDIF:\1\*\//g, "")
        .replaceAll(/\/\*IGNORE\*\/[^]*?\/\*ENDIGNORE\*\//g, "")
        .replaceAll(/\/\*!(.*?)!\*\//g, "$1");
    stubContent = stubContent
        .replaceAll(/\/\*.*?\*\//g, "")
        .replaceAll(/'\/\*\*.*?\*\*\/'/g, "")
        .replaceAll(/_t_.*?_t_/g, "");
    return stubContent;
}
export function httpRequest(method, url, data, headers = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.responseType = "json";
        xhr.setRequestHeader("Content-Type", "application/json");
        for (const [name, value] of Object.entries(headers)) {
            xhr.setRequestHeader(name, value);
        }
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            }
            else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText,
            });
        };
        xhr.send(JSON.stringify(data));
    });
}
