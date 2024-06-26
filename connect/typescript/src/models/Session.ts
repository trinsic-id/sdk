/* tslint:disable */
/* eslint-disable */
/**
 * Connect API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from "../runtime";
import type { SessionFailCode } from "./SessionFailCode";
import {
    SessionFailCodeFromJSON,
    SessionFailCodeFromJSONTyped,
    SessionFailCodeToJSON,
} from "./SessionFailCode";
import type { Verification } from "./Verification";
import {
    VerificationFromJSON,
    VerificationFromJSONTyped,
    VerificationToJSON,
} from "./Verification";
import type { IDVSessionState } from "./IDVSessionState";
import {
    IDVSessionStateFromJSON,
    IDVSessionStateFromJSONTyped,
    IDVSessionStateToJSON,
} from "./IDVSessionState";

/**
 *
 * @export
 * @interface Session
 */
export interface Session {
    /**
     *
     * @type {string}
     * @memberof Session
     */
    id?: string | null;
    /**
     *
     * @type {string}
     * @memberof Session
     */
    clientToken?: string | null;
    /**
     *
     * @type {IDVSessionState}
     * @memberof Session
     */
    state?: IDVSessionState;
    /**
     *
     * @type {{ [key: string]: Verification; }}
     * @memberof Session
     */
    verifications?: { [key: string]: Verification } | null;
    /**
     *
     * @type {SessionFailCode}
     * @memberof Session
     */
    failCode?: SessionFailCode;
    /**
     *
     * @type {string}
     * @memberof Session
     */
    resultVp?: string | null;
    /**
     *
     * @type {number}
     * @memberof Session
     */
    created?: number;
    /**
     *
     * @type {number}
     * @memberof Session
     */
    updated?: number;
}

/**
 * Check if a given object implements the Session interface.
 */
export function instanceOfSession(value: object): value is Session {
    return true;
}

export function SessionFromJSON(json: any): Session {
    return SessionFromJSONTyped(json, false);
}

export function SessionFromJSONTyped(
    json: any,
    ignoreDiscriminator: boolean,
): Session {
    if (json == null) {
        return json;
    }
    return {
        id: json["id"] == null ? undefined : json["id"],
        clientToken:
            json["clientToken"] == null ? undefined : json["clientToken"],
        state:
            json["state"] == null
                ? undefined
                : IDVSessionStateFromJSON(json["state"]),
        verifications:
            json["verifications"] == null
                ? undefined
                : mapValues(json["verifications"], VerificationFromJSON),
        failCode:
            json["failCode"] == null
                ? undefined
                : SessionFailCodeFromJSON(json["failCode"]),
        resultVp: json["resultVp"] == null ? undefined : json["resultVp"],
        created: json["created"] == null ? undefined : json["created"],
        updated: json["updated"] == null ? undefined : json["updated"],
    };
}

export function SessionToJSON(value?: Session | null): any {
    if (value == null) {
        return value;
    }
    return {
        id: value["id"],
        clientToken: value["clientToken"],
        state: IDVSessionStateToJSON(value["state"]),
        verifications:
            value["verifications"] == null
                ? undefined
                : mapValues(value["verifications"], VerificationToJSON),
        failCode: SessionFailCodeToJSON(value["failCode"]),
        resultVp: value["resultVp"],
        created: value["created"],
        updated: value["updated"],
    };
}
