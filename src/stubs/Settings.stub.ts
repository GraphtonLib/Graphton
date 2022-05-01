const settings = {
  defaultHeaders: {},
  defaultUrl: "/*DEFAULTPOSTURL*/",
};

export class GraphtonSettings {
  public static setDefaultHeaders(headers: Record<string, string>): void {
    settings.defaultHeaders = headers;
  }

  public static setDefaultUrl(defaultUrl: string): void {
    settings.defaultUrl = defaultUrl;
  }
}
