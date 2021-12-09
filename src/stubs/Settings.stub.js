const settings = {
    defaultHeaders: {},
    defaultUrl: '/*DEFAULTPOSTURL*/'
};
export class GraphtonSettings {
    static setDefaultHeaders(headers) {
        settings.defaultHeaders = headers;
    }
    static setDefaultUrl(defaultUrl) {
        settings.defaultUrl = defaultUrl;
    }
}
