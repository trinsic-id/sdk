// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/universal-wallet/v1/universal-wallet.proto

package trinsic.services.universalwallet.v1;

public interface GenerateAuthTokenResponseOrBuilder
    extends
    // @@protoc_insertion_point(interface_extends:services.universalwallet.v1.GenerateAuthTokenResponse)
    com.google.protobuf.MessageOrBuilder {

  /**
   * <code>string token_id = 1;</code>
   *
   * @return The tokenId.
   */
  java.lang.String getTokenId();
  /**
   * <code>string token_id = 1;</code>
   *
   * @return The bytes for tokenId.
   */
  com.google.protobuf.ByteString getTokenIdBytes();

  /**
   * <code>string auth_token = 2;</code>
   *
   * @return The authToken.
   */
  java.lang.String getAuthToken();
  /**
   * <code>string auth_token = 2;</code>
   *
   * @return The bytes for authToken.
   */
  com.google.protobuf.ByteString getAuthTokenBytes();
}
