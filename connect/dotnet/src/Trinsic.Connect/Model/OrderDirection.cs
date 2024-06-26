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
/// Defines OrderDirection
/// </summary>
[JsonConverter(typeof(StringEnumConverter))]
public enum OrderDirection
{
    /// <summary>
    /// Enum Ascending for value: Ascending
    /// </summary>
    [EnumMember(Value = "Ascending")]
    Ascending = 1,

    /// <summary>
    /// Enum Descending for value: Descending
    /// </summary>
    [EnumMember(Value = "Descending")]
    Descending = 2
}
