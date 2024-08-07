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

/**
 *
 * @export
 */
export const SessionOrdering = {
    Created: "Created",
    Updated: "Updated",
    State: "State",
} as const;
export type SessionOrdering =
    (typeof SessionOrdering)[keyof typeof SessionOrdering];

export function instanceOfSessionOrdering(value: any): boolean {
    for (const key in SessionOrdering) {
        if (Object.prototype.hasOwnProperty.call(SessionOrdering, key)) {
            if (
                SessionOrdering[key as keyof typeof SessionOrdering] === value
            ) {
                return true;
            }
        }
    }
    return false;
}

export function SessionOrderingFromJSON(json: any): SessionOrdering {
    return SessionOrderingFromJSONTyped(json, false);
}

export function SessionOrderingFromJSONTyped(
    json: any,
    ignoreDiscriminator: boolean,
): SessionOrdering {
    return json as SessionOrdering;
}

export function SessionOrderingToJSON(value?: SessionOrdering | null): any {
    return value as any;
}
