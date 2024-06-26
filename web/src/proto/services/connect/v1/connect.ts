/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { OrderDirection, orderDirectionFromJSON, orderDirectionToJSON } from "../../common/v1/common";
import { CreateWalletRequest_ExternalIdentity } from "../../universal-wallet/v1/universal-wallet";

/** The type of verification to perform */
export enum VerificationType {
  /** GOVERNMENT_ID - Government-issued ID (driver's license, passport, etc) */
  GOVERNMENT_ID = 0,
  UNRECOGNIZED = -1,
}

export function verificationTypeFromJSON(object: any): VerificationType {
  switch (object) {
    case 0:
    case "GOVERNMENT_ID":
      return VerificationType.GOVERNMENT_ID;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VerificationType.UNRECOGNIZED;
  }
}

export function verificationTypeToJSON(object: VerificationType): string {
  switch (object) {
    case VerificationType.GOVERNMENT_ID:
      return "GOVERNMENT_ID";
    case VerificationType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** The states a VerificationSession can be in */
export enum IDVSessionState {
  /** IDV_CREATED - Session has been created, but not yet shown to user */
  IDV_CREATED = 0,
  /**
   * IDV_INITIATED - Session has been shown to user (iframe / popup opened), but
   * user has not yet logged in.
   */
  IDV_INITIATED = 1,
  /** IDV_AUTHENTICATING - User has entered their phone number, but not yet authenticated with the code sent via SMS */
  IDV_AUTHENTICATING = 2,
  /** IDV_IN_PROGRESS - User has been authenticated and is performing identity verification */
  IDV_IN_PROGRESS = 3,
  /** IDV_SUCCESS - Session was completed successfully and IDV data is available to RP */
  IDV_SUCCESS = 4,
  /** IDV_FAILED - The session failed; reason is present in `fail_code`. */
  IDV_FAILED = 5,
  UNRECOGNIZED = -1,
}

export function iDVSessionStateFromJSON(object: any): IDVSessionState {
  switch (object) {
    case 0:
    case "IDV_CREATED":
      return IDVSessionState.IDV_CREATED;
    case 1:
    case "IDV_INITIATED":
      return IDVSessionState.IDV_INITIATED;
    case 2:
    case "IDV_AUTHENTICATING":
      return IDVSessionState.IDV_AUTHENTICATING;
    case 3:
    case "IDV_IN_PROGRESS":
      return IDVSessionState.IDV_IN_PROGRESS;
    case 4:
    case "IDV_SUCCESS":
      return IDVSessionState.IDV_SUCCESS;
    case 5:
    case "IDV_FAILED":
      return IDVSessionState.IDV_FAILED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return IDVSessionState.UNRECOGNIZED;
  }
}

export function iDVSessionStateToJSON(object: IDVSessionState): string {
  switch (object) {
    case IDVSessionState.IDV_CREATED:
      return "IDV_CREATED";
    case IDVSessionState.IDV_INITIATED:
      return "IDV_INITIATED";
    case IDVSessionState.IDV_AUTHENTICATING:
      return "IDV_AUTHENTICATING";
    case IDVSessionState.IDV_IN_PROGRESS:
      return "IDV_IN_PROGRESS";
    case IDVSessionState.IDV_SUCCESS:
      return "IDV_SUCCESS";
    case IDVSessionState.IDV_FAILED:
      return "IDV_FAILED";
    case IDVSessionState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** The states an individual Verification can be in */
export enum VerificationState {
  /** VERIFICATION_PENDING - This verification has not yet been performed in the flow */
  VERIFICATION_PENDING = 0,
  /** VERIFICATION_SUCCESS - This verification has been successfully completed */
  VERIFICATION_SUCCESS = 3,
  /** VERIFICATION_FAILED - This verification has failed */
  VERIFICATION_FAILED = 4,
  UNRECOGNIZED = -1,
}

export function verificationStateFromJSON(object: any): VerificationState {
  switch (object) {
    case 0:
    case "VERIFICATION_PENDING":
      return VerificationState.VERIFICATION_PENDING;
    case 3:
    case "VERIFICATION_SUCCESS":
      return VerificationState.VERIFICATION_SUCCESS;
    case 4:
    case "VERIFICATION_FAILED":
      return VerificationState.VERIFICATION_FAILED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VerificationState.UNRECOGNIZED;
  }
}

export function verificationStateToJSON(object: VerificationState): string {
  switch (object) {
    case VerificationState.VERIFICATION_PENDING:
      return "VERIFICATION_PENDING";
    case VerificationState.VERIFICATION_SUCCESS:
      return "VERIFICATION_SUCCESS";
    case VerificationState.VERIFICATION_FAILED:
      return "VERIFICATION_FAILED";
    case VerificationState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** The specific reason an IDVSession is in the `Failed` state */
export enum SessionFailCode {
  /** SESSION_FAIL_NONE - The Session is not in a failure state. */
  SESSION_FAIL_NONE = 0,
  /** SESSION_FAIL_INTERNAL - An internal Trinsic error caused this session to fail */
  SESSION_FAIL_INTERNAL = 1,
  /**
   * SESSION_FAIL_VERIFICATION_FAILED - The session failed because one or more of the verifications failed.
   * The reason for the failure is present in the `fail_reason` field of the relevant `Verification` object(s).
   */
  SESSION_FAIL_VERIFICATION_FAILED = 2,
  /** SESSION_FAIL_AUTHENTICATION - The session failed because the user failed to authenticate with their phone number too many times. */
  SESSION_FAIL_AUTHENTICATION = 3,
  /** SESSION_FAIL_EXPIRED - The session expired */
  SESSION_FAIL_EXPIRED = 4,
  /** SESSION_FAIL_USER_CANCELED - The user canceled / rejected the session */
  SESSION_FAIL_USER_CANCELED = 5,
  /** SESSION_FAIL_RP_CANCELED - The RP canceled the session */
  SESSION_FAIL_RP_CANCELED = 6,
  UNRECOGNIZED = -1,
}

export function sessionFailCodeFromJSON(object: any): SessionFailCode {
  switch (object) {
    case 0:
    case "SESSION_FAIL_NONE":
      return SessionFailCode.SESSION_FAIL_NONE;
    case 1:
    case "SESSION_FAIL_INTERNAL":
      return SessionFailCode.SESSION_FAIL_INTERNAL;
    case 2:
    case "SESSION_FAIL_VERIFICATION_FAILED":
      return SessionFailCode.SESSION_FAIL_VERIFICATION_FAILED;
    case 3:
    case "SESSION_FAIL_AUTHENTICATION":
      return SessionFailCode.SESSION_FAIL_AUTHENTICATION;
    case 4:
    case "SESSION_FAIL_EXPIRED":
      return SessionFailCode.SESSION_FAIL_EXPIRED;
    case 5:
    case "SESSION_FAIL_USER_CANCELED":
      return SessionFailCode.SESSION_FAIL_USER_CANCELED;
    case 6:
    case "SESSION_FAIL_RP_CANCELED":
      return SessionFailCode.SESSION_FAIL_RP_CANCELED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SessionFailCode.UNRECOGNIZED;
  }
}

export function sessionFailCodeToJSON(object: SessionFailCode): string {
  switch (object) {
    case SessionFailCode.SESSION_FAIL_NONE:
      return "SESSION_FAIL_NONE";
    case SessionFailCode.SESSION_FAIL_INTERNAL:
      return "SESSION_FAIL_INTERNAL";
    case SessionFailCode.SESSION_FAIL_VERIFICATION_FAILED:
      return "SESSION_FAIL_VERIFICATION_FAILED";
    case SessionFailCode.SESSION_FAIL_AUTHENTICATION:
      return "SESSION_FAIL_AUTHENTICATION";
    case SessionFailCode.SESSION_FAIL_EXPIRED:
      return "SESSION_FAIL_EXPIRED";
    case SessionFailCode.SESSION_FAIL_USER_CANCELED:
      return "SESSION_FAIL_USER_CANCELED";
    case SessionFailCode.SESSION_FAIL_RP_CANCELED:
      return "SESSION_FAIL_RP_CANCELED";
    case SessionFailCode.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** The specific reason a Verification is in the `Failed` state */
export enum VerificationFailCode {
  /** VERIFICATION_FAIL_NONE - The verification is not in a failure state */
  VERIFICATION_FAIL_NONE = 0,
  /** VERIFICATION_FAIL_INTERNAL - An internal Trinsic error caused this verification to fail */
  VERIFICATION_FAIL_INTERNAL = 1,
  /**
   * VERIFICATION_FAIL_INVALID_IMAGE - The image(s) provided for this verification were either too low-quality, not of the correct type, or otherwise
   * unable to be processed.
   * This failure reason is non-terminal; the user is able to retry the verification.
   */
  VERIFICATION_FAIL_INVALID_IMAGE = 2,
  /** VERIFICATION_FAIL_INAUTHENTIC - The identity data/images provided are suspected to be inauthentic, fraudulent, or forged. */
  VERIFICATION_FAIL_INAUTHENTIC = 3,
  /** VERIFICATION_FAIL_UNSUPPORTED_DOCUMENT - The document provided is either of an unsupported type, or from an unsupported country. */
  VERIFICATION_FAIL_UNSUPPORTED_DOCUMENT = 4,
  UNRECOGNIZED = -1,
}

export function verificationFailCodeFromJSON(object: any): VerificationFailCode {
  switch (object) {
    case 0:
    case "VERIFICATION_FAIL_NONE":
      return VerificationFailCode.VERIFICATION_FAIL_NONE;
    case 1:
    case "VERIFICATION_FAIL_INTERNAL":
      return VerificationFailCode.VERIFICATION_FAIL_INTERNAL;
    case 2:
    case "VERIFICATION_FAIL_INVALID_IMAGE":
      return VerificationFailCode.VERIFICATION_FAIL_INVALID_IMAGE;
    case 3:
    case "VERIFICATION_FAIL_INAUTHENTIC":
      return VerificationFailCode.VERIFICATION_FAIL_INAUTHENTIC;
    case 4:
    case "VERIFICATION_FAIL_UNSUPPORTED_DOCUMENT":
      return VerificationFailCode.VERIFICATION_FAIL_UNSUPPORTED_DOCUMENT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VerificationFailCode.UNRECOGNIZED;
  }
}

export function verificationFailCodeToJSON(object: VerificationFailCode): string {
  switch (object) {
    case VerificationFailCode.VERIFICATION_FAIL_NONE:
      return "VERIFICATION_FAIL_NONE";
    case VerificationFailCode.VERIFICATION_FAIL_INTERNAL:
      return "VERIFICATION_FAIL_INTERNAL";
    case VerificationFailCode.VERIFICATION_FAIL_INVALID_IMAGE:
      return "VERIFICATION_FAIL_INVALID_IMAGE";
    case VerificationFailCode.VERIFICATION_FAIL_INAUTHENTIC:
      return "VERIFICATION_FAIL_INAUTHENTIC";
    case VerificationFailCode.VERIFICATION_FAIL_UNSUPPORTED_DOCUMENT:
      return "VERIFICATION_FAIL_UNSUPPORTED_DOCUMENT";
    case VerificationFailCode.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Controls how sessions are ordered in `ListSessions` */
export enum SessionOrdering {
  /** CREATED - Order sessions according to when they were created */
  CREATED = 0,
  /** UPDATED - Order sessions according to when they last changed state */
  UPDATED = 1,
  /** STATE - Order sessions according to their numerical state */
  STATE = 2,
  UNRECOGNIZED = -1,
}

export function sessionOrderingFromJSON(object: any): SessionOrdering {
  switch (object) {
    case 0:
    case "CREATED":
      return SessionOrdering.CREATED;
    case 1:
    case "UPDATED":
      return SessionOrdering.UPDATED;
    case 2:
    case "STATE":
      return SessionOrdering.STATE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SessionOrdering.UNRECOGNIZED;
  }
}

export function sessionOrderingToJSON(object: SessionOrdering): string {
  switch (object) {
    case SessionOrdering.CREATED:
      return "CREATED";
    case SessionOrdering.UPDATED:
      return "UPDATED";
    case SessionOrdering.STATE:
      return "STATE";
    case SessionOrdering.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** An Identity Verification Session */
export interface IDVSession {
  /** The ID of the IDVSession. */
  id?:
    | string
    | undefined;
  /**
   * The Client Token for this IDVSession. This should be passed to your frontend to initiate
   * the IDV flow using Trinsic's Web SDK.
   */
  clientToken?:
    | string
    | undefined;
  /** State of the IDVSession */
  state?:
    | IDVSessionState
    | undefined;
  /** The actual Verifications to perform in this IDV flow */
  verifications?:
    | { [key: string]: Verification }
    | undefined;
  /**
   * The reason for the IDVSession's failure.
   * Only set if `state` is `IDV_FAILED`.
   */
  failCode?:
    | SessionFailCode
    | undefined;
  /** The resultant signed VP combining the results of all verifications */
  resultVp?:
    | string
    | undefined;
  /** The unix timestamp, in seconds, that this IDVSession was created */
  created?:
    | number
    | undefined;
  /** The unix timestamp, in seconds, that this IDVSession's `state` was last updated */
  updated?: number | undefined;
}

export interface IDVSession_VerificationsEntry {
  key: string;
  value?: Verification | undefined;
}

/** A Verification that is part of an IDVSession */
export interface Verification {
  /** The ID of the verification */
  id?:
    | string
    | undefined;
  /** The type of verification (driver's license, passport, proof of address, etc) */
  type?:
    | VerificationType
    | undefined;
  /** The state of the verification */
  state?:
    | VerificationState
    | undefined;
  /**
   * The reason for the Verification's failure.
   * Only set if `state` is `VERIFICATION_FAILED`.
   */
  failCode?:
    | VerificationFailCode
    | undefined;
  /**
   * Whether this was a reused (true) or fresh (false) verification.
   * If `state` is not `VERIFICATION_SUCCESS`, this field is `false` and does not convey useful information.
   */
  reused?:
    | boolean
    | undefined;
  /**
   * The unix timestamp, in seconds, when this verification last changed state -- or `0` if it has not yet
   * begun.
   */
  updated?:
    | number
    | undefined;
  /**
   * The Government ID options for this Verification.
   * Only set if this Verification is of type `GOVERNMENT_ID`.
   */
  governmentIdOptions?:
    | GovernmentIDOptions
    | undefined;
  /**
   * Normalized output for manual parsing and usage for this verification
   * Only set if this Verification is of type `GOVERNMENT_ID` and has succeeded.
   */
  normalizedGovernmentIdData?: NormalizedGovernmentIdData | undefined;
}

export interface NormalizedGovernmentIdData {
  /** The ID number of the underlying identity document */
  idNumber?:
    | string
    | undefined;
  /** Given ("first") name of the document holder */
  givenName?:
    | string
    | undefined;
  /** Family ("last") name of the document holder */
  familyName?:
    | string
    | undefined;
  /** Full address of the document holder */
  address?:
    | string
    | undefined;
  /** Date of birth of the document holder */
  dateOfBirth?:
    | string
    | undefined;
  /** ISO3 country code of the document */
  country?:
    | string
    | undefined;
  /** Issuance date of the document */
  issueDate?:
    | string
    | undefined;
  /** Expiration date date of the document */
  expirationDate?: string | undefined;
}

/** Information about a Relying Party used for demo purposes */
export interface DemoRelyingParty {
  displayName?: string | undefined;
  logoUrl?: string | undefined;
  primaryColor?: string | undefined;
}

/** Request to create an Identity Verification Session */
export interface CreateSessionRequest {
  /** Array of verifications to perform */
  verifications?:
    | RequestedVerification[]
    | undefined;
  /** Debugging information used to help diagnose issues */
  debugInformation?:
    | { [key: string]: string }
    | undefined;
  /**
   * Information about the Relying Party used for demo purposes.
   * This is only to be used if the demo flag is set to true in the debug information.
   */
  demoRp?: DemoRelyingParty | undefined;
}

export interface CreateSessionRequest_DebugInformationEntry {
  key: string;
  value: string;
}

/** A verification to perform in an IDV flow */
export interface RequestedVerification {
  /** The type of verification to perform */
  type?:
    | VerificationType
    | undefined;
  /** Options for a Verification of type `GOVERNMENT_ID` */
  governmentIdOptions?: GovernmentIDOptions | undefined;
}

/** Options for a Verification of type `GOVERNMENT_ID` */
export interface GovernmentIDOptions {
  /**
   * The fields to retrieve from the Government ID.
   * If this object is not set, all fields will be retrieved.
   */
  fields?: GovernmentIDFields | undefined;
}

/** Selection of fields to retrieve from a Government ID. All fields default to `false` unless explicitly set to `true`. */
export interface GovernmentIDFields {
  /** ID number of the underlying identity document */
  idNumber?:
    | boolean
    | undefined;
  /** Given ("first") name of the document holder */
  givenName?:
    | boolean
    | undefined;
  /** Family ("last") name of the document holder */
  familyName?:
    | boolean
    | undefined;
  /** Full address of the document holder */
  address?:
    | boolean
    | undefined;
  /** Date of birth of the document holder */
  dateOfBirth?:
    | boolean
    | undefined;
  /** ISO3 country code of the document */
  country?:
    | boolean
    | undefined;
  /** Issuance date of the document */
  issueDate?:
    | boolean
    | undefined;
  /** Expiration date date of the document */
  expirationDate?: boolean | undefined;
}

/** Response to `CreateIDVSessionRequest` */
export interface CreateSessionResponse {
  /** The created IDVSession */
  session?: IDVSession | undefined;
}

/** Request to cancel an Identity Verification Session */
export interface CancelSessionRequest {
  /** The ID of the IDVSession to cancel */
  idvSessionId?: string | undefined;
}

/** Response to `CancelIDVSessionRequest` */
export interface CancelSessionResponse {
  /** The IDVSession in its current state after cancellation */
  session?: IDVSession | undefined;
}

/** Request to get an IDVSession */
export interface GetSessionRequest {
  /** The ID of the IDVSession to get */
  idvSessionId?: string | undefined;
}

/** Response to `GetIDVSessionRequest` */
export interface GetSessionResponse {
  /** The IDVSession */
  session?: IDVSession | undefined;
}

/** Request to list all IDVSessions you've created */
export interface ListSessionsRequest {
  /** The field by which sessions should be sorted. Defaults to `CREATED`. */
  orderBy?:
    | SessionOrdering
    | undefined;
  /** The order in which sessions should be sorted. Defaults to `ASCENDING`. */
  orderDirection?:
    | OrderDirection
    | undefined;
  /**
   * The number of results to return per page.
   * Must be between `1` and `10`, inclusive.
   * Defaults to `10`.
   */
  pageSize?:
    | number
    | undefined;
  /**
   * The page index of results to return.
   * Starts at `1`.
   * Defaults to `1`.
   */
  page?: number | undefined;
}

/** Response to `ListIDVSessionsRequest` */
export interface ListSessionsResponse {
  /** The sessions you've created */
  sessions?:
    | IDVSession[]
    | undefined;
  /** The total number of sessions you've created */
  total?:
    | number
    | undefined;
  /**
   * If `true`, this is not the last page of results.
   * If `false`, this is the last page of results.
   */
  more?: boolean | undefined;
}

/** Request to preemptively check if an identity has a valid reusable credential */
export interface HasValidCredentialRequest {
  /** The identity used to find a credential */
  identity?:
    | CreateWalletRequest_ExternalIdentity
    | undefined;
  /** The criteria used to find a valid credential */
  credentialRequestData?: CredentialRequestData | undefined;
}

/** Response to `HasValidCredentialRequest` */
export interface HasValidCredentialResponse {
  /** Whether the identity has a valid credential */
  hasValidCredential?: boolean | undefined;
}

export interface CredentialRequestData {
  /** The type of verification for which the credential can be used */
  type?: VerificationType | undefined;
}

function createBaseIDVSession(): IDVSession {
  return {
    id: "",
    clientToken: "",
    state: 0,
    verifications: {},
    failCode: undefined,
    resultVp: undefined,
    created: 0,
    updated: 0,
  };
}

export const IDVSession = {
  encode(message: IDVSession, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.clientToken !== undefined && message.clientToken !== "") {
      writer.uint32(18).string(message.clientToken);
    }
    if (message.state !== undefined && message.state !== 0) {
      writer.uint32(24).int32(message.state);
    }
    Object.entries(message.verifications || {}).forEach(([key, value]) => {
      IDVSession_VerificationsEntry.encode({ key: key as any, value }, writer.uint32(34).fork()).ldelim();
    });
    if (message.failCode !== undefined) {
      writer.uint32(40).int32(message.failCode);
    }
    if (message.resultVp !== undefined) {
      writer.uint32(50).string(message.resultVp);
    }
    if (message.created !== undefined && message.created !== 0) {
      writer.uint32(57).fixed64(message.created);
    }
    if (message.updated !== undefined && message.updated !== 0) {
      writer.uint32(65).fixed64(message.updated);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IDVSession {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIDVSession();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.clientToken = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          const entry4 = IDVSession_VerificationsEntry.decode(reader, reader.uint32());
          if (entry4.value !== undefined) {
            message.verifications![entry4.key] = entry4.value;
          }
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.failCode = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.resultVp = reader.string();
          continue;
        case 7:
          if (tag !== 57) {
            break;
          }

          message.created = longToNumber(reader.fixed64() as Long);
          continue;
        case 8:
          if (tag !== 65) {
            break;
          }

          message.updated = longToNumber(reader.fixed64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IDVSession {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      clientToken: isSet(object.clientToken) ? String(object.clientToken) : "",
      state: isSet(object.state) ? iDVSessionStateFromJSON(object.state) : 0,
      verifications: isObject(object.verifications)
        ? Object.entries(object.verifications).reduce<{ [key: string]: Verification }>((acc, [key, value]) => {
          acc[key] = Verification.fromJSON(value);
          return acc;
        }, {})
        : {},
      failCode: isSet(object.failCode) ? sessionFailCodeFromJSON(object.failCode) : undefined,
      resultVp: isSet(object.resultVp) ? String(object.resultVp) : undefined,
      created: isSet(object.created) ? Number(object.created) : 0,
      updated: isSet(object.updated) ? Number(object.updated) : 0,
    };
  },

  toJSON(message: IDVSession): unknown {
    const obj: any = {};
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.clientToken !== undefined && message.clientToken !== "") {
      obj.clientToken = message.clientToken;
    }
    if (message.state !== undefined && message.state !== 0) {
      obj.state = iDVSessionStateToJSON(message.state);
    }
    if (message.verifications) {
      const entries = Object.entries(message.verifications);
      if (entries.length > 0) {
        obj.verifications = {};
        entries.forEach(([k, v]) => {
          obj.verifications[k] = Verification.toJSON(v);
        });
      }
    }
    if (message.failCode !== undefined) {
      obj.failCode = sessionFailCodeToJSON(message.failCode);
    }
    if (message.resultVp !== undefined) {
      obj.resultVp = message.resultVp;
    }
    if (message.created !== undefined && message.created !== 0) {
      obj.created = Math.round(message.created);
    }
    if (message.updated !== undefined && message.updated !== 0) {
      obj.updated = Math.round(message.updated);
    }
    return obj;
  },

  create(base?: DeepPartial<IDVSession>): IDVSession {
    return IDVSession.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<IDVSession>): IDVSession {
    const message = createBaseIDVSession();
    message.id = object.id ?? "";
    message.clientToken = object.clientToken ?? "";
    message.state = object.state ?? 0;
    message.verifications = Object.entries(object.verifications ?? {}).reduce<{ [key: string]: Verification }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = Verification.fromPartial(value);
        }
        return acc;
      },
      {},
    );
    message.failCode = object.failCode ?? undefined;
    message.resultVp = object.resultVp ?? undefined;
    message.created = object.created ?? 0;
    message.updated = object.updated ?? 0;
    return message;
  },
};

function createBaseIDVSession_VerificationsEntry(): IDVSession_VerificationsEntry {
  return { key: "", value: undefined };
}

export const IDVSession_VerificationsEntry = {
  encode(message: IDVSession_VerificationsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Verification.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IDVSession_VerificationsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIDVSession_VerificationsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = Verification.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IDVSession_VerificationsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? Verification.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: IDVSession_VerificationsEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = Verification.toJSON(message.value);
    }
    return obj;
  },

  create(base?: DeepPartial<IDVSession_VerificationsEntry>): IDVSession_VerificationsEntry {
    return IDVSession_VerificationsEntry.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<IDVSession_VerificationsEntry>): IDVSession_VerificationsEntry {
    const message = createBaseIDVSession_VerificationsEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? Verification.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseVerification(): Verification {
  return {
    id: "",
    type: 0,
    state: 0,
    failCode: undefined,
    reused: false,
    updated: 0,
    governmentIdOptions: undefined,
    normalizedGovernmentIdData: undefined,
  };
}

export const Verification = {
  encode(message: Verification, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.type !== undefined && message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.state !== undefined && message.state !== 0) {
      writer.uint32(24).int32(message.state);
    }
    if (message.failCode !== undefined) {
      writer.uint32(32).int32(message.failCode);
    }
    if (message.reused === true) {
      writer.uint32(40).bool(message.reused);
    }
    if (message.updated !== undefined && message.updated !== 0) {
      writer.uint32(57).fixed64(message.updated);
    }
    if (message.governmentIdOptions !== undefined) {
      GovernmentIDOptions.encode(message.governmentIdOptions, writer.uint32(66).fork()).ldelim();
    }
    if (message.normalizedGovernmentIdData !== undefined) {
      NormalizedGovernmentIdData.encode(message.normalizedGovernmentIdData, writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Verification {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerification();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.failCode = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.reused = reader.bool();
          continue;
        case 7:
          if (tag !== 57) {
            break;
          }

          message.updated = longToNumber(reader.fixed64() as Long);
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.governmentIdOptions = GovernmentIDOptions.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.normalizedGovernmentIdData = NormalizedGovernmentIdData.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Verification {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      type: isSet(object.type) ? verificationTypeFromJSON(object.type) : 0,
      state: isSet(object.state) ? verificationStateFromJSON(object.state) : 0,
      failCode: isSet(object.failCode) ? verificationFailCodeFromJSON(object.failCode) : undefined,
      reused: isSet(object.reused) ? Boolean(object.reused) : false,
      updated: isSet(object.updated) ? Number(object.updated) : 0,
      governmentIdOptions: isSet(object.governmentIdOptions)
        ? GovernmentIDOptions.fromJSON(object.governmentIdOptions)
        : undefined,
      normalizedGovernmentIdData: isSet(object.normalizedGovernmentIdData)
        ? NormalizedGovernmentIdData.fromJSON(object.normalizedGovernmentIdData)
        : undefined,
    };
  },

  toJSON(message: Verification): unknown {
    const obj: any = {};
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.type !== undefined && message.type !== 0) {
      obj.type = verificationTypeToJSON(message.type);
    }
    if (message.state !== undefined && message.state !== 0) {
      obj.state = verificationStateToJSON(message.state);
    }
    if (message.failCode !== undefined) {
      obj.failCode = verificationFailCodeToJSON(message.failCode);
    }
    if (message.reused === true) {
      obj.reused = message.reused;
    }
    if (message.updated !== undefined && message.updated !== 0) {
      obj.updated = Math.round(message.updated);
    }
    if (message.governmentIdOptions !== undefined) {
      obj.governmentIdOptions = GovernmentIDOptions.toJSON(message.governmentIdOptions);
    }
    if (message.normalizedGovernmentIdData !== undefined) {
      obj.normalizedGovernmentIdData = NormalizedGovernmentIdData.toJSON(message.normalizedGovernmentIdData);
    }
    return obj;
  },

  create(base?: DeepPartial<Verification>): Verification {
    return Verification.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Verification>): Verification {
    const message = createBaseVerification();
    message.id = object.id ?? "";
    message.type = object.type ?? 0;
    message.state = object.state ?? 0;
    message.failCode = object.failCode ?? undefined;
    message.reused = object.reused ?? false;
    message.updated = object.updated ?? 0;
    message.governmentIdOptions = (object.governmentIdOptions !== undefined && object.governmentIdOptions !== null)
      ? GovernmentIDOptions.fromPartial(object.governmentIdOptions)
      : undefined;
    message.normalizedGovernmentIdData =
      (object.normalizedGovernmentIdData !== undefined && object.normalizedGovernmentIdData !== null)
        ? NormalizedGovernmentIdData.fromPartial(object.normalizedGovernmentIdData)
        : undefined;
    return message;
  },
};

function createBaseNormalizedGovernmentIdData(): NormalizedGovernmentIdData {
  return {
    idNumber: undefined,
    givenName: undefined,
    familyName: undefined,
    address: undefined,
    dateOfBirth: undefined,
    country: undefined,
    issueDate: undefined,
    expirationDate: undefined,
  };
}

export const NormalizedGovernmentIdData = {
  encode(message: NormalizedGovernmentIdData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.idNumber !== undefined) {
      writer.uint32(10).string(message.idNumber);
    }
    if (message.givenName !== undefined) {
      writer.uint32(18).string(message.givenName);
    }
    if (message.familyName !== undefined) {
      writer.uint32(26).string(message.familyName);
    }
    if (message.address !== undefined) {
      writer.uint32(34).string(message.address);
    }
    if (message.dateOfBirth !== undefined) {
      writer.uint32(42).string(message.dateOfBirth);
    }
    if (message.country !== undefined) {
      writer.uint32(50).string(message.country);
    }
    if (message.issueDate !== undefined) {
      writer.uint32(58).string(message.issueDate);
    }
    if (message.expirationDate !== undefined) {
      writer.uint32(66).string(message.expirationDate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NormalizedGovernmentIdData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNormalizedGovernmentIdData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.idNumber = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.givenName = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.familyName = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.address = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.dateOfBirth = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.country = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.issueDate = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.expirationDate = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): NormalizedGovernmentIdData {
    return {
      idNumber: isSet(object.idNumber) ? String(object.idNumber) : undefined,
      givenName: isSet(object.givenName) ? String(object.givenName) : undefined,
      familyName: isSet(object.familyName) ? String(object.familyName) : undefined,
      address: isSet(object.address) ? String(object.address) : undefined,
      dateOfBirth: isSet(object.dateOfBirth) ? String(object.dateOfBirth) : undefined,
      country: isSet(object.country) ? String(object.country) : undefined,
      issueDate: isSet(object.issueDate) ? String(object.issueDate) : undefined,
      expirationDate: isSet(object.expirationDate) ? String(object.expirationDate) : undefined,
    };
  },

  toJSON(message: NormalizedGovernmentIdData): unknown {
    const obj: any = {};
    if (message.idNumber !== undefined) {
      obj.idNumber = message.idNumber;
    }
    if (message.givenName !== undefined) {
      obj.givenName = message.givenName;
    }
    if (message.familyName !== undefined) {
      obj.familyName = message.familyName;
    }
    if (message.address !== undefined) {
      obj.address = message.address;
    }
    if (message.dateOfBirth !== undefined) {
      obj.dateOfBirth = message.dateOfBirth;
    }
    if (message.country !== undefined) {
      obj.country = message.country;
    }
    if (message.issueDate !== undefined) {
      obj.issueDate = message.issueDate;
    }
    if (message.expirationDate !== undefined) {
      obj.expirationDate = message.expirationDate;
    }
    return obj;
  },

  create(base?: DeepPartial<NormalizedGovernmentIdData>): NormalizedGovernmentIdData {
    return NormalizedGovernmentIdData.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<NormalizedGovernmentIdData>): NormalizedGovernmentIdData {
    const message = createBaseNormalizedGovernmentIdData();
    message.idNumber = object.idNumber ?? undefined;
    message.givenName = object.givenName ?? undefined;
    message.familyName = object.familyName ?? undefined;
    message.address = object.address ?? undefined;
    message.dateOfBirth = object.dateOfBirth ?? undefined;
    message.country = object.country ?? undefined;
    message.issueDate = object.issueDate ?? undefined;
    message.expirationDate = object.expirationDate ?? undefined;
    return message;
  },
};

function createBaseDemoRelyingParty(): DemoRelyingParty {
  return { displayName: "", logoUrl: "", primaryColor: "" };
}

export const DemoRelyingParty = {
  encode(message: DemoRelyingParty, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.displayName !== undefined && message.displayName !== "") {
      writer.uint32(10).string(message.displayName);
    }
    if (message.logoUrl !== undefined && message.logoUrl !== "") {
      writer.uint32(18).string(message.logoUrl);
    }
    if (message.primaryColor !== undefined && message.primaryColor !== "") {
      writer.uint32(26).string(message.primaryColor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DemoRelyingParty {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDemoRelyingParty();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.displayName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.logoUrl = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.primaryColor = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DemoRelyingParty {
    return {
      displayName: isSet(object.displayName) ? String(object.displayName) : "",
      logoUrl: isSet(object.logoUrl) ? String(object.logoUrl) : "",
      primaryColor: isSet(object.primaryColor) ? String(object.primaryColor) : "",
    };
  },

  toJSON(message: DemoRelyingParty): unknown {
    const obj: any = {};
    if (message.displayName !== undefined && message.displayName !== "") {
      obj.displayName = message.displayName;
    }
    if (message.logoUrl !== undefined && message.logoUrl !== "") {
      obj.logoUrl = message.logoUrl;
    }
    if (message.primaryColor !== undefined && message.primaryColor !== "") {
      obj.primaryColor = message.primaryColor;
    }
    return obj;
  },

  create(base?: DeepPartial<DemoRelyingParty>): DemoRelyingParty {
    return DemoRelyingParty.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DemoRelyingParty>): DemoRelyingParty {
    const message = createBaseDemoRelyingParty();
    message.displayName = object.displayName ?? "";
    message.logoUrl = object.logoUrl ?? "";
    message.primaryColor = object.primaryColor ?? "";
    return message;
  },
};

function createBaseCreateSessionRequest(): CreateSessionRequest {
  return { verifications: [], debugInformation: {}, demoRp: undefined };
}

export const CreateSessionRequest = {
  encode(message: CreateSessionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.verifications !== undefined && message.verifications.length !== 0) {
      for (const v of message.verifications) {
        RequestedVerification.encode(v!, writer.uint32(10).fork()).ldelim();
      }
    }
    Object.entries(message.debugInformation || {}).forEach(([key, value]) => {
      CreateSessionRequest_DebugInformationEntry.encode({ key: key as any, value }, writer.uint32(18).fork()).ldelim();
    });
    if (message.demoRp !== undefined) {
      DemoRelyingParty.encode(message.demoRp, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateSessionRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateSessionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.verifications!.push(RequestedVerification.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          const entry2 = CreateSessionRequest_DebugInformationEntry.decode(reader, reader.uint32());
          if (entry2.value !== undefined) {
            message.debugInformation![entry2.key] = entry2.value;
          }
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.demoRp = DemoRelyingParty.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateSessionRequest {
    return {
      verifications: Array.isArray(object?.verifications)
        ? object.verifications.map((e: any) => RequestedVerification.fromJSON(e))
        : [],
      debugInformation: isObject(object.debugInformation)
        ? Object.entries(object.debugInformation).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      demoRp: isSet(object.demoRp) ? DemoRelyingParty.fromJSON(object.demoRp) : undefined,
    };
  },

  toJSON(message: CreateSessionRequest): unknown {
    const obj: any = {};
    if (message.verifications?.length) {
      obj.verifications = message.verifications.map((e) => RequestedVerification.toJSON(e));
    }
    if (message.debugInformation) {
      const entries = Object.entries(message.debugInformation);
      if (entries.length > 0) {
        obj.debugInformation = {};
        entries.forEach(([k, v]) => {
          obj.debugInformation[k] = v;
        });
      }
    }
    if (message.demoRp !== undefined) {
      obj.demoRp = DemoRelyingParty.toJSON(message.demoRp);
    }
    return obj;
  },

  create(base?: DeepPartial<CreateSessionRequest>): CreateSessionRequest {
    return CreateSessionRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateSessionRequest>): CreateSessionRequest {
    const message = createBaseCreateSessionRequest();
    message.verifications = object.verifications?.map((e) => RequestedVerification.fromPartial(e)) || [];
    message.debugInformation = Object.entries(object.debugInformation ?? {}).reduce<{ [key: string]: string }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      },
      {},
    );
    message.demoRp = (object.demoRp !== undefined && object.demoRp !== null)
      ? DemoRelyingParty.fromPartial(object.demoRp)
      : undefined;
    return message;
  },
};

function createBaseCreateSessionRequest_DebugInformationEntry(): CreateSessionRequest_DebugInformationEntry {
  return { key: "", value: "" };
}

export const CreateSessionRequest_DebugInformationEntry = {
  encode(message: CreateSessionRequest_DebugInformationEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateSessionRequest_DebugInformationEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateSessionRequest_DebugInformationEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateSessionRequest_DebugInformationEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: CreateSessionRequest_DebugInformationEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create(base?: DeepPartial<CreateSessionRequest_DebugInformationEntry>): CreateSessionRequest_DebugInformationEntry {
    return CreateSessionRequest_DebugInformationEntry.fromPartial(base ?? {});
  },
  fromPartial(
    object: DeepPartial<CreateSessionRequest_DebugInformationEntry>,
  ): CreateSessionRequest_DebugInformationEntry {
    const message = createBaseCreateSessionRequest_DebugInformationEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseRequestedVerification(): RequestedVerification {
  return { type: 0, governmentIdOptions: undefined };
}

export const RequestedVerification = {
  encode(message: RequestedVerification, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== undefined && message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.governmentIdOptions !== undefined) {
      GovernmentIDOptions.encode(message.governmentIdOptions, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestedVerification {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestedVerification();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.governmentIdOptions = GovernmentIDOptions.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RequestedVerification {
    return {
      type: isSet(object.type) ? verificationTypeFromJSON(object.type) : 0,
      governmentIdOptions: isSet(object.governmentIdOptions)
        ? GovernmentIDOptions.fromJSON(object.governmentIdOptions)
        : undefined,
    };
  },

  toJSON(message: RequestedVerification): unknown {
    const obj: any = {};
    if (message.type !== undefined && message.type !== 0) {
      obj.type = verificationTypeToJSON(message.type);
    }
    if (message.governmentIdOptions !== undefined) {
      obj.governmentIdOptions = GovernmentIDOptions.toJSON(message.governmentIdOptions);
    }
    return obj;
  },

  create(base?: DeepPartial<RequestedVerification>): RequestedVerification {
    return RequestedVerification.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<RequestedVerification>): RequestedVerification {
    const message = createBaseRequestedVerification();
    message.type = object.type ?? 0;
    message.governmentIdOptions = (object.governmentIdOptions !== undefined && object.governmentIdOptions !== null)
      ? GovernmentIDOptions.fromPartial(object.governmentIdOptions)
      : undefined;
    return message;
  },
};

function createBaseGovernmentIDOptions(): GovernmentIDOptions {
  return { fields: undefined };
}

export const GovernmentIDOptions = {
  encode(message: GovernmentIDOptions, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fields !== undefined) {
      GovernmentIDFields.encode(message.fields, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GovernmentIDOptions {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGovernmentIDOptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.fields = GovernmentIDFields.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GovernmentIDOptions {
    return { fields: isSet(object.fields) ? GovernmentIDFields.fromJSON(object.fields) : undefined };
  },

  toJSON(message: GovernmentIDOptions): unknown {
    const obj: any = {};
    if (message.fields !== undefined) {
      obj.fields = GovernmentIDFields.toJSON(message.fields);
    }
    return obj;
  },

  create(base?: DeepPartial<GovernmentIDOptions>): GovernmentIDOptions {
    return GovernmentIDOptions.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GovernmentIDOptions>): GovernmentIDOptions {
    const message = createBaseGovernmentIDOptions();
    message.fields = (object.fields !== undefined && object.fields !== null)
      ? GovernmentIDFields.fromPartial(object.fields)
      : undefined;
    return message;
  },
};

function createBaseGovernmentIDFields(): GovernmentIDFields {
  return {
    idNumber: false,
    givenName: false,
    familyName: false,
    address: false,
    dateOfBirth: false,
    country: false,
    issueDate: false,
    expirationDate: false,
  };
}

export const GovernmentIDFields = {
  encode(message: GovernmentIDFields, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.idNumber === true) {
      writer.uint32(8).bool(message.idNumber);
    }
    if (message.givenName === true) {
      writer.uint32(16).bool(message.givenName);
    }
    if (message.familyName === true) {
      writer.uint32(24).bool(message.familyName);
    }
    if (message.address === true) {
      writer.uint32(32).bool(message.address);
    }
    if (message.dateOfBirth === true) {
      writer.uint32(40).bool(message.dateOfBirth);
    }
    if (message.country === true) {
      writer.uint32(48).bool(message.country);
    }
    if (message.issueDate === true) {
      writer.uint32(56).bool(message.issueDate);
    }
    if (message.expirationDate === true) {
      writer.uint32(64).bool(message.expirationDate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GovernmentIDFields {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGovernmentIDFields();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.idNumber = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.givenName = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.familyName = reader.bool();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.address = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.dateOfBirth = reader.bool();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.country = reader.bool();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.issueDate = reader.bool();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.expirationDate = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GovernmentIDFields {
    return {
      idNumber: isSet(object.idNumber) ? Boolean(object.idNumber) : false,
      givenName: isSet(object.givenName) ? Boolean(object.givenName) : false,
      familyName: isSet(object.familyName) ? Boolean(object.familyName) : false,
      address: isSet(object.address) ? Boolean(object.address) : false,
      dateOfBirth: isSet(object.dateOfBirth) ? Boolean(object.dateOfBirth) : false,
      country: isSet(object.country) ? Boolean(object.country) : false,
      issueDate: isSet(object.issueDate) ? Boolean(object.issueDate) : false,
      expirationDate: isSet(object.expirationDate) ? Boolean(object.expirationDate) : false,
    };
  },

  toJSON(message: GovernmentIDFields): unknown {
    const obj: any = {};
    if (message.idNumber === true) {
      obj.idNumber = message.idNumber;
    }
    if (message.givenName === true) {
      obj.givenName = message.givenName;
    }
    if (message.familyName === true) {
      obj.familyName = message.familyName;
    }
    if (message.address === true) {
      obj.address = message.address;
    }
    if (message.dateOfBirth === true) {
      obj.dateOfBirth = message.dateOfBirth;
    }
    if (message.country === true) {
      obj.country = message.country;
    }
    if (message.issueDate === true) {
      obj.issueDate = message.issueDate;
    }
    if (message.expirationDate === true) {
      obj.expirationDate = message.expirationDate;
    }
    return obj;
  },

  create(base?: DeepPartial<GovernmentIDFields>): GovernmentIDFields {
    return GovernmentIDFields.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GovernmentIDFields>): GovernmentIDFields {
    const message = createBaseGovernmentIDFields();
    message.idNumber = object.idNumber ?? false;
    message.givenName = object.givenName ?? false;
    message.familyName = object.familyName ?? false;
    message.address = object.address ?? false;
    message.dateOfBirth = object.dateOfBirth ?? false;
    message.country = object.country ?? false;
    message.issueDate = object.issueDate ?? false;
    message.expirationDate = object.expirationDate ?? false;
    return message;
  },
};

function createBaseCreateSessionResponse(): CreateSessionResponse {
  return { session: undefined };
}

export const CreateSessionResponse = {
  encode(message: CreateSessionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.session !== undefined) {
      IDVSession.encode(message.session, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateSessionResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateSessionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.session = IDVSession.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateSessionResponse {
    return { session: isSet(object.session) ? IDVSession.fromJSON(object.session) : undefined };
  },

  toJSON(message: CreateSessionResponse): unknown {
    const obj: any = {};
    if (message.session !== undefined) {
      obj.session = IDVSession.toJSON(message.session);
    }
    return obj;
  },

  create(base?: DeepPartial<CreateSessionResponse>): CreateSessionResponse {
    return CreateSessionResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateSessionResponse>): CreateSessionResponse {
    const message = createBaseCreateSessionResponse();
    message.session = (object.session !== undefined && object.session !== null)
      ? IDVSession.fromPartial(object.session)
      : undefined;
    return message;
  },
};

function createBaseCancelSessionRequest(): CancelSessionRequest {
  return { idvSessionId: "" };
}

export const CancelSessionRequest = {
  encode(message: CancelSessionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.idvSessionId !== undefined && message.idvSessionId !== "") {
      writer.uint32(10).string(message.idvSessionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CancelSessionRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCancelSessionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.idvSessionId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CancelSessionRequest {
    return { idvSessionId: isSet(object.idvSessionId) ? String(object.idvSessionId) : "" };
  },

  toJSON(message: CancelSessionRequest): unknown {
    const obj: any = {};
    if (message.idvSessionId !== undefined && message.idvSessionId !== "") {
      obj.idvSessionId = message.idvSessionId;
    }
    return obj;
  },

  create(base?: DeepPartial<CancelSessionRequest>): CancelSessionRequest {
    return CancelSessionRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CancelSessionRequest>): CancelSessionRequest {
    const message = createBaseCancelSessionRequest();
    message.idvSessionId = object.idvSessionId ?? "";
    return message;
  },
};

function createBaseCancelSessionResponse(): CancelSessionResponse {
  return { session: undefined };
}

export const CancelSessionResponse = {
  encode(message: CancelSessionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.session !== undefined) {
      IDVSession.encode(message.session, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CancelSessionResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCancelSessionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.session = IDVSession.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CancelSessionResponse {
    return { session: isSet(object.session) ? IDVSession.fromJSON(object.session) : undefined };
  },

  toJSON(message: CancelSessionResponse): unknown {
    const obj: any = {};
    if (message.session !== undefined) {
      obj.session = IDVSession.toJSON(message.session);
    }
    return obj;
  },

  create(base?: DeepPartial<CancelSessionResponse>): CancelSessionResponse {
    return CancelSessionResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CancelSessionResponse>): CancelSessionResponse {
    const message = createBaseCancelSessionResponse();
    message.session = (object.session !== undefined && object.session !== null)
      ? IDVSession.fromPartial(object.session)
      : undefined;
    return message;
  },
};

function createBaseGetSessionRequest(): GetSessionRequest {
  return { idvSessionId: "" };
}

export const GetSessionRequest = {
  encode(message: GetSessionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.idvSessionId !== undefined && message.idvSessionId !== "") {
      writer.uint32(10).string(message.idvSessionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetSessionRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetSessionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.idvSessionId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetSessionRequest {
    return { idvSessionId: isSet(object.idvSessionId) ? String(object.idvSessionId) : "" };
  },

  toJSON(message: GetSessionRequest): unknown {
    const obj: any = {};
    if (message.idvSessionId !== undefined && message.idvSessionId !== "") {
      obj.idvSessionId = message.idvSessionId;
    }
    return obj;
  },

  create(base?: DeepPartial<GetSessionRequest>): GetSessionRequest {
    return GetSessionRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetSessionRequest>): GetSessionRequest {
    const message = createBaseGetSessionRequest();
    message.idvSessionId = object.idvSessionId ?? "";
    return message;
  },
};

function createBaseGetSessionResponse(): GetSessionResponse {
  return { session: undefined };
}

export const GetSessionResponse = {
  encode(message: GetSessionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.session !== undefined) {
      IDVSession.encode(message.session, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetSessionResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetSessionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.session = IDVSession.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetSessionResponse {
    return { session: isSet(object.session) ? IDVSession.fromJSON(object.session) : undefined };
  },

  toJSON(message: GetSessionResponse): unknown {
    const obj: any = {};
    if (message.session !== undefined) {
      obj.session = IDVSession.toJSON(message.session);
    }
    return obj;
  },

  create(base?: DeepPartial<GetSessionResponse>): GetSessionResponse {
    return GetSessionResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetSessionResponse>): GetSessionResponse {
    const message = createBaseGetSessionResponse();
    message.session = (object.session !== undefined && object.session !== null)
      ? IDVSession.fromPartial(object.session)
      : undefined;
    return message;
  },
};

function createBaseListSessionsRequest(): ListSessionsRequest {
  return { orderBy: 0, orderDirection: 0, pageSize: undefined, page: undefined };
}

export const ListSessionsRequest = {
  encode(message: ListSessionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderBy !== undefined && message.orderBy !== 0) {
      writer.uint32(8).int32(message.orderBy);
    }
    if (message.orderDirection !== undefined && message.orderDirection !== 0) {
      writer.uint32(16).int32(message.orderDirection);
    }
    if (message.pageSize !== undefined) {
      writer.uint32(24).int32(message.pageSize);
    }
    if (message.page !== undefined) {
      writer.uint32(32).int32(message.page);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListSessionsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListSessionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.orderBy = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.orderDirection = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.pageSize = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.page = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListSessionsRequest {
    return {
      orderBy: isSet(object.orderBy) ? sessionOrderingFromJSON(object.orderBy) : 0,
      orderDirection: isSet(object.orderDirection) ? orderDirectionFromJSON(object.orderDirection) : 0,
      pageSize: isSet(object.pageSize) ? Number(object.pageSize) : undefined,
      page: isSet(object.page) ? Number(object.page) : undefined,
    };
  },

  toJSON(message: ListSessionsRequest): unknown {
    const obj: any = {};
    if (message.orderBy !== undefined && message.orderBy !== 0) {
      obj.orderBy = sessionOrderingToJSON(message.orderBy);
    }
    if (message.orderDirection !== undefined && message.orderDirection !== 0) {
      obj.orderDirection = orderDirectionToJSON(message.orderDirection);
    }
    if (message.pageSize !== undefined) {
      obj.pageSize = Math.round(message.pageSize);
    }
    if (message.page !== undefined) {
      obj.page = Math.round(message.page);
    }
    return obj;
  },

  create(base?: DeepPartial<ListSessionsRequest>): ListSessionsRequest {
    return ListSessionsRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListSessionsRequest>): ListSessionsRequest {
    const message = createBaseListSessionsRequest();
    message.orderBy = object.orderBy ?? 0;
    message.orderDirection = object.orderDirection ?? 0;
    message.pageSize = object.pageSize ?? undefined;
    message.page = object.page ?? undefined;
    return message;
  },
};

function createBaseListSessionsResponse(): ListSessionsResponse {
  return { sessions: [], total: 0, more: false };
}

export const ListSessionsResponse = {
  encode(message: ListSessionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sessions !== undefined && message.sessions.length !== 0) {
      for (const v of message.sessions) {
        IDVSession.encode(v!, writer.uint32(10).fork()).ldelim();
      }
    }
    if (message.total !== undefined && message.total !== 0) {
      writer.uint32(16).int32(message.total);
    }
    if (message.more === true) {
      writer.uint32(24).bool(message.more);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListSessionsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListSessionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sessions!.push(IDVSession.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.total = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.more = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListSessionsResponse {
    return {
      sessions: Array.isArray(object?.sessions) ? object.sessions.map((e: any) => IDVSession.fromJSON(e)) : [],
      total: isSet(object.total) ? Number(object.total) : 0,
      more: isSet(object.more) ? Boolean(object.more) : false,
    };
  },

  toJSON(message: ListSessionsResponse): unknown {
    const obj: any = {};
    if (message.sessions?.length) {
      obj.sessions = message.sessions.map((e) => IDVSession.toJSON(e));
    }
    if (message.total !== undefined && message.total !== 0) {
      obj.total = Math.round(message.total);
    }
    if (message.more === true) {
      obj.more = message.more;
    }
    return obj;
  },

  create(base?: DeepPartial<ListSessionsResponse>): ListSessionsResponse {
    return ListSessionsResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListSessionsResponse>): ListSessionsResponse {
    const message = createBaseListSessionsResponse();
    message.sessions = object.sessions?.map((e) => IDVSession.fromPartial(e)) || [];
    message.total = object.total ?? 0;
    message.more = object.more ?? false;
    return message;
  },
};

function createBaseHasValidCredentialRequest(): HasValidCredentialRequest {
  return { identity: undefined, credentialRequestData: undefined };
}

export const HasValidCredentialRequest = {
  encode(message: HasValidCredentialRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== undefined) {
      CreateWalletRequest_ExternalIdentity.encode(message.identity, writer.uint32(10).fork()).ldelim();
    }
    if (message.credentialRequestData !== undefined) {
      CredentialRequestData.encode(message.credentialRequestData, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HasValidCredentialRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHasValidCredentialRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identity = CreateWalletRequest_ExternalIdentity.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.credentialRequestData = CredentialRequestData.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): HasValidCredentialRequest {
    return {
      identity: isSet(object.identity) ? CreateWalletRequest_ExternalIdentity.fromJSON(object.identity) : undefined,
      credentialRequestData: isSet(object.credentialRequestData)
        ? CredentialRequestData.fromJSON(object.credentialRequestData)
        : undefined,
    };
  },

  toJSON(message: HasValidCredentialRequest): unknown {
    const obj: any = {};
    if (message.identity !== undefined) {
      obj.identity = CreateWalletRequest_ExternalIdentity.toJSON(message.identity);
    }
    if (message.credentialRequestData !== undefined) {
      obj.credentialRequestData = CredentialRequestData.toJSON(message.credentialRequestData);
    }
    return obj;
  },

  create(base?: DeepPartial<HasValidCredentialRequest>): HasValidCredentialRequest {
    return HasValidCredentialRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<HasValidCredentialRequest>): HasValidCredentialRequest {
    const message = createBaseHasValidCredentialRequest();
    message.identity = (object.identity !== undefined && object.identity !== null)
      ? CreateWalletRequest_ExternalIdentity.fromPartial(object.identity)
      : undefined;
    message.credentialRequestData =
      (object.credentialRequestData !== undefined && object.credentialRequestData !== null)
        ? CredentialRequestData.fromPartial(object.credentialRequestData)
        : undefined;
    return message;
  },
};

function createBaseHasValidCredentialResponse(): HasValidCredentialResponse {
  return { hasValidCredential: false };
}

export const HasValidCredentialResponse = {
  encode(message: HasValidCredentialResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hasValidCredential === true) {
      writer.uint32(8).bool(message.hasValidCredential);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HasValidCredentialResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHasValidCredentialResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.hasValidCredential = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): HasValidCredentialResponse {
    return { hasValidCredential: isSet(object.hasValidCredential) ? Boolean(object.hasValidCredential) : false };
  },

  toJSON(message: HasValidCredentialResponse): unknown {
    const obj: any = {};
    if (message.hasValidCredential === true) {
      obj.hasValidCredential = message.hasValidCredential;
    }
    return obj;
  },

  create(base?: DeepPartial<HasValidCredentialResponse>): HasValidCredentialResponse {
    return HasValidCredentialResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<HasValidCredentialResponse>): HasValidCredentialResponse {
    const message = createBaseHasValidCredentialResponse();
    message.hasValidCredential = object.hasValidCredential ?? false;
    return message;
  },
};

function createBaseCredentialRequestData(): CredentialRequestData {
  return { type: 0 };
}

export const CredentialRequestData = {
  encode(message: CredentialRequestData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== undefined && message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CredentialRequestData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredentialRequestData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CredentialRequestData {
    return { type: isSet(object.type) ? verificationTypeFromJSON(object.type) : 0 };
  },

  toJSON(message: CredentialRequestData): unknown {
    const obj: any = {};
    if (message.type !== undefined && message.type !== 0) {
      obj.type = verificationTypeToJSON(message.type);
    }
    return obj;
  },

  create(base?: DeepPartial<CredentialRequestData>): CredentialRequestData {
    return CredentialRequestData.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CredentialRequestData>): CredentialRequestData {
    const message = createBaseCredentialRequestData();
    message.type = object.type ?? 0;
    return message;
  },
};

/** The Connect service provides access to Trinsic Connect, a reusable identity verification service. */
export type ConnectDefinition = typeof ConnectDefinition;
export const ConnectDefinition = {
  name: "Connect",
  fullName: "services.connect.v1.Connect",
  methods: {
    /** Create an IDVSession */
    createSession: {
      name: "CreateSession",
      requestType: CreateSessionRequest,
      requestStream: false,
      responseType: CreateSessionResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          480010: [new Uint8Array([4, 42, 2, 8, 1])],
          578365826: [
            new Uint8Array([
              30,
              34,
              25,
              47,
              118,
              49,
              47,
              99,
              111,
              110,
              110,
              101,
              99,
              116,
              47,
              99,
              114,
              101,
              97,
              116,
              101,
              115,
              101,
              115,
              115,
              105,
              111,
              110,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Cancel an IDVSession */
    cancelSession: {
      name: "CancelSession",
      requestType: CancelSessionRequest,
      requestStream: false,
      responseType: CancelSessionResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          480010: [new Uint8Array([4, 42, 2, 8, 1])],
          578365826: [
            new Uint8Array([
              30,
              34,
              25,
              47,
              118,
              49,
              47,
              99,
              111,
              110,
              110,
              101,
              99,
              116,
              47,
              99,
              97,
              110,
              99,
              101,
              108,
              115,
              101,
              115,
              115,
              105,
              111,
              110,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Get an IDVSession */
    getSession: {
      name: "GetSession",
      requestType: GetSessionRequest,
      requestStream: false,
      responseType: GetSessionResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          480010: [new Uint8Array([4, 42, 2, 8, 1])],
          578365826: [
            new Uint8Array([
              27,
              34,
              22,
              47,
              118,
              49,
              47,
              99,
              111,
              110,
              110,
              101,
              99,
              116,
              47,
              103,
              101,
              116,
              115,
              101,
              115,
              115,
              105,
              111,
              110,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** List IDVSessions created by the calling wallet */
    listSessions: {
      name: "ListSessions",
      requestType: ListSessionsRequest,
      requestStream: false,
      responseType: ListSessionsResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          480010: [new Uint8Array([4, 42, 2, 8, 1])],
          578365826: [
            new Uint8Array([
              29,
              34,
              24,
              47,
              118,
              49,
              47,
              99,
              111,
              110,
              110,
              101,
              99,
              116,
              47,
              108,
              105,
              115,
              116,
              115,
              101,
              115,
              115,
              105,
              111,
              110,
              115,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /** Checks if the identity provided in the request has a wallet containing a valid reusable credential */
    hasValidCredential: {
      name: "HasValidCredential",
      requestType: HasValidCredentialRequest,
      requestStream: false,
      responseType: HasValidCredentialResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          480010: [new Uint8Array([4, 42, 2, 8, 1])],
          578365826: [
            new Uint8Array([
              35,
              34,
              30,
              47,
              118,
              49,
              47,
              99,
              111,
              110,
              110,
              101,
              99,
              116,
              47,
              104,
              97,
              115,
              118,
              97,
              108,
              105,
              100,
              99,
              114,
              101,
              100,
              101,
              110,
              116,
              105,
              97,
              108,
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

declare const self: any | undefined;
declare const window: any | undefined;
declare const global: any | undefined;
const tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
