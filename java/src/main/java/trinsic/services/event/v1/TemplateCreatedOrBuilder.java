// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/event/v1/event.proto

package trinsic.services.event.v1;

public interface TemplateCreatedOrBuilder
    extends
    // @@protoc_insertion_point(interface_extends:trinsic.services.event.TemplateCreated)
    com.google.protobuf.MessageOrBuilder {

  /**
   *
   *
   * <pre>
   * UUID of the template
   * </pre>
   *
   * <code>string id = 1;</code>
   *
   * @return The id.
   */
  java.lang.String getId();
  /**
   *
   *
   * <pre>
   * UUID of the template
   * </pre>
   *
   * <code>string id = 1;</code>
   *
   * @return The bytes for id.
   */
  com.google.protobuf.ByteString getIdBytes();

  /**
   *
   *
   * <pre>
   * UUID of the ecosystem that owns this template
   * </pre>
   *
   * <code>string ecosystem_id = 2;</code>
   *
   * @return The ecosystemId.
   */
  java.lang.String getEcosystemId();
  /**
   *
   *
   * <pre>
   * UUID of the ecosystem that owns this template
   * </pre>
   *
   * <code>string ecosystem_id = 2;</code>
   *
   * @return The bytes for ecosystemId.
   */
  com.google.protobuf.ByteString getEcosystemIdBytes();

  /**
   *
   *
   * <pre>
   * Template name
   * </pre>
   *
   * <code>string name = 3;</code>
   *
   * @return The name.
   */
  java.lang.String getName();
  /**
   *
   *
   * <pre>
   * Template name
   * </pre>
   *
   * <code>string name = 3;</code>
   *
   * @return The bytes for name.
   */
  com.google.protobuf.ByteString getNameBytes();

  /**
   *
   *
   * <pre>
   * Template type
   * </pre>
   *
   * <code>string type = 4;</code>
   *
   * @return The type.
   */
  java.lang.String getType();
  /**
   *
   *
   * <pre>
   * Template type
   * </pre>
   *
   * <code>string type = 4;</code>
   *
   * @return The bytes for type.
   */
  com.google.protobuf.ByteString getTypeBytes();

  /**
   *
   *
   * <pre>
   * WalletID that created the template
   * </pre>
   *
   * <code>string created_by = 5;</code>
   *
   * @return The createdBy.
   */
  java.lang.String getCreatedBy();
  /**
   *
   *
   * <pre>
   * WalletID that created the template
   * </pre>
   *
   * <code>string created_by = 5;</code>
   *
   * @return The bytes for createdBy.
   */
  com.google.protobuf.ByteString getCreatedByBytes();
}
