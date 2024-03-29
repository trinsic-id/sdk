// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/universal-wallet/v1/universal-wallet.proto

package trinsic.services.universalwallet.v1;

public interface AddExternalIdentityConfirmRequestOrBuilder
    extends
    // @@protoc_insertion_point(interface_extends:services.universalwallet.v1.AddExternalIdentityConfirmRequest)
    com.google.protobuf.MessageOrBuilder {

  /**
   *
   *
   * <pre>
   * The challenge received from the `AddExternalIdentityInit` endpoint
   * </pre>
   *
   * <code>string challenge = 1;</code>
   *
   * @return The challenge.
   */
  java.lang.String getChallenge();
  /**
   *
   *
   * <pre>
   * The challenge received from the `AddExternalIdentityInit` endpoint
   * </pre>
   *
   * <code>string challenge = 1;</code>
   *
   * @return The bytes for challenge.
   */
  com.google.protobuf.ByteString getChallengeBytes();

  /**
   *
   *
   * <pre>
   * The response to the challenge. If using Email or Phone,
   * this is the OTP code sent to the user's email or phone
   * </pre>
   *
   * <code>string response = 2;</code>
   *
   * @return The response.
   */
  java.lang.String getResponse();
  /**
   *
   *
   * <pre>
   * The response to the challenge. If using Email or Phone,
   * this is the OTP code sent to the user's email or phone
   * </pre>
   *
   * <code>string response = 2;</code>
   *
   * @return The bytes for response.
   */
  com.google.protobuf.ByteString getResponseBytes();
}
