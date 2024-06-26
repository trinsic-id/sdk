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
 * @interface ListSessionsResponse
 */
export interface ListSessionsResponse {
    /**
     *
     * @type {Array<Session>}
     * @memberof ListSessionsResponse
     */
    sessions?: Array<Session> | null;
    /**
     *
     * @type {number}
     * @memberof ListSessionsResponse
     */
    total?: number;
    /**
     *
     * @type {boolean}
     * @memberof ListSessionsResponse
     */
    more?: boolean;
}

/**
 * Check if a given object implements the ListSessionsResponse interface.
 */
export function instanceOfListSessionsResponse(
    value: object,
): value is ListSessionsResponse {
    return true;
}

export function ListSessionsResponseFromJSON(json: any): ListSessionsResponse {
    return ListSessionsResponseFromJSONTyped(json, false);
}

export function ListSessionsResponseFromJSONTyped(
    json: any,
    ignoreDiscriminator: boolean,
): ListSessionsResponse {
    if (json == null) {
        return json;
    }
    return {
        sessions:
            json["sessions"] == null
                ? undefined
                : (json["sessions"] as Array<any>).map(SessionFromJSON),
        total: json["total"] == null ? undefined : json["total"],
        more: json["more"] == null ? undefined : json["more"],
    };
}

export function ListSessionsResponseToJSON(
    value?: ListSessionsResponse | null,
): any {
    if (value == null) {
        return value;
    }
    return {
        sessions:
            value["sessions"] == null
                ? undefined
                : (value["sessions"] as Array<any>).map(SessionToJSON),
        total: value["total"],
        more: value["more"],
    };
}
