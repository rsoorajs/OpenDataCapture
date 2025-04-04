import type { JSONValue } from 'k6';
import * as http from 'k6/http';
import type { RefinedResponse } from 'k6/http';

type ClientParams = {
  baseUrl: string;
};

type RequestHeaders = {
  Accept?: 'application/json' | 'text/html';
  Authorization?: `Bearer ${string}`;
  'Content-Type'?: 'application/json';
};

type DefaultHeaders = {
  common: RequestHeaders;
  get: RequestHeaders;
  post: RequestHeaders;
};

type RequestOptions = {
  headers?: RequestHeaders;
};

type GetRequestOptions = RequestOptions & {
  params?: {
    [key: string]: string;
  };
};

type ClientResponse<TData extends JSONValue> = Omit<RefinedResponse<'text'>, 'json'> & {
  json<K extends Extract<keyof TData, string> | undefined = undefined>(
    selector?: K
  ): K extends string ? TData[K] : TData;
};

export class Client {
  public defaultHeaders: DefaultHeaders = {
    common: {},
    get: {
      Accept: 'application/json'
    },
    post: {
      'Content-Type': 'application/json'
    }
  };
  private baseUrl: string;

  constructor({ baseUrl }: ClientParams) {
    this.baseUrl = baseUrl;
  }

  get<TData extends JSONValue = JSONValue>(path: string, options?: GetRequestOptions): ClientResponse<TData> {
    let url = this.baseUrl + path;
    if (options?.params) {
      url += '?'.concat(
        Object.entries(options.params)
          .map((entry) => entry.join('='))
          .join('&')
      );
    }
    return http.get<'text'>(url, {
      headers: { ...this.defaultHeaders.common, ...this.defaultHeaders.get, ...options?.headers }
    }) as ClientResponse<TData>;
  }

  post<TBody extends JSONValue, TData extends JSONValue = JSONValue>(
    path: string,
    body: TBody,
    options?: RequestOptions
  ): ClientResponse<TData> {
    return http.post<'text'>(this.baseUrl + path, JSON.stringify(body), {
      headers: { ...this.defaultHeaders.common, ...this.defaultHeaders.post, ...options?.headers }
    }) as ClientResponse<TData>;
  }
}

export type { ClientParams };
