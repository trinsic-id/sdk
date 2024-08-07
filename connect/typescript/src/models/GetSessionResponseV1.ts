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
import type { Session } from "./Session";
import {
    SessionFromJSON,
    SessionFromJSONTyped,
    SessionToJSON,
} from "./Session";

/**
 *
 * @export
 * @interface GetSessionResponseV1
 */
export interface GetSessionResponseV1 {
    /**
     *
     * @type {Session}
     * @memberof GetSessionResponseV1
     */
    session: Session;
}

/**
 * Check if a given object implements the GetSessionResponseV1 interface.
 */
export function instanceOfGetSessionResponseV1(
    value: object,
): value is GetSessionResponseV1 {
    if (!("session" in value) || value["session"] === undefined) return false;
    return true;
}

export function GetSessionResponseV1FromJSON(json: any): GetSessionResponseV1 {
    return GetSessionResponseV1FromJSONTyped(json, false);
}

export function GetSessionResponseV1FromJSONTyped(
    json: any,
    ignoreDiscriminator: boolean,
): GetSessionResponseV1 {
    if (json == null) {
        return json;
    }
    return {
        session: SessionFromJSON(json["session"]),
    };
}

export function GetSessionResponseV1ToJSON(
    value?: GetSessionResponseV1 | null,
): any {
    if (value == null) {
        return value;
    }
    return {
        session: SessionToJSON(value["session"]),
    };
}
