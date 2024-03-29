// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/trust-registry/v1/trust-registry.proto

package trinsic.services.trustregistry.v1;

public interface AuthorizedMemberSchemaOrBuilder
    extends
    // @@protoc_insertion_point(interface_extends:services.trustregistry.v1.AuthorizedMemberSchema)
    com.google.protobuf.MessageOrBuilder {

  /**
   * <code>string schema_uri = 1;</code>
   *
   * @return The schemaUri.
   */
  java.lang.String getSchemaUri();
  /**
   * <code>string schema_uri = 1;</code>
   *
   * @return The bytes for schemaUri.
   */
  com.google.protobuf.ByteString getSchemaUriBytes();

  /**
   * <code>string status = 2;</code>
   *
   * @return The status.
   */
  java.lang.String getStatus();
  /**
   * <code>string status = 2;</code>
   *
   * @return The bytes for status.
   */
  com.google.protobuf.ByteString getStatusBytes();

  /**
   * <code>string status_details = 3;</code>
   *
   * @return The statusDetails.
   */
  java.lang.String getStatusDetails();
  /**
   * <code>string status_details = 3;</code>
   *
   * @return The bytes for statusDetails.
   */
  com.google.protobuf.ByteString getStatusDetailsBytes();

  /**
   * <code>uint64 valid_from = 4;</code>
   *
   * @return The validFrom.
   */
  long getValidFrom();

  /**
   * <code>uint64 valid_until = 5;</code>
   *
   * @return The validUntil.
   */
  long getValidUntil();
}
