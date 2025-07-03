/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DomainAccount {
  alias?: string;
  anchor_balance?: number;
  anchor_date?: string;
  bank?: string;
  created_at?: string;
  id?: number;
  name?: string;
  type?: string;
}

export interface DomainTransaction {
  account_id?: number;
  balance_after?: number;
  category?: string;
  email_id?: string;
  exchange_rate?: number;
  foreign_amount?: number;
  foreign_currency?: string;
  id?: number;
  merchant?: string;
  tx_amount?: number;
  tx_currency?: string;
  tx_date?: string;
  tx_desc?: string;
  tx_direction?: string;
  user_notes?: string;
}

export interface DomainTrendPoint {
  date?: string;
  expense?: number;
  income?: number;
}

export interface HandlersBalanceResponse {
  /** @example 1234.56 */
  balance?: number;
}

export interface HandlersCreateTransactionResponse {
  /** @example 101 */
  id?: number;
}

export interface HandlersCursor {
  date?: string;
  id?: number;
}

export interface HandlersDebtResponse {
  /** @example 2550.75 */
  debt?: number;
}

export interface HandlersHTTPError {
  /** @example 500 */
  code?: number;
  /** @example "internal server error" */
  message?: string;
}

export interface HandlersListTransactionsResponse {
  next_cursor?: HandlersCursor;
  transactions?: DomainTransaction[];
}

export interface HandlersSetAnchorRequest {
  /** @example 1234.56 */
  balance?: number;
}

export type HandlersUpdateTransactionRequest = Record<string, any>;

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Ariand API
 * @version 1.0
 * @baseUrl /
 * @contact
 *
 * backend for arian
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Returns a list of all accounts.
     *
     * @tags accounts
     * @name AccountsList
     * @summary List all accounts
     * @request GET:/api/accounts
     * @secure
     */
    accountsList: (params: RequestParams = {}) =>
      this.request<DomainAccount[], HandlersHTTPError>({
        path: `/api/accounts`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single account by its numeric ID.
     *
     * @tags accounts
     * @name AccountsDetail
     * @summary Get account by ID
     * @request GET:/api/accounts/{id}
     * @secure
     */
    accountsDetail: (id: number, params: RequestParams = {}) =>
      this.request<DomainAccount, HandlersHTTPError>({
        path: `/api/accounts/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Defines a true balance for an account at the current time. This anchor is the starting point for all balance calculations.
     *
     * @tags accounts
     * @name AccountsAnchorCreate
     * @summary Set account anchor to now
     * @request POST:/api/accounts/{id}/anchor
     * @secure
     */
    accountsAnchorCreate: (
      id: number,
      payload: HandlersSetAnchorRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, HandlersHTTPError>({
        path: `/api/accounts/${id}/anchor`,
        method: "POST",
        body: payload,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns the current calculated balance of an account based on its anchor and subsequent transactions.
     *
     * @tags accounts
     * @name AccountsBalanceList
     * @summary Get current balance
     * @request GET:/api/accounts/{id}/balance
     * @secure
     */
    accountsBalanceList: (id: number, params: RequestParams = {}) =>
      this.request<HandlersBalanceResponse, HandlersHTTPError>({
        path: `/api/accounts/${id}/balance`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Calculates and returns the sum of current balances across all accounts.
     *
     * @tags dashboard
     * @name DashboardBalanceList
     * @summary Get total balance
     * @request GET:/api/dashboard/balance
     * @secure
     */
    dashboardBalanceList: (params: RequestParams = {}) =>
      this.request<HandlersBalanceResponse, HandlersHTTPError>({
        path: `/api/dashboard/balance`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Calculates and returns the sum of current balances for all 'credit_card' type accounts.
     *
     * @tags dashboard
     * @name DashboardDebtList
     * @summary Get total debt
     * @request GET:/api/dashboard/debt
     * @secure
     */
    dashboardDebtList: (params: RequestParams = {}) =>
      this.request<HandlersDebtResponse, HandlersHTTPError>({
        path: `/api/dashboard/debt`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns daily aggregated income and expense totals over a specified date range.
     *
     * @tags dashboard
     * @name DashboardTrendsList
     * @summary Get income & expense trends
     * @request GET:/api/dashboard/trends
     * @secure
     */
    dashboardTrendsList: (
      query?: {
        /** Start date for trend data (YYYY-MM-DD) */
        start?: string;
        /** End date for trend data (YYYY-MM-DD) */
        end?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DomainTrendPoint[], HandlersHTTPError>({
        path: `/api/dashboard/trends`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a paginated and filtered list of transactions, ideal for infinite scrolling.
     *
     * @tags transactions
     * @name TransactionsList
     * @summary List transactions
     * @request GET:/api/transactions
     * @secure
     */
    transactionsList: (
      query?: {
        /**
         * Number of transactions to return per page
         * @default 25
         */
        limit?: number;
        /** Cursor date from the previous page (RFC3339) */
        cursor_date?: string;
        /** Cursor ID from the previous page */
        cursor_id?: number;
        /** Filter by start date (YYYY-MM-DD) */
        start_date?: string;
        /** Filter by end date (YYYY-MM-DD) */
        end_date?: string;
        /** Filter by minimum transaction amount */
        amount_min?: number;
        /** Filter by maximum transaction amount */
        amount_max?: number;
        /** Filter by transaction direction ('in' or 'out') */
        direction?: string;
        /** Filter by a specific currency (e.g., 'USD') */
        currency?: string;
        /** Comma-separated list of categories to filter by */
        categories?: string;
        /** Search term for the merchant field (case-insensitive) */
        merchant?: string;
        /** Search term for the description field (case-insensitive) */
        description?: string;
        /** Filter by start time of day (HH:MM:SS) */
        time_start?: string;
        /** Filter by end time of day (HH:MM:SS) */
        time_end?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlersListTransactionsResponse, HandlersHTTPError>({
        path: `/api/transactions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Adds a new transaction to the database.
     *
     * @tags transactions
     * @name TransactionsCreate
     * @summary Create a new transaction
     * @request POST:/api/transactions
     * @secure
     */
    transactionsCreate: (
      transaction: DomainTransaction,
      params: RequestParams = {},
    ) =>
      this.request<HandlersCreateTransactionResponse, HandlersHTTPError>({
        path: `/api/transactions`,
        method: "POST",
        body: transaction,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a transaction by its numeric ID.
     *
     * @tags transactions
     * @name TransactionsDetail
     * @summary Get a single transaction
     * @request GET:/api/transactions/{id}
     * @secure
     */
    transactionsDetail: (id: number, params: RequestParams = {}) =>
      this.request<DomainTransaction, HandlersHTTPError>({
        path: `/api/transactions/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes a transaction by its numeric ID.
     *
     * @tags transactions
     * @name TransactionsDelete
     * @summary Delete a transaction
     * @request DELETE:/api/transactions/{id}
     * @secure
     */
    transactionsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, HandlersHTTPError>({
        path: `/api/transactions/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Partially updates a transaction's fields. Only the provided fields will be changed.
     *
     * @tags transactions
     * @name TransactionsPartialUpdate
     * @summary Update a transaction
     * @request PATCH:/api/transactions/{id}
     * @secure
     */
    transactionsPartialUpdate: (
      id: number,
      fields: HandlersUpdateTransactionRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, HandlersHTTPError>({
        path: `/api/transactions/${id}`,
        method: "PATCH",
        body: fields,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
