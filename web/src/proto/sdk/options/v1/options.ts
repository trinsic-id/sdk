/* eslint-disable */
import _m0 from "protobufjs/minimal";

/** Configuration for Trinsic SDK Services */
export interface TrinsicOptions {
  /** Trinsic API endpoint. Defaults to `prod.trinsic.cloud` */
  serverEndpoint?:
    | string
    | undefined;
  /** Trinsic API port; defaults to `443` */
  serverPort?:
    | number
    | undefined;
  /** Whether TLS is enabled between SDK and Trinsic API; defaults to `true` */
  serverUseTls?:
    | boolean
    | undefined;
  /** Authentication token for SDK calls; defaults to empty string (unauthenticated) */
  authToken?: string | undefined;
}

function createBaseTrinsicOptions(): TrinsicOptions {
  return { serverEndpoint: "", serverPort: 0, serverUseTls: false, authToken: "" };
}

export const TrinsicOptions = {
  encode(message: TrinsicOptions, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serverEndpoint !== undefined && message.serverEndpoint !== "") {
      writer.uint32(10).string(message.serverEndpoint);
    }
    if (message.serverPort !== undefined && message.serverPort !== 0) {
      writer.uint32(16).int32(message.serverPort);
    }
    if (message.serverUseTls === true) {
      writer.uint32(24).bool(message.serverUseTls);
    }
    if (message.authToken !== undefined && message.authToken !== "") {
      writer.uint32(34).string(message.authToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TrinsicOptions {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrinsicOptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.serverEndpoint = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.serverPort = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.serverUseTls = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
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

  fromJSON(object: any): TrinsicOptions {
    return {
      serverEndpoint: isSet(object.serverEndpoint) ? String(object.serverEndpoint) : "",
      serverPort: isSet(object.serverPort) ? Number(object.serverPort) : 0,
      serverUseTls: isSet(object.serverUseTls) ? Boolean(object.serverUseTls) : false,
      authToken: isSet(object.authToken) ? String(object.authToken) : "",
    };
  },

  toJSON(message: TrinsicOptions): unknown {
    const obj: any = {};
    if (message.serverEndpoint !== undefined && message.serverEndpoint !== "") {
      obj.serverEndpoint = message.serverEndpoint;
    }
    if (message.serverPort !== undefined && message.serverPort !== 0) {
      obj.serverPort = Math.round(message.serverPort);
    }
    if (message.serverUseTls === true) {
      obj.serverUseTls = message.serverUseTls;
    }
    if (message.authToken !== undefined && message.authToken !== "") {
      obj.authToken = message.authToken;
    }
    return obj;
  },

  create(base?: DeepPartial<TrinsicOptions>): TrinsicOptions {
    return TrinsicOptions.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<TrinsicOptions>): TrinsicOptions {
    const message = createBaseTrinsicOptions();
    message.serverEndpoint = object.serverEndpoint ?? "";
    message.serverPort = object.serverPort ?? 0;
    message.serverUseTls = object.serverUseTls ?? false;
    message.authToken = object.authToken ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
