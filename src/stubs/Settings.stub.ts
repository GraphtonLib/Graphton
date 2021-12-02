const settings = {
    defaultHeaders: {},
    defaultUrl: '/*DEFAULTPOSTURL*/'
}

export const grapthtonSettings = {
    setDefaultHeaders(headers: Record<string, string>) {
        settings.defaultHeaders = headers;
    },
    setDefaultUrl(defaultUrl: string) {
        settings.defaultUrl = defaultUrl;
    }
}
