/*
 * Connect API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * Generated by: https://github.com/openapitools/openapi-generator.git
 */

using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Trinsic.Connect.Model;

/// <summary>
/// Defines VerificationState
/// </summary>
[JsonConverter(typeof(StringEnumConverter))]
public enum VerificationState
{
    /// <summary>
    /// Enum VerificationPending for value: VerificationPending
    /// </summary>
    [EnumMember(Value = "VerificationPending")]
    VerificationPending = 1,

    /// <summary>
    /// Enum VerificationSuccess for value: VerificationSuccess
    /// </summary>
    [EnumMember(Value = "VerificationSuccess")]
    VerificationSuccess = 2,

    /// <summary>
    /// Enum VerificationFailed for value: VerificationFailed
    /// </summary>
    [EnumMember(Value = "VerificationFailed")]
    VerificationFailed = 3
}
