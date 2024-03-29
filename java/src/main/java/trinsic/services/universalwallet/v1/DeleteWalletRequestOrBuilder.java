// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/universal-wallet/v1/universal-wallet.proto

package trinsic.services.universalwallet.v1;

public interface DeleteWalletRequestOrBuilder
    extends
    // @@protoc_insertion_point(interface_extends:services.universalwallet.v1.DeleteWalletRequest)
    com.google.protobuf.MessageOrBuilder {

  /**
   *
   *
   * <pre>
   * Email address of account to delete.
   * Mutually exclusive with `walletId` and `didUri`.
   * </pre>
   *
   * <code>string email = 1;</code>
   *
   * @return Whether the email field is set.
   */
  boolean hasEmail();
  /**
   *
   *
   * <pre>
   * Email address of account to delete.
   * Mutually exclusive with `walletId` and `didUri`.
   * </pre>
   *
   * <code>string email = 1;</code>
   *
   * @return The email.
   */
  java.lang.String getEmail();
  /**
   *
   *
   * <pre>
   * Email address of account to delete.
   * Mutually exclusive with `walletId` and `didUri`.
   * </pre>
   *
   * <code>string email = 1;</code>
   *
   * @return The bytes for email.
   */
  com.google.protobuf.ByteString getEmailBytes();

  /**
   *
   *
   * <pre>
   * Wallet ID of account to delete.
   * Mutually exclusive with `email` and `didUri`.
   * </pre>
   *
   * <code>string wallet_id = 2;</code>
   *
   * @return Whether the walletId field is set.
   */
  boolean hasWalletId();
  /**
   *
   *
   * <pre>
   * Wallet ID of account to delete.
   * Mutually exclusive with `email` and `didUri`.
   * </pre>
   *
   * <code>string wallet_id = 2;</code>
   *
   * @return The walletId.
   */
  java.lang.String getWalletId();
  /**
   *
   *
   * <pre>
   * Wallet ID of account to delete.
   * Mutually exclusive with `email` and `didUri`.
   * </pre>
   *
   * <code>string wallet_id = 2;</code>
   *
   * @return The bytes for walletId.
   */
  com.google.protobuf.ByteString getWalletIdBytes();

  /**
   *
   *
   * <pre>
   * DID URI of the account to delete.
   * Mutually exclusive with `email` and `walletId`.
   * </pre>
   *
   * <code>string did_uri = 4;</code>
   *
   * @return Whether the didUri field is set.
   */
  boolean hasDidUri();
  /**
   *
   *
   * <pre>
   * DID URI of the account to delete.
   * Mutually exclusive with `email` and `walletId`.
   * </pre>
   *
   * <code>string did_uri = 4;</code>
   *
   * @return The didUri.
   */
  java.lang.String getDidUri();
  /**
   *
   *
   * <pre>
   * DID URI of the account to delete.
   * Mutually exclusive with `email` and `walletId`.
   * </pre>
   *
   * <code>string did_uri = 4;</code>
   *
   * @return The bytes for didUri.
   */
  com.google.protobuf.ByteString getDidUriBytes();

  public trinsic.services.universalwallet.v1.DeleteWalletRequest.AccountCase getAccountCase();
}
