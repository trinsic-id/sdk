/* eslint-disable */
import _m0 from "protobufjs/minimal";
import {
  IdentityProvider,
  identityProviderFromJSON,
  identityProviderToJSON,
  WalletConfiguration,
  WalletExternalIdentity,
} from "../../provider/v1/provider";

/** Request to search items in wallet */
export interface SearchRequest {
  /** SQL Query to execute against items in wallet */
  query?:
    | string
    | undefined;
  /**
   * Token provided by previous `SearchResponse`
   * if more data is available for query
   */
  continuationToken?: string | undefined;
}

/** Response to `SearchRequest` */
export interface SearchResponse {
  /** Array of query results, as JSON strings */
  items?:
    | string[]
    | undefined;
  /** Whether more results are available for this query via `continuation_token` */
  hasMoreResults?:
    | boolean
    | undefined;
  /** Token to fetch next set of results via `SearchRequest` */
  continuationToken?: string | undefined;
}

/** Request to fetch an item from wallet */
export interface GetItemRequest {
  /** ID of item in wallet */
  itemId?: string | undefined;
}

/** Response to `GetItemRequest` */
export interface GetItemResponse {
  /** Item data as a JSON string */
  itemJson?:
    | string
    | undefined;
  /** Type of item specified when item was inserted into wallet */
  itemType?: string | undefined;
}

/** Request to update item in wallet */
export interface UpdateItemRequest {
  /** ID of item in wallet */
  itemId?:
    | string
    | undefined;
  /** Item type (ex. "VerifiableCredential") */
  itemType?: string | undefined;
}

/** Response to `UpdateItemRequest` */
export interface UpdateItemResponse {
}

/** Request to insert a JSON document into a wallet */
export interface InsertItemRequest {
  /** Document to insert; must be stringified JSON */
  itemJson?:
    | string
    | undefined;
  /** Item type (ex. "VerifiableCredential") */
  itemType?: string | undefined;
}

/** Response to `InsertItemRequest` */
export interface InsertItemResponse {
  /** ID of item inserted into wallet */
  itemId?: string | undefined;
}

/** Request to delete an item in a wallet */
export interface DeleteItemRequest {
  /** ID of item to delete */
  itemId?: string | undefined;
}

/** Response to `DeleteItemRequest` */
export interface DeleteItemResponse {
}

/** Request to delete a wallet */
export interface DeleteWalletRequest {
  /**
   * Email address of account to delete.
   * Mutually exclusive with `walletId` and `didUri`.
   */
  email?:
    | string
    | undefined;
  /**
   * Wallet ID of account to delete.
   * Mutually exclusive with `email` and `didUri`.
   */
  walletId?:
    | string
    | undefined;
  /**
   * DID URI of the account to delete.
   * Mutually exclusive with `email` and `walletId`.
   */
  didUri?: string | undefined;
}

/** Response to `DeleteWalletRequest`. Empty payload. */
export interface DeleteWalletResponse {
}

export interface CreateWalletRequest {
  /** Ecosystem ID of the wallet to create */
  ecosystemId?:
    | string
    | undefined;
  /**
   * Wallet name or description.
   * Use this field to add vendor specific information about this wallet,
   * such as email, phone, internal ID, or anything you'd like to associate
   * with this wallet. This field is searchable.
   */
  description?:
    | string
    | undefined;
  /**
   * Optional identity to add to the wallet (email or sms).
   * Use this field when inviting participants into an ecosystem.
   * If this field is set, an auth token will not be sent in the response.
   */
  identity?: CreateWalletRequest_ExternalIdentity | undefined;
}

export interface CreateWalletRequest_ExternalIdentity {
  /**
   * The user identity to add to the wallet
   * This can be an email address or phone number (formatted as +[country code][phone number])
   */
  identity?:
    | string
    | undefined;
  /** The type of identity provider, like EMAIL or PHONE */
  provider?: IdentityProvider | undefined;
}

export interface CreateWalletResponse {
  /** Auth token for the newly created wallet */
  authToken?:
    | string
    | undefined;
  /** Token ID of the newly generated token */
  tokenId?:
    | string
    | undefined;
  /** Wallet configuration */
  wallet?: WalletConfiguration | undefined;
}

export interface GenerateAuthTokenRequest {
  walletId?: string | undefined;
  tokenDescription?: string | undefined;
}

export interface GenerateAuthTokenResponse {
  tokenId?: string | undefined;
  authToken?: string | undefined;
}

/** Request to retrieve wallet information about a given wallet identified by its wallet ID */
export interface GetWalletInfoRequest {
  /** Wallet ID of the wallet to retrieve */
  walletId?: string | undefined;
}

/** Response to `GetWalletInfoRequest` */
export interface GetWalletInfoResponse {
  /** Wallet configuration */
  wallet?: WalletConfiguration | undefined;
}

/** Request to retrieve wallet information about the currently authenticated wallet */
export interface GetMyInfoRequest {
}

/** Response to `GetMyInfoRequest` */
export interface GetMyInfoResponse {
  /** Wallet configuration */
  wallet?: WalletConfiguration | undefined;
}

/** Request to revoke a previously issued auth token */
export interface RevokeAuthTokenRequest {
  /** Wallet ID of the wallet to from which to revoke the token */
  walletId?:
    | string
    | undefined;
  /** Token ID of the token to revoke */
  tokenId?: string | undefined;
}

export interface RevokeAuthTokenResponse {
}

export interface ListWalletsRequest {
  filter?: string | undefined;
}

export interface ListWalletsResponse {
  wallets?: WalletConfiguration[] | undefined;
}

export interface GetWalletFromExternalIdentityRequest {
  identity?: WalletExternalIdentity | undefined;
}

/** Response to `GetWalletFromExternalIdentityRequest` */
export interface GetWalletFromExternalIdentityResponse {
  /** Wallet configuration */
  wallet?: WalletConfiguration | undefined;
}

export interface AddExternalIdentityInitRequest {
  /**
   * The user identity to add to the wallet
   * This can be an email address or phone number (formatted as +[country code][phone number])
   */
  identity?:
    | string
    | undefined;
  /** The type of identity provider, like EMAIL or PHONE */
  provider?: IdentityProvider | undefined;
}

export interface AddExternalIdentityInitResponse {
  /** Challenge or reference to the challenge to be used in the `AddExternalIdentityConfirm` endpoint */
  challenge?: string | undefined;
}

export interface AddExternalIdentityConfirmRequest {
  /** The challenge received from the `AddExternalIdentityInit` endpoint */
  challenge?:
    | string
    | undefined;
  /**
   * The response to the challenge. If using Email or Phone,
   * this is the OTP code sent to the user's email or phone
   */
  response?: string | undefined;
}

export interface AddExternalIdentityConfirmResponse {
}

export interface RemoveExternalIdentityRequest {
  /**
   * The user identity to remove from the wallet
   * This can be an email address or phone number (formatted as +[country code][phone number])
   */
  identity?: string | undefined;
}

export interface RemoveExternalIdentityResponse {
}

export interface AuthenticateInitRequest {
  /** Identity to add to the wallet */
  identity?:
    | string
    | undefined;
  /** Identity provider */
  provider?:
    | IdentityProvider
    | undefined;
  /** Ecosystem ID to which the wallet belongs */
  ecosystemId?: string | undefined;
}

export interface AuthenticateInitResponse {
  /**
   * The challenge received from the `AcquireAuthTokenInit` endpoint
   * Pass this challenge back to the `AcquireAuthTokenConfirm` endpoint
   */
  challenge?: string | undefined;
}

export interface AuthenticateResendCodeRequest {
  /** Challenge for the code you want resent. */
  challenge?: string | undefined;
}

export interface AuthenticateResendCodeResponse {
}

export interface AuthenticateConfirmRequest {
  /** The challenge received from the `AcquireAuthTokenInit` endpoint */
  challenge?:
    | string
    | undefined;
  /**
   * The response to the challenge. If using Email or Phone,
   * this is the OTP code sent to the user's email or phone
   */
  response?: string | undefined;
}

export interface AuthenticateConfirmResponse {
  /** Auth token for the wallet */
  authToken?: string | undefined;
}

/** Request to list templates by */
export interface ListByVerificationTemplateRequest {
  /** ID of verification template to list matching credentials */
  verificationTemplateId?:
    | string
    | undefined;
  /**
   * Token provided by previous `ListCredentialTemplatesResponse`
   * if more data is available for query
   */
  continuationToken?: string | undefined;
}

/** Response to `ListByVerificationTemplateRequest` */
export interface ListByVerificationTemplateResponse {
  /** Array of query results, as JSON strings */
  items?:
    | string[]
    | undefined;
  /** Whether more results are available for this query via `continuation_token` */
  hasMoreResults?:
    | boolean
    | undefined;
  /** Token to fetch next set of results via `ListByVerificationTemplateRequest` */
  continuationToken?: string | undefined;
}

function createBaseSearchRequest(): SearchRequest {
  return { query: "", continuationToken: "" };
}

export const SearchRequest = {
  encode(message: SearchRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.query !== undefined && message.query !== "") {
      writer.uint32(10).string(message.query);
    }
    if (message.continuationToken !== undefined && message.continuationToken !== "") {
      writer.uint32(18).string(message.continuationToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.query = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.continuationToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SearchRequest {
    return {
      query: isSet(object.query) ? String(object.query) : "",
      continuationToken: isSet(object.continuationToken) ? String(object.continuationToken) : "",
    };
  },

  toJSON(message: SearchRequest): unknown {
    const obj: any = {};
    if (message.query !== undefined && message.query !== "") {
      obj.query = message.query;
    }
    if (message.continuationToken !== undefined && message.continuationToken !== "") {
      obj.continuationToken = message.continuationToken;
    }
    return obj;
  },

  create(base?: DeepPartial<SearchRequest>): SearchRequest {
    return SearchRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SearchRequest>): SearchRequest {
    const message = createBaseSearchRequest();
    message.query = object.query ?? "";
    message.continuationToken = object.continuationToken ?? "";
    return message;
  },
};

function createBaseSearchResponse(): SearchResponse {
  return { items: [], hasMoreResults: false, continuationToken: "" };
}

export const SearchResponse = {
  encode(message: SearchResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.items !== undefined && message.items.length !== 0) {
      for (const v of message.items) {
        writer.uint32(10).string(v!);
      }
    }
    if (message.hasMoreResults === true) {
      writer.uint32(16).bool(message.hasMoreResults);
    }
    if (message.continuationToken !== undefined && message.continuationToken !== "") {
      writer.uint32(34).string(message.continuationToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.items!.push(reader.string());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.hasMoreResults = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.continuationToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SearchResponse {
    return {
      items: Array.isArray(object?.items) ? object.items.map((e: any) => String(e)) : [],
      hasMoreResults: isSet(object.hasMoreResults) ? Boolean(object.hasMoreResults) : false,
      continuationToken: isSet(object.continuationToken) ? String(object.continuationToken) : "",
    };
  },

  toJSON(message: SearchResponse): unknown {
    const obj: any = {};
    if (message.items?.length) {
      obj.items = message.items;
    }
    if (message.hasMoreResults === true) {
      obj.hasMoreResults = message.hasMoreResults;
    }
    if (message.continuationToken !== undefined && message.continuationToken !== "") {
      obj.continuationToken = message.continuationToken;
    }
    return obj;
  },

  create(base?: DeepPartial<SearchResponse>): SearchResponse {
    return SearchResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SearchResponse>): SearchResponse {
    const message = createBaseSearchResponse();
    message.items = object.items?.map((e) => e) || [];
    message.hasMoreResults = object.hasMoreResults ?? false;
    message.continuationToken = object.continuationToken ?? "";
    return message;
  },
};

function createBaseGetItemRequest(): GetItemRequest {
  return { itemId: "" };
}

export const GetItemRequest = {
  encode(message: GetItemRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.itemId !== undefined && message.itemId !== "") {
      writer.uint32(10).string(message.itemId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetItemRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.itemId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetItemRequest {
    return { itemId: isSet(object.itemId) ? String(object.itemId) : "" };
  },

  toJSON(message: GetItemRequest): unknown {
    const obj: any = {};
    if (message.itemId !== undefined && message.itemId !== "") {
      obj.itemId = message.itemId;
    }
    return obj;
  },

  create(base?: DeepPartial<GetItemRequest>): GetItemRequest {
    return GetItemRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetItemRequest>): GetItemRequest {
    const message = createBaseGetItemRequest();
    message.itemId = object.itemId ?? "";
    return message;
  },
};

function createBaseGetItemResponse(): GetItemResponse {
  return { itemJson: "", itemType: "" };
}

export const GetItemResponse = {
  encode(message: GetItemResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.itemJson !== undefined && message.itemJson !== "") {
      writer.uint32(10).string(message.itemJson);
    }
    if (message.itemType !== undefined && message.itemType !== "") {
      writer.uint32(18).string(message.itemType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetItemResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.itemJson = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.itemType = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetItemResponse {
    return {
      itemJson: isSet(object.itemJson) ? String(object.itemJson) : "",
      itemType: isSet(object.itemType) ? String(object.itemType) : "",
    };
  },

  toJSON(message: GetItemResponse): unknown {
    const obj: any = {};
    if (message.itemJson !== undefined && message.itemJson !== "") {
      obj.itemJson = message.itemJson;
    }
    if (message.itemType !== undefined && message.itemType !== "") {
      obj.itemType = message.itemType;
    }
    return obj;
  },

  create(base?: DeepPartial<GetItemResponse>): GetItemResponse {
    return GetItemResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetItemResponse>): GetItemResponse {
    const message = createBaseGetItemResponse();
    message.itemJson = object.itemJson ?? "";
    message.itemType = object.itemType ?? "";
    return message;
  },
};

function createBaseUpdateItemRequest(): UpdateItemRequest {
  return { itemId: "", itemType: "" };
}

export const UpdateItemRequest = {
  encode(message: UpdateItemRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.itemId !== undefined && message.itemId !== "") {
      writer.uint32(10).string(message.itemId);
    }
    if (message.itemType !== undefined && message.itemType !== "") {
      writer.uint32(18).string(message.itemType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateItemRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.itemId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.itemType = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateItemRequest {
    return {
      itemId: isSet(object.itemId) ? String(object.itemId) : "",
      itemType: isSet(object.itemType) ? String(object.itemType) : "",
    };
  },

  toJSON(message: UpdateItemRequest): unknown {
    const obj: any = {};
    if (message.itemId !== undefined && message.itemId !== "") {
      obj.itemId = message.itemId;
    }
    if (message.itemType !== undefined && message.itemType !== "") {
      obj.itemType = message.itemType;
    }
    return obj;
  },

  create(base?: DeepPartial<UpdateItemRequest>): UpdateItemRequest {
    return UpdateItemRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<UpdateItemRequest>): UpdateItemRequest {
    const message = createBaseUpdateItemRequest();
    message.itemId = object.itemId ?? "";
    message.itemType = object.itemType ?? "";
    return message;
  },
};

function createBaseUpdateItemResponse(): UpdateItemResponse {
  return {};
}

export const UpdateItemResponse = {
  encode(_: UpdateItemResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateItemResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): UpdateItemResponse {
    return {};
  },

  toJSON(_: UpdateItemResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<UpdateItemResponse>): UpdateItemResponse {
    return UpdateItemResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<UpdateItemResponse>): UpdateItemResponse {
    const message = createBaseUpdateItemResponse();
    return message;
  },
};

function createBaseInsertItemRequest(): InsertItemRequest {
  return { itemJson: "", itemType: "" };
}

export const InsertItemRequest = {
  encode(message: InsertItemRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.itemJson !== undefined && message.itemJson !== "") {
      writer.uint32(10).string(message.itemJson);
    }
    if (message.itemType !== undefined && message.itemType !== "") {
      writer.uint32(18).string(message.itemType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InsertItemRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInsertItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.itemJson = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.itemType = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): InsertItemRequest {
    return {
      itemJson: isSet(object.itemJson) ? String(object.itemJson) : "",
      itemType: isSet(object.itemType) ? String(object.itemType) : "",
    };
  },

  toJSON(message: InsertItemRequest): unknown {
    const obj: any = {};
    if (message.itemJson !== undefined && message.itemJson !== "") {
      obj.itemJson = message.itemJson;
    }
    if (message.itemType !== undefined && message.itemType !== "") {
      obj.itemType = message.itemType;
    }
    return obj;
  },

  create(base?: DeepPartial<InsertItemRequest>): InsertItemRequest {
    return InsertItemRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<InsertItemRequest>): InsertItemRequest {
    const message = createBaseInsertItemRequest();
    message.itemJson = object.itemJson ?? "";
    message.itemType = object.itemType ?? "";
    return message;
  },
};

function createBaseInsertItemResponse(): InsertItemResponse {
  return { itemId: "" };
}

export const InsertItemResponse = {
  encode(message: InsertItemResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.itemId !== undefined && message.itemId !== "") {
      writer.uint32(18).string(message.itemId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InsertItemResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInsertItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.itemId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): InsertItemResponse {
    return { itemId: isSet(object.itemId) ? String(object.itemId) : "" };
  },

  toJSON(message: InsertItemResponse): unknown {
    const obj: any = {};
    if (message.itemId !== undefined && message.itemId !== "") {
      obj.itemId = message.itemId;
    }
    return obj;
  },

  create(base?: DeepPartial<InsertItemResponse>): InsertItemResponse {
    return InsertItemResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<InsertItemResponse>): InsertItemResponse {
    const message = createBaseInsertItemResponse();
    message.itemId = object.itemId ?? "";
    return message;
  },
};

function createBaseDeleteItemRequest(): DeleteItemRequest {
  return { itemId: "" };
}

export const DeleteItemRequest = {
  encode(message: DeleteItemRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.itemId !== undefined && message.itemId !== "") {
      writer.uint32(10).string(message.itemId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteItemRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.itemId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeleteItemRequest {
    return { itemId: isSet(object.itemId) ? String(object.itemId) : "" };
  },

  toJSON(message: DeleteItemRequest): unknown {
    const obj: any = {};
    if (message.itemId !== undefined && message.itemId !== "") {
      obj.itemId = message.itemId;
    }
    return obj;
  },

  create(base?: DeepPartial<DeleteItemRequest>): DeleteItemRequest {
    return DeleteItemRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DeleteItemRequest>): DeleteItemRequest {
    const message = createBaseDeleteItemRequest();
    message.itemId = object.itemId ?? "";
    return message;
  },
};

function createBaseDeleteItemResponse(): DeleteItemResponse {
  return {};
}

export const DeleteItemResponse = {
  encode(_: DeleteItemResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteItemResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): DeleteItemResponse {
    return {};
  },

  toJSON(_: DeleteItemResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<DeleteItemResponse>): DeleteItemResponse {
    return DeleteItemResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<DeleteItemResponse>): DeleteItemResponse {
    const message = createBaseDeleteItemResponse();
    return message;
  },
};

function createBaseDeleteWalletRequest(): DeleteWalletRequest {
  return { email: undefined, walletId: undefined, didUri: undefined };
}

export const DeleteWalletRequest = {
  encode(message: DeleteWalletRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.email !== undefined) {
      writer.uint32(10).string(message.email);
    }
    if (message.walletId !== undefined) {
      writer.uint32(18).string(message.walletId);
    }
    if (message.didUri !== undefined) {
      writer.uint32(34).string(message.didUri);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteWalletRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteWalletRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.email = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.walletId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.didUri = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeleteWalletRequest {
    return {
      email: isSet(object.email) ? String(object.email) : undefined,
      walletId: isSet(object.walletId) ? String(object.walletId) : undefined,
      didUri: isSet(object.didUri) ? String(object.didUri) : undefined,
    };
  },

  toJSON(message: DeleteWalletRequest): unknown {
    const obj: any = {};
    if (message.email !== undefined) {
      obj.email = message.email;
    }
    if (message.walletId !== undefined) {
      obj.walletId = message.walletId;
    }
    if (message.didUri !== undefined) {
      obj.didUri = message.didUri;
    }
    return obj;
  },

  create(base?: DeepPartial<DeleteWalletRequest>): DeleteWalletRequest {
    return DeleteWalletRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DeleteWalletRequest>): DeleteWalletRequest {
    const message = createBaseDeleteWalletRequest();
    message.email = object.email ?? undefined;
    message.walletId = object.walletId ?? undefined;
    message.didUri = object.didUri ?? undefined;
    return message;
  },
};

function createBaseDeleteWalletResponse(): DeleteWalletResponse {
  return {};
}

export const DeleteWalletResponse = {
  encode(_: DeleteWalletResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteWalletResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteWalletResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): DeleteWalletResponse {
    return {};
  },

  toJSON(_: DeleteWalletResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<DeleteWalletResponse>): DeleteWalletResponse {
    return DeleteWalletResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<DeleteWalletResponse>): DeleteWalletResponse {
    const message = createBaseDeleteWalletResponse();
    return message;
  },
};

function createBaseCreateWalletRequest(): CreateWalletRequest {
  return { ecosystemId: "", description: undefined, identity: undefined };
}

export const CreateWalletRequest = {
  encode(message: CreateWalletRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ecosystemId !== undefined && message.ecosystemId !== "") {
      writer.uint32(10).string(message.ecosystemId);
    }
    if (message.description !== undefined) {
      writer.uint32(18).string(message.description);
    }
    if (message.identity !== undefined) {
      CreateWalletRequest_ExternalIdentity.encode(message.identity, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateWalletRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateWalletRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.ecosystemId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.description = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.identity = CreateWalletRequest_ExternalIdentity.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateWalletRequest {
    return {
      ecosystemId: isSet(object.ecosystemId) ? String(object.ecosystemId) : "",
      description: isSet(object.description) ? String(object.description) : undefined,
      identity: isSet(object.identity) ? CreateWalletRequest_ExternalIdentity.fromJSON(object.identity) : undefined,
    };
  },

  toJSON(message: CreateWalletRequest): unknown {
    const obj: any = {};
    if (message.ecosystemId !== undefined && message.ecosystemId !== "") {
      obj.ecosystemId = message.ecosystemId;
    }
    if (message.description !== undefined) {
      obj.description = message.description;
    }
    if (message.identity !== undefined) {
      obj.identity = CreateWalletRequest_ExternalIdentity.toJSON(message.identity);
    }
    return obj;
  },

  create(base?: DeepPartial<CreateWalletRequest>): CreateWalletRequest {
    return CreateWalletRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateWalletRequest>): CreateWalletRequest {
    const message = createBaseCreateWalletRequest();
    message.ecosystemId = object.ecosystemId ?? "";
    message.description = object.description ?? undefined;
    message.identity = (object.identity !== undefined && object.identity !== null)
      ? CreateWalletRequest_ExternalIdentity.fromPartial(object.identity)
      : undefined;
    return message;
  },
};

function createBaseCreateWalletRequest_ExternalIdentity(): CreateWalletRequest_ExternalIdentity {
  return { identity: "", provider: 0 };
}

export const CreateWalletRequest_ExternalIdentity = {
  encode(message: CreateWalletRequest_ExternalIdentity, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== undefined && message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.provider !== undefined && message.provider !== 0) {
      writer.uint32(16).int32(message.provider);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateWalletRequest_ExternalIdentity {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateWalletRequest_ExternalIdentity();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identity = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.provider = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateWalletRequest_ExternalIdentity {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      provider: isSet(object.provider) ? identityProviderFromJSON(object.provider) : 0,
    };
  },

  toJSON(message: CreateWalletRequest_ExternalIdentity): unknown {
    const obj: any = {};
    if (message.identity !== undefined && message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.provider !== undefined && message.provider !== 0) {
      obj.provider = identityProviderToJSON(message.provider);
    }
    return obj;
  },

  create(base?: DeepPartial<CreateWalletRequest_ExternalIdentity>): CreateWalletRequest_ExternalIdentity {
    return CreateWalletRequest_ExternalIdentity.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateWalletRequest_ExternalIdentity>): CreateWalletRequest_ExternalIdentity {
    const message = createBaseCreateWalletRequest_ExternalIdentity();
    message.identity = object.identity ?? "";
    message.provider = object.provider ?? 0;
    return message;
  },
};

function createBaseCreateWalletResponse(): CreateWalletResponse {
  return { authToken: "", tokenId: "", wallet: undefined };
}

export const CreateWalletResponse = {
  encode(message: CreateWalletResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined && message.authToken !== "") {
      writer.uint32(18).string(message.authToken);
    }
    if (message.tokenId !== undefined && message.tokenId !== "") {
      writer.uint32(26).string(message.tokenId);
    }
    if (message.wallet !== undefined) {
      WalletConfiguration.encode(message.wallet, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateWalletResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateWalletResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.authToken = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.tokenId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.wallet = WalletConfiguration.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateWalletResponse {
    return {
      authToken: isSet(object.authToken) ? String(object.authToken) : "",
      tokenId: isSet(object.tokenId) ? String(object.tokenId) : "",
      wallet: isSet(object.wallet) ? WalletConfiguration.fromJSON(object.wallet) : undefined,
    };
  },

  toJSON(message: CreateWalletResponse): unknown {
    const obj: any = {};
    if (message.authToken !== undefined && message.authToken !== "") {
      obj.authToken = message.authToken;
    }
    if (message.tokenId !== undefined && message.tokenId !== "") {
      obj.tokenId = message.tokenId;
    }
    if (message.wallet !== undefined) {
      obj.wallet = WalletConfiguration.toJSON(message.wallet);
    }
    return obj;
  },

  create(base?: DeepPartial<CreateWalletResponse>): CreateWalletResponse {
    return CreateWalletResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateWalletResponse>): CreateWalletResponse {
    const message = createBaseCreateWalletResponse();
    message.authToken = object.authToken ?? "";
    message.tokenId = object.tokenId ?? "";
    message.wallet = (object.wallet !== undefined && object.wallet !== null)
      ? WalletConfiguration.fromPartial(object.wallet)
      : undefined;
    return message;
  },
};

function createBaseGenerateAuthTokenRequest(): GenerateAuthTokenRequest {
  return { walletId: "", tokenDescription: "" };
}

export const GenerateAuthTokenRequest = {
  encode(message: GenerateAuthTokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.walletId !== undefined && message.walletId !== "") {
      writer.uint32(10).string(message.walletId);
    }
    if (message.tokenDescription !== undefined && message.tokenDescription !== "") {
      writer.uint32(18).string(message.tokenDescription);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenerateAuthTokenRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenerateAuthTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.walletId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.tokenDescription = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GenerateAuthTokenRequest {
    return {
      walletId: isSet(object.walletId) ? String(object.walletId) : "",
      tokenDescription: isSet(object.tokenDescription) ? String(object.tokenDescription) : "",
    };
  },

  toJSON(message: GenerateAuthTokenRequest): unknown {
    const obj: any = {};
    if (message.walletId !== undefined && message.walletId !== "") {
      obj.walletId = message.walletId;
    }
    if (message.tokenDescription !== undefined && message.tokenDescription !== "") {
      obj.tokenDescription = message.tokenDescription;
    }
    return obj;
  },

  create(base?: DeepPartial<GenerateAuthTokenRequest>): GenerateAuthTokenRequest {
    return GenerateAuthTokenRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GenerateAuthTokenRequest>): GenerateAuthTokenRequest {
    const message = createBaseGenerateAuthTokenRequest();
    message.walletId = object.walletId ?? "";
    message.tokenDescription = object.tokenDescription ?? "";
    return message;
  },
};

function createBaseGenerateAuthTokenResponse(): GenerateAuthTokenResponse {
  return { tokenId: "", authToken: "" };
}

export const GenerateAuthTokenResponse = {
  encode(message: GenerateAuthTokenResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tokenId !== undefined && message.tokenId !== "") {
      writer.uint32(10).string(message.tokenId);
    }
    if (message.authToken !== undefined && message.authToken !== "") {
      writer.uint32(18).string(message.authToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenerateAuthTokenResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenerateAuthTokenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tokenId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.authToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GenerateAuthTokenResponse {
    return {
      tokenId: isSet(object.tokenId) ? String(object.tokenId) : "",
      authToken: isSet(object.authToken) ? String(object.authToken) : "",
    };
  },

  toJSON(message: GenerateAuthTokenResponse): unknown {
    const obj: any = {};
    if (message.tokenId !== undefined && message.tokenId !== "") {
      obj.tokenId = message.tokenId;
    }
    if (message.authToken !== undefined && message.authToken !== "") {
      obj.authToken = message.authToken;
    }
    return obj;
  },

  create(base?: DeepPartial<GenerateAuthTokenResponse>): GenerateAuthTokenResponse {
    return GenerateAuthTokenResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GenerateAuthTokenResponse>): GenerateAuthTokenResponse {
    const message = createBaseGenerateAuthTokenResponse();
    message.tokenId = object.tokenId ?? "";
    message.authToken = object.authToken ?? "";
    return message;
  },
};

function createBaseGetWalletInfoRequest(): GetWalletInfoRequest {
  return { walletId: "" };
}

export const GetWalletInfoRequest = {
  encode(message: GetWalletInfoRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.walletId !== undefined && message.walletId !== "") {
      writer.uint32(10).string(message.walletId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetWalletInfoRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetWalletInfoRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.walletId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetWalletInfoRequest {
    return { walletId: isSet(object.walletId) ? String(object.walletId) : "" };
  },

  toJSON(message: GetWalletInfoRequest): unknown {
    const obj: any = {};
    if (message.walletId !== undefined && message.walletId !== "") {
      obj.walletId = message.walletId;
    }
    return obj;
  },

  create(base?: DeepPartial<GetWalletInfoRequest>): GetWalletInfoRequest {
    return GetWalletInfoRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetWalletInfoRequest>): GetWalletInfoRequest {
    const message = createBaseGetWalletInfoRequest();
    message.walletId = object.walletId ?? "";
    return message;
  },
};

function createBaseGetWalletInfoResponse(): GetWalletInfoResponse {
  return { wallet: undefined };
}

export const GetWalletInfoResponse = {
  encode(message: GetWalletInfoResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.wallet !== undefined) {
      WalletConfiguration.encode(message.wallet, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetWalletInfoResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetWalletInfoResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.wallet = WalletConfiguration.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetWalletInfoResponse {
    return { wallet: isSet(object.wallet) ? WalletConfiguration.fromJSON(object.wallet) : undefined };
  },

  toJSON(message: GetWalletInfoResponse): unknown {
    const obj: any = {};
    if (message.wallet !== undefined) {
      obj.wallet = WalletConfiguration.toJSON(message.wallet);
    }
    return obj;
  },

  create(base?: DeepPartial<GetWalletInfoResponse>): GetWalletInfoResponse {
    return GetWalletInfoResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetWalletInfoResponse>): GetWalletInfoResponse {
    const message = createBaseGetWalletInfoResponse();
    message.wallet = (object.wallet !== undefined && object.wallet !== null)
      ? WalletConfiguration.fromPartial(object.wallet)
      : undefined;
    return message;
  },
};

function createBaseGetMyInfoRequest(): GetMyInfoRequest {
  return {};
}

export const GetMyInfoRequest = {
  encode(_: GetMyInfoRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetMyInfoRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetMyInfoRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): GetMyInfoRequest {
    return {};
  },

  toJSON(_: GetMyInfoRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<GetMyInfoRequest>): GetMyInfoRequest {
    return GetMyInfoRequest.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<GetMyInfoRequest>): GetMyInfoRequest {
    const message = createBaseGetMyInfoRequest();
    return message;
  },
};

function createBaseGetMyInfoResponse(): GetMyInfoResponse {
  return { wallet: undefined };
}

export const GetMyInfoResponse = {
  encode(message: GetMyInfoResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.wallet !== undefined) {
      WalletConfiguration.encode(message.wallet, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetMyInfoResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetMyInfoResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.wallet = WalletConfiguration.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetMyInfoResponse {
    return { wallet: isSet(object.wallet) ? WalletConfiguration.fromJSON(object.wallet) : undefined };
  },

  toJSON(message: GetMyInfoResponse): unknown {
    const obj: any = {};
    if (message.wallet !== undefined) {
      obj.wallet = WalletConfiguration.toJSON(message.wallet);
    }
    return obj;
  },

  create(base?: DeepPartial<GetMyInfoResponse>): GetMyInfoResponse {
    return GetMyInfoResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetMyInfoResponse>): GetMyInfoResponse {
    const message = createBaseGetMyInfoResponse();
    message.wallet = (object.wallet !== undefined && object.wallet !== null)
      ? WalletConfiguration.fromPartial(object.wallet)
      : undefined;
    return message;
  },
};

function createBaseRevokeAuthTokenRequest(): RevokeAuthTokenRequest {
  return { walletId: "", tokenId: "" };
}

export const RevokeAuthTokenRequest = {
  encode(message: RevokeAuthTokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.walletId !== undefined && message.walletId !== "") {
      writer.uint32(10).string(message.walletId);
    }
    if (message.tokenId !== undefined && message.tokenId !== "") {
      writer.uint32(18).string(message.tokenId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RevokeAuthTokenRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRevokeAuthTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.walletId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.tokenId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RevokeAuthTokenRequest {
    return {
      walletId: isSet(object.walletId) ? String(object.walletId) : "",
      tokenId: isSet(object.tokenId) ? String(object.tokenId) : "",
    };
  },

  toJSON(message: RevokeAuthTokenRequest): unknown {
    const obj: any = {};
    if (message.walletId !== undefined && message.walletId !== "") {
      obj.walletId = message.walletId;
    }
    if (message.tokenId !== undefined && message.tokenId !== "") {
      obj.tokenId = message.tokenId;
    }
    return obj;
  },

  create(base?: DeepPartial<RevokeAuthTokenRequest>): RevokeAuthTokenRequest {
    return RevokeAuthTokenRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<RevokeAuthTokenRequest>): RevokeAuthTokenRequest {
    const message = createBaseRevokeAuthTokenRequest();
    message.walletId = object.walletId ?? "";
    message.tokenId = object.tokenId ?? "";
    return message;
  },
};

function createBaseRevokeAuthTokenResponse(): RevokeAuthTokenResponse {
  return {};
}

export const RevokeAuthTokenResponse = {
  encode(_: RevokeAuthTokenResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RevokeAuthTokenResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRevokeAuthTokenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): RevokeAuthTokenResponse {
    return {};
  },

  toJSON(_: RevokeAuthTokenResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<RevokeAuthTokenResponse>): RevokeAuthTokenResponse {
    return RevokeAuthTokenResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<RevokeAuthTokenResponse>): RevokeAuthTokenResponse {
    const message = createBaseRevokeAuthTokenResponse();
    return message;
  },
};

function createBaseListWalletsRequest(): ListWalletsRequest {
  return { filter: "" };
}

export const ListWalletsRequest = {
  encode(message: ListWalletsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.filter !== undefined && message.filter !== "") {
      writer.uint32(10).string(message.filter);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListWalletsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListWalletsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.filter = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListWalletsRequest {
    return { filter: isSet(object.filter) ? String(object.filter) : "" };
  },

  toJSON(message: ListWalletsRequest): unknown {
    const obj: any = {};
    if (message.filter !== undefined && message.filter !== "") {
      obj.filter = message.filter;
    }
    return obj;
  },

  create(base?: DeepPartial<ListWalletsRequest>): ListWalletsRequest {
    return ListWalletsRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListWalletsRequest>): ListWalletsRequest {
    const message = createBaseListWalletsRequest();
    message.filter = object.filter ?? "";
    return message;
  },
};

function createBaseListWalletsResponse(): ListWalletsResponse {
  return { wallets: [] };
}

export const ListWalletsResponse = {
  encode(message: ListWalletsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.wallets !== undefined && message.wallets.length !== 0) {
      for (const v of message.wallets) {
        WalletConfiguration.encode(v!, writer.uint32(10).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListWalletsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListWalletsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.wallets!.push(WalletConfiguration.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListWalletsResponse {
    return {
      wallets: Array.isArray(object?.wallets) ? object.wallets.map((e: any) => WalletConfiguration.fromJSON(e)) : [],
    };
  },

  toJSON(message: ListWalletsResponse): unknown {
    const obj: any = {};
    if (message.wallets?.length) {
      obj.wallets = message.wallets.map((e) => WalletConfiguration.toJSON(e));
    }
    return obj;
  },

  create(base?: DeepPartial<ListWalletsResponse>): ListWalletsResponse {
    return ListWalletsResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListWalletsResponse>): ListWalletsResponse {
    const message = createBaseListWalletsResponse();
    message.wallets = object.wallets?.map((e) => WalletConfiguration.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetWalletFromExternalIdentityRequest(): GetWalletFromExternalIdentityRequest {
  return { identity: undefined };
}

export const GetWalletFromExternalIdentityRequest = {
  encode(message: GetWalletFromExternalIdentityRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== undefined) {
      WalletExternalIdentity.encode(message.identity, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetWalletFromExternalIdentityRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetWalletFromExternalIdentityRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identity = WalletExternalIdentity.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetWalletFromExternalIdentityRequest {
    return { identity: isSet(object.identity) ? WalletExternalIdentity.fromJSON(object.identity) : undefined };
  },

  toJSON(message: GetWalletFromExternalIdentityRequest): unknown {
    const obj: any = {};
    if (message.identity !== undefined) {
      obj.identity = WalletExternalIdentity.toJSON(message.identity);
    }
    return obj;
  },

  create(base?: DeepPartial<GetWalletFromExternalIdentityRequest>): GetWalletFromExternalIdentityRequest {
    return GetWalletFromExternalIdentityRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetWalletFromExternalIdentityRequest>): GetWalletFromExternalIdentityRequest {
    const message = createBaseGetWalletFromExternalIdentityRequest();
    message.identity = (object.identity !== undefined && object.identity !== null)
      ? WalletExternalIdentity.fromPartial(object.identity)
      : undefined;
    return message;
  },
};

function createBaseGetWalletFromExternalIdentityResponse(): GetWalletFromExternalIdentityResponse {
  return { wallet: undefined };
}

export const GetWalletFromExternalIdentityResponse = {
  encode(message: GetWalletFromExternalIdentityResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.wallet !== undefined) {
      WalletConfiguration.encode(message.wallet, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetWalletFromExternalIdentityResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetWalletFromExternalIdentityResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.wallet = WalletConfiguration.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetWalletFromExternalIdentityResponse {
    return { wallet: isSet(object.wallet) ? WalletConfiguration.fromJSON(object.wallet) : undefined };
  },

  toJSON(message: GetWalletFromExternalIdentityResponse): unknown {
    const obj: any = {};
    if (message.wallet !== undefined) {
      obj.wallet = WalletConfiguration.toJSON(message.wallet);
    }
    return obj;
  },

  create(base?: DeepPartial<GetWalletFromExternalIdentityResponse>): GetWalletFromExternalIdentityResponse {
    return GetWalletFromExternalIdentityResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetWalletFromExternalIdentityResponse>): GetWalletFromExternalIdentityResponse {
    const message = createBaseGetWalletFromExternalIdentityResponse();
    message.wallet = (object.wallet !== undefined && object.wallet !== null)
      ? WalletConfiguration.fromPartial(object.wallet)
      : undefined;
    return message;
  },
};

function createBaseAddExternalIdentityInitRequest(): AddExternalIdentityInitRequest {
  return { identity: "", provider: 0 };
}

export const AddExternalIdentityInitRequest = {
  encode(message: AddExternalIdentityInitRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== undefined && message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.provider !== undefined && message.provider !== 0) {
      writer.uint32(16).int32(message.provider);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddExternalIdentityInitRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddExternalIdentityInitRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identity = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.provider = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AddExternalIdentityInitRequest {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      provider: isSet(object.provider) ? identityProviderFromJSON(object.provider) : 0,
    };
  },

  toJSON(message: AddExternalIdentityInitRequest): unknown {
    const obj: any = {};
    if (message.identity !== undefined && message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.provider !== undefined && message.provider !== 0) {
      obj.provider = identityProviderToJSON(message.provider);
    }
    return obj;
  },

  create(base?: DeepPartial<AddExternalIdentityInitRequest>): AddExternalIdentityInitRequest {
    return AddExternalIdentityInitRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AddExternalIdentityInitRequest>): AddExternalIdentityInitRequest {
    const message = createBaseAddExternalIdentityInitRequest();
    message.identity = object.identity ?? "";
    message.provider = object.provider ?? 0;
    return message;
  },
};

function createBaseAddExternalIdentityInitResponse(): AddExternalIdentityInitResponse {
  return { challenge: "" };
}

export const AddExternalIdentityInitResponse = {
  encode(message: AddExternalIdentityInitResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.challenge !== undefined && message.challenge !== "") {
      writer.uint32(10).string(message.challenge);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddExternalIdentityInitResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddExternalIdentityInitResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.challenge = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AddExternalIdentityInitResponse {
    return { challenge: isSet(object.challenge) ? String(object.challenge) : "" };
  },

  toJSON(message: AddExternalIdentityInitResponse): unknown {
    const obj: any = {};
    if (message.challenge !== undefined && message.challenge !== "") {
      obj.challenge = message.challenge;
    }
    return obj;
  },

  create(base?: DeepPartial<AddExternalIdentityInitResponse>): AddExternalIdentityInitResponse {
    return AddExternalIdentityInitResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AddExternalIdentityInitResponse>): AddExternalIdentityInitResponse {
    const message = createBaseAddExternalIdentityInitResponse();
    message.challenge = object.challenge ?? "";
    return message;
  },
};

function createBaseAddExternalIdentityConfirmRequest(): AddExternalIdentityConfirmRequest {
  return { challenge: "", response: "" };
}

export const AddExternalIdentityConfirmRequest = {
  encode(message: AddExternalIdentityConfirmRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.challenge !== undefined && message.challenge !== "") {
      writer.uint32(10).string(message.challenge);
    }
    if (message.response !== undefined && message.response !== "") {
      writer.uint32(18).string(message.response);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddExternalIdentityConfirmRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddExternalIdentityConfirmRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.challenge = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.response = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AddExternalIdentityConfirmRequest {
    return {
      challenge: isSet(object.challenge) ? String(object.challenge) : "",
      response: isSet(object.response) ? String(object.response) : "",
    };
  },

  toJSON(message: AddExternalIdentityConfirmRequest): unknown {
    const obj: any = {};
    if (message.challenge !== undefined && message.challenge !== "") {
      obj.challenge = message.challenge;
    }
    if (message.response !== undefined && message.response !== "") {
      obj.response = message.response;
    }
    return obj;
  },

  create(base?: DeepPartial<AddExternalIdentityConfirmRequest>): AddExternalIdentityConfirmRequest {
    return AddExternalIdentityConfirmRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AddExternalIdentityConfirmRequest>): AddExternalIdentityConfirmRequest {
    const message = createBaseAddExternalIdentityConfirmRequest();
    message.challenge = object.challenge ?? "";
    message.response = object.response ?? "";
    return message;
  },
};

function createBaseAddExternalIdentityConfirmResponse(): AddExternalIdentityConfirmResponse {
  return {};
}

export const AddExternalIdentityConfirmResponse = {
  encode(_: AddExternalIdentityConfirmResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddExternalIdentityConfirmResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddExternalIdentityConfirmResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): AddExternalIdentityConfirmResponse {
    return {};
  },

  toJSON(_: AddExternalIdentityConfirmResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<AddExternalIdentityConfirmResponse>): AddExternalIdentityConfirmResponse {
    return AddExternalIdentityConfirmResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<AddExternalIdentityConfirmResponse>): AddExternalIdentityConfirmResponse {
    const message = createBaseAddExternalIdentityConfirmResponse();
    return message;
  },
};

function createBaseRemoveExternalIdentityRequest(): RemoveExternalIdentityRequest {
  return { identity: "" };
}

export const RemoveExternalIdentityRequest = {
  encode(message: RemoveExternalIdentityRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== undefined && message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveExternalIdentityRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveExternalIdentityRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identity = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RemoveExternalIdentityRequest {
    return { identity: isSet(object.identity) ? String(object.identity) : "" };
  },

  toJSON(message: RemoveExternalIdentityRequest): unknown {
    const obj: any = {};
    if (message.identity !== undefined && message.identity !== "") {
      obj.identity = message.identity;
    }
    return obj;
  },

  create(base?: DeepPartial<RemoveExternalIdentityRequest>): RemoveExternalIdentityRequest {
    return RemoveExternalIdentityRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<RemoveExternalIdentityRequest>): RemoveExternalIdentityRequest {
    const message = createBaseRemoveExternalIdentityRequest();
    message.identity = object.identity ?? "";
    return message;
  },
};

function createBaseRemoveExternalIdentityResponse(): RemoveExternalIdentityResponse {
  return {};
}

export const RemoveExternalIdentityResponse = {
  encode(_: RemoveExternalIdentityResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveExternalIdentityResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveExternalIdentityResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): RemoveExternalIdentityResponse {
    return {};
  },

  toJSON(_: RemoveExternalIdentityResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<RemoveExternalIdentityResponse>): RemoveExternalIdentityResponse {
    return RemoveExternalIdentityResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<RemoveExternalIdentityResponse>): RemoveExternalIdentityResponse {
    const message = createBaseRemoveExternalIdentityResponse();
    return message;
  },
};

function createBaseAuthenticateInitRequest(): AuthenticateInitRequest {
  return { identity: "", provider: 0, ecosystemId: "" };
}

export const AuthenticateInitRequest = {
  encode(message: AuthenticateInitRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== undefined && message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.provider !== undefined && message.provider !== 0) {
      writer.uint32(16).int32(message.provider);
    }
    if (message.ecosystemId !== undefined && message.ecosystemId !== "") {
      writer.uint32(26).string(message.ecosystemId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AuthenticateInitRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAuthenticateInitRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identity = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.provider = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.ecosystemId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AuthenticateInitRequest {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      provider: isSet(object.provider) ? identityProviderFromJSON(object.provider) : 0,
      ecosystemId: isSet(object.ecosystemId) ? String(object.ecosystemId) : "",
    };
  },

  toJSON(message: AuthenticateInitRequest): unknown {
    const obj: any = {};
    if (message.identity !== undefined && message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.provider !== undefined && message.provider !== 0) {
      obj.provider = identityProviderToJSON(message.provider);
    }
    if (message.ecosystemId !== undefined && message.ecosystemId !== "") {
      obj.ecosystemId = message.ecosystemId;
    }
    return obj;
  },

  create(base?: DeepPartial<AuthenticateInitRequest>): AuthenticateInitRequest {
    return AuthenticateInitRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AuthenticateInitRequest>): AuthenticateInitRequest {
    const message = createBaseAuthenticateInitRequest();
    message.identity = object.identity ?? "";
    message.provider = object.provider ?? 0;
    message.ecosystemId = object.ecosystemId ?? "";
    return message;
  },
};

function createBaseAuthenticateInitResponse(): AuthenticateInitResponse {
  return { challenge: "" };
}

export const AuthenticateInitResponse = {
  encode(message: AuthenticateInitResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.challenge !== undefined && message.challenge !== "") {
      writer.uint32(10).string(message.challenge);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AuthenticateInitResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAuthenticateInitResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.challenge = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AuthenticateInitResponse {
    return { challenge: isSet(object.challenge) ? String(object.challenge) : "" };
  },

  toJSON(message: AuthenticateInitResponse): unknown {
    const obj: any = {};
    if (message.challenge !== undefined && message.challenge !== "") {
      obj.challenge = message.challenge;
    }
    return obj;
  },

  create(base?: DeepPartial<AuthenticateInitResponse>): AuthenticateInitResponse {
    return AuthenticateInitResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AuthenticateInitResponse>): AuthenticateInitResponse {
    const message = createBaseAuthenticateInitResponse();
    message.challenge = object.challenge ?? "";
    return message;
  },
};

function createBaseAuthenticateResendCodeRequest(): AuthenticateResendCodeRequest {
  return { challenge: "" };
}

export const AuthenticateResendCodeRequest = {
  encode(message: AuthenticateResendCodeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.challenge !== undefined && message.challenge !== "") {
      writer.uint32(10).string(message.challenge);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AuthenticateResendCodeRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAuthenticateResendCodeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.challenge = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AuthenticateResendCodeRequest {
    return { challenge: isSet(object.challenge) ? String(object.challenge) : "" };
  },

  toJSON(message: AuthenticateResendCodeRequest): unknown {
    const obj: any = {};
    if (message.challenge !== undefined && message.challenge !== "") {
      obj.challenge = message.challenge;
    }
    return obj;
  },

  create(base?: DeepPartial<AuthenticateResendCodeRequest>): AuthenticateResendCodeRequest {
    return AuthenticateResendCodeRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AuthenticateResendCodeRequest>): AuthenticateResendCodeRequest {
    const message = createBaseAuthenticateResendCodeRequest();
    message.challenge = object.challenge ?? "";
    return message;
  },
};

function createBaseAuthenticateResendCodeResponse(): AuthenticateResendCodeResponse {
  return {};
}

export const AuthenticateResendCodeResponse = {
  encode(_: AuthenticateResendCodeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AuthenticateResendCodeResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAuthenticateResendCodeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): AuthenticateResendCodeResponse {
    return {};
  },

  toJSON(_: AuthenticateResendCodeResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<AuthenticateResendCodeResponse>): AuthenticateResendCodeResponse {
    return AuthenticateResendCodeResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<AuthenticateResendCodeResponse>): AuthenticateResendCodeResponse {
    const message = createBaseAuthenticateResendCodeResponse();
    return message;
  },
};

function createBaseAuthenticateConfirmRequest(): AuthenticateConfirmRequest {
  return { challenge: "", response: "" };
}

export const AuthenticateConfirmRequest = {
  encode(message: AuthenticateConfirmRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.challenge !== undefined && message.challenge !== "") {
      writer.uint32(10).string(message.challenge);
    }
    if (message.response !== undefined && message.response !== "") {
      writer.uint32(18).string(message.response);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AuthenticateConfirmRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAuthenticateConfirmRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.challenge = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.response = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AuthenticateConfirmRequest {
    return {
      challenge: isSet(object.challenge) ? String(object.challenge) : "",
      response: isSet(object.response) ? String(object.response) : "",
    };
  },

  toJSON(message: AuthenticateConfirmRequest): unknown {
    const obj: any = {};
    if (message.challenge !== undefined && message.challenge !== "") {
      obj.challenge = message.challenge;
    }
    if (message.response !== undefined && message.response !== "") {
      obj.response = message.response;
    }
    return obj;
  },

  create(base?: DeepPartial<AuthenticateConfirmRequest>): AuthenticateConfirmRequest {
    return AuthenticateConfirmRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AuthenticateConfirmRequest>): AuthenticateConfirmRequest {
    const message = createBaseAuthenticateConfirmRequest();
    message.challenge = object.challenge ?? "";
    message.response = object.response ?? "";
    return message;
  },
};

function createBaseAuthenticateConfirmResponse(): AuthenticateConfirmResponse {
  return { authToken: "" };
}

export const AuthenticateConfirmResponse = {
  encode(message: AuthenticateConfirmResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined && message.authToken !== "") {
      writer.uint32(10).string(message.authToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AuthenticateConfirmResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAuthenticateConfirmResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AuthenticateConfirmResponse {
    return { authToken: isSet(object.authToken) ? String(object.authToken) : "" };
  },

  toJSON(message: AuthenticateConfirmResponse): unknown {
    const obj: any = {};
    if (message.authToken !== undefined && message.authToken !== "") {
      obj.authToken = message.authToken;
    }
    return obj;
  },

  create(base?: DeepPartial<AuthenticateConfirmResponse>): AuthenticateConfirmResponse {
    return AuthenticateConfirmResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AuthenticateConfirmResponse>): AuthenticateConfirmResponse {
    const message = createBaseAuthenticateConfirmResponse();
    message.authToken = object.authToken ?? "";
    return message;
  },
};

function createBaseListByVerificationTemplateRequest(): ListByVerificationTemplateRequest {
  return { verificationTemplateId: "", continuationToken: "" };
}

export const ListByVerificationTemplateRequest = {
  encode(message: ListByVerificationTemplateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.verificationTemplateId !== undefined && message.verificationTemplateId !== "") {
      writer.uint32(10).string(message.verificationTemplateId);
    }
    if (message.continuationToken !== undefined && message.continuationToken !== "") {
      writer.uint32(18).string(message.continuationToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListByVerificationTemplateRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListByVerificationTemplateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.verificationTemplateId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.continuationToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListByVerificationTemplateRequest {
    return {
      verificationTemplateId: isSet(object.verificationTemplateId) ? String(object.verificationTemplateId) : "",
      continuationToken: isSet(object.continuationToken) ? String(object.continuationToken) : "",
    };
  },

  toJSON(message: ListByVerificationTemplateRequest): unknown {
    const obj: any = {};
    if (message.verificationTemplateId !== undefined && message.verificationTemplateId !== "") {
      obj.verificationTemplateId = message.verificationTemplateId;
    }
    if (message.continuationToken !== undefined && message.continuationToken !== "") {
      obj.continuationToken = message.continuationToken;
    }
    return obj;
  },

  create(base?: DeepPartial<ListByVerificationTemplateRequest>): ListByVerificationTemplateRequest {
    return ListByVerificationTemplateRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListByVerificationTemplateRequest>): ListByVerificationTemplateRequest {
    const message = createBaseListByVerificationTemplateRequest();
    message.verificationTemplateId = object.verificationTemplateId ?? "";
    message.continuationToken = object.continuationToken ?? "";
    return message;
  },
};

function createBaseListByVerificationTemplateResponse(): ListByVerificationTemplateResponse {
  return { items: [], hasMoreResults: false, continuationToken: "" };
}

export const ListByVerificationTemplateResponse = {
  encode(message: ListByVerificationTemplateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.items !== undefined && message.items.length !== 0) {
      for (const v of message.items) {
        writer.uint32(10).string(v!);
      }
    }
    if (message.hasMoreResults === true) {
      writer.uint32(16).bool(message.hasMoreResults);
    }
    if (message.continuationToken !== undefined && message.continuationToken !== "") {
      writer.uint32(26).string(message.continuationToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListByVerificationTemplateResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListByVerificationTemplateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.items!.push(reader.string());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.hasMoreResults = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.continuationToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListByVerificationTemplateResponse {
    return {
      items: Array.isArray(object?.items) ? object.items.map((e: any) => String(e)) : [],
      hasMoreResults: isSet(object.hasMoreResults) ? Boolean(object.hasMoreResults) : false,
      continuationToken: isSet(object.continuationToken) ? String(object.continuationToken) : "",
    };
  },

  toJSON(message: ListByVerificationTemplateResponse): unknown {
    const obj: any = {};
    if (message.items?.length) {
      obj.items = message.items;
    }
    if (message.hasMoreResults === true) {
      obj.hasMoreResults = message.hasMoreResults;
    }
    if (message.continuationToken !== undefined && message.continuationToken !== "") {
      obj.continuationToken = message.continuationToken;
    }
    return obj;
  },

  create(base?: DeepPartial<ListByVerificationTemplateResponse>): ListByVerificationTemplateResponse {
    return ListByVerificationTemplateResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListByVerificationTemplateResponse>): ListByVerificationTemplateResponse {
    const message = createBaseListByVerificationTemplateResponse();
    message.items = object.items?.map((e) => e) || [];
    message.hasMoreResults = object.hasMoreResults ?? false;
    message.continuationToken = object.continuationToken ?? "";
    return message;
  },
};

/** Service for managing wallets */
export type UniversalWalletDefinition = typeof UniversalWalletDefinition;
export const UniversalWalletDefinition = {
  name: "UniversalWallet",
  fullName: "services.universalwallet.v1.UniversalWallet",
  methods: {
    /** Retrieve an item from the wallet with a given item identifier */
    getItem: {
      name: "GetItem",
      requestType: GetItemRequest,
      requestStream: false,
      responseType: GetItemResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              32,
              34,
              27,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              103,
              101,
              116,
              105,
              116,
              101,
              109,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Search the wallet using a SQL syntax */
    search: {
      name: "Search",
      requestType: SearchRequest,
      requestStream: false,
      responseType: SearchResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              31,
              34,
              26,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              115,
              101,
              97,
              114,
              99,
              104,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Insert an item into the wallet */
    insertItem: {
      name: "InsertItem",
      requestType: InsertItemRequest,
      requestStream: false,
      responseType: InsertItemResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              35,
              34,
              30,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              105,
              110,
              115,
              101,
              114,
              116,
              105,
              116,
              101,
              109,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Update an item in the wallet */
    updateItem: {
      name: "UpdateItem",
      requestType: UpdateItemRequest,
      requestStream: false,
      responseType: UpdateItemResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              35,
              34,
              30,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              117,
              112,
              100,
              97,
              116,
              101,
              105,
              116,
              101,
              109,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Delete an item from the wallet permanently */
    deleteItem: {
      name: "DeleteItem",
      requestType: DeleteItemRequest,
      requestStream: false,
      responseType: DeleteItemResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              35,
              34,
              30,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              100,
              101,
              108,
              101,
              116,
              101,
              105,
              116,
              101,
              109,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Delete a wallet and its credentials */
    deleteWallet: {
      name: "DeleteWallet",
      requestType: DeleteWalletRequest,
      requestStream: false,
      responseType: DeleteWalletResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              37,
              34,
              32,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              100,
              101,
              108,
              101,
              116,
              101,
              119,
              97,
              108,
              108,
              101,
              116,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Create a new wallet and generate an auth token for access */
    createWallet: {
      name: "CreateWallet",
      requestType: CreateWalletRequest,
      requestStream: false,
      responseType: CreateWalletResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              37,
              34,
              32,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              99,
              114,
              101,
              97,
              116,
              101,
              119,
              97,
              108,
              108,
              101,
              116,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Retrieve wallet details and configuration */
    getWalletInfo: {
      name: "GetWalletInfo",
      requestType: GetWalletInfoRequest,
      requestStream: false,
      responseType: GetWalletInfoResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              38,
              34,
              33,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              103,
              101,
              116,
              119,
              97,
              108,
              108,
              101,
              116,
              105,
              110,
              102,
              111,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Retrieve wallet details and configuration about the currently authenticated wallet */
    getMyInfo: {
      name: "GetMyInfo",
      requestType: GetMyInfoRequest,
      requestStream: false,
      responseType: GetMyInfoResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          480010: [new Uint8Array([2, 24, 1])],
          578365826: [
            new Uint8Array([
              34,
              34,
              29,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              103,
              101,
              116,
              109,
              121,
              105,
              110,
              102,
              111,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Retrieve information from an ecosystem wallet by searching for its external identity (email or phone) */
    getWalletFromExternalIdentity: {
      name: "GetWalletFromExternalIdentity",
      requestType: GetWalletFromExternalIdentityRequest,
      requestStream: false,
      responseType: GetWalletFromExternalIdentityResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              54,
              34,
              49,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              103,
              101,
              116,
              119,
              97,
              108,
              108,
              101,
              116,
              102,
              114,
              111,
              109,
              101,
              120,
              116,
              101,
              114,
              110,
              97,
              108,
              105,
              100,
              101,
              110,
              116,
              105,
              116,
              121,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /**
     * Generate new token for a given wallet and add it to the collection of known auth tokens.
     * This endpoint requires authentication and will return a new token ID and auth token.
     * Use this endpoint if you want to authorize another device, without having to share your
     * existing auth token.
     */
    generateAuthToken: {
      name: "GenerateAuthToken",
      requestType: GenerateAuthTokenRequest,
      requestStream: false,
      responseType: GenerateAuthTokenResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              42,
              34,
              37,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              103,
              101,
              110,
              101,
              114,
              97,
              116,
              101,
              97,
              117,
              116,
              104,
              116,
              111,
              107,
              101,
              110,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /**
     * Revokes a previously issued auth token and updates the collection of known auth tokens.
     * This endpoint requires authentication.
     */
    revokeAuthToken: {
      name: "RevokeAuthToken",
      requestType: RevokeAuthTokenRequest,
      requestStream: false,
      responseType: RevokeAuthTokenResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              40,
              34,
              35,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              114,
              101,
              118,
              111,
              107,
              101,
              97,
              117,
              116,
              104,
              116,
              111,
              107,
              101,
              110,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /**
     * Add new external identity to the current wallet, such as email, sms, ethereum address, etc.
     * This identity ownership must be confirmed using `AddIdentityConfirm` via OTP, signature, etc.
     */
    addExternalIdentityInit: {
      name: "AddExternalIdentityInit",
      requestType: AddExternalIdentityInitRequest,
      requestStream: false,
      responseType: AddExternalIdentityInitResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              48,
              34,
              43,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              97,
              100,
              100,
              101,
              120,
              116,
              101,
              114,
              110,
              97,
              108,
              105,
              100,
              101,
              110,
              116,
              105,
              116,
              121,
              105,
              110,
              105,
              116,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Confirm identity added to the current wallet using `AddExternalIdentityInit` */
    addExternalIdentityConfirm: {
      name: "AddExternalIdentityConfirm",
      requestType: AddExternalIdentityConfirmRequest,
      requestStream: false,
      responseType: AddExternalIdentityConfirmResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              51,
              34,
              46,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              97,
              100,
              100,
              101,
              120,
              116,
              101,
              114,
              110,
              97,
              108,
              105,
              100,
              101,
              110,
              116,
              105,
              116,
              121,
              99,
              111,
              110,
              102,
              105,
              114,
              109,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Remove an external identity from the current wallet */
    removeExternalIdentity: {
      name: "RemoveExternalIdentity",
      requestType: RemoveExternalIdentityRequest,
      requestStream: false,
      responseType: RemoveExternalIdentityResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              47,
              34,
              42,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              114,
              101,
              109,
              111,
              118,
              101,
              101,
              120,
              116,
              101,
              114,
              110,
              97,
              108,
              105,
              100,
              101,
              110,
              116,
              105,
              116,
              121,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /**
     * Sign-in to an already existing wallet, using an identity added that was previously registered
     * This endpoint does not require authentication, and will return a challenge to be signed or verified
     */
    authenticateInit: {
      name: "AuthenticateInit",
      requestType: AuthenticateInitRequest,
      requestStream: false,
      responseType: AuthenticateInitResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              41,
              34,
              36,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              97,
              117,
              116,
              104,
              101,
              110,
              116,
              105,
              99,
              97,
              116,
              101,
              105,
              110,
              105,
              116,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Confirm sign-in to an already existing wallet and return authentication token */
    authenticateConfirm: {
      name: "AuthenticateConfirm",
      requestType: AuthenticateConfirmRequest,
      requestStream: false,
      responseType: AuthenticateConfirmResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              44,
              34,
              39,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              97,
              117,
              116,
              104,
              101,
              110,
              116,
              105,
              99,
              97,
              116,
              101,
              99,
              111,
              110,
              102,
              105,
              114,
              109,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Resend previous authentication code */
    authenticateResendCode: {
      name: "AuthenticateResendCode",
      requestType: AuthenticateResendCodeRequest,
      requestStream: false,
      responseType: AuthenticateResendCodeResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              47,
              34,
              42,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              97,
              117,
              116,
              104,
              101,
              110,
              116,
              105,
              99,
              97,
              116,
              101,
              114,
              101,
              115,
              101,
              110,
              100,
              99,
              111,
              100,
              101,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** List all wallets in the ecosystem */
    listWallets: {
      name: "ListWallets",
      requestType: ListWalletsRequest,
      requestStream: false,
      responseType: ListWalletsResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              36,
              34,
              31,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              108,
              105,
              115,
              116,
              119,
              97,
              108,
              108,
              101,
              116,
              115,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** List credentials which match a given verification template */
    listByVerificationTemplate: {
      name: "ListByVerificationTemplate",
      requestType: ListByVerificationTemplateRequest,
      requestStream: false,
      responseType: ListByVerificationTemplateResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              51,
              34,
              46,
              47,
              118,
              49,
              47,
              117,
              110,
              105,
              118,
              101,
              114,
              115,
              97,
              108,
              119,
              97,
              108,
              108,
              101,
              116,
              47,
              108,
              105,
              115,
              116,
              98,
              121,
              118,
              101,
              114,
              105,
              102,
              105,
              99,
              97,
              116,
              105,
              111,
              110,
              116,
              101,
              109,
              112,
              108,
              97,
              116,
              101,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
  },
} as const;

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
