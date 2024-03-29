// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/options/field-options.proto

package trinsic.services.protobuf.options;

public interface AnnotationOptionOrBuilder
    extends
    // @@protoc_insertion_point(interface_extends:services.options.AnnotationOption)
    com.google.protobuf.MessageOrBuilder {

  /**
   *
   *
   * <pre>
   * Is this annotation active
   * </pre>
   *
   * <code>bool active = 1;</code>
   *
   * @return The active.
   */
  boolean getActive();

  /**
   *
   *
   * <pre>
   * Custom annotation message to provide
   * </pre>
   *
   * <code>string message = 2;</code>
   *
   * @return The message.
   */
  java.lang.String getMessage();
  /**
   *
   *
   * <pre>
   * Custom annotation message to provide
   * </pre>
   *
   * <code>string message = 2;</code>
   *
   * @return The bytes for message.
   */
  com.google.protobuf.ByteString getMessageBytes();
}
