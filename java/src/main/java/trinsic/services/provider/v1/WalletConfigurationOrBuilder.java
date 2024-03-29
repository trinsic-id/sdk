// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/provider/v1/provider.proto

package trinsic.services.provider.v1;

public interface WalletConfigurationOrBuilder
    extends
    // @@protoc_insertion_point(interface_extends:services.provider.v1.WalletConfiguration)
    com.google.protobuf.MessageOrBuilder {

  /**
   *
   *
   * <pre>
   * Name/description of the wallet
   * </pre>
   *
   * <code>string name = 1;</code>
   *
   * @return The name.
   */
  java.lang.String getName();
  /**
   *
   *
   * <pre>
   * Name/description of the wallet
   * </pre>
   *
   * <code>string name = 1;</code>
   *
   * @return The bytes for name.
   */
  com.google.protobuf.ByteString getNameBytes();

  /**
   *
   *
   * <pre>
   * Deprecated and will be removed on August 1, 2023 -- use external_identities.
   * This field is set to the first email address present in `external_identities`, if any.
   * </pre>
   *
   * <code>string email = 2 [deprecated = true, (.services.options.optional) = true];</code>
   *
   * @deprecated services.provider.v1.WalletConfiguration.email is deprecated. See
   *     services/provider/v1/provider.proto;l=106
   * @return The email.
   */
  @java.lang.Deprecated
  java.lang.String getEmail();
  /**
   *
   *
   * <pre>
   * Deprecated and will be removed on August 1, 2023 -- use external_identities.
   * This field is set to the first email address present in `external_identities`, if any.
   * </pre>
   *
   * <code>string email = 2 [deprecated = true, (.services.options.optional) = true];</code>
   *
   * @deprecated services.provider.v1.WalletConfiguration.email is deprecated. See
   *     services/provider/v1/provider.proto;l=106
   * @return The bytes for email.
   */
  @java.lang.Deprecated
  com.google.protobuf.ByteString getEmailBytes();

  /**
   *
   *
   * <pre>
   * Deprecated -- use external_identities
   * </pre>
   *
   * <code>string sms = 3 [deprecated = true, (.services.options.optional) = true];</code>
   *
   * @deprecated services.provider.v1.WalletConfiguration.sms is deprecated. See
   *     services/provider/v1/provider.proto;l=108
   * @return The sms.
   */
  @java.lang.Deprecated
  java.lang.String getSms();
  /**
   *
   *
   * <pre>
   * Deprecated -- use external_identities
   * </pre>
   *
   * <code>string sms = 3 [deprecated = true, (.services.options.optional) = true];</code>
   *
   * @deprecated services.provider.v1.WalletConfiguration.sms is deprecated. See
   *     services/provider/v1/provider.proto;l=108
   * @return The bytes for sms.
   */
  @java.lang.Deprecated
  com.google.protobuf.ByteString getSmsBytes();

  /**
   * <code>string wallet_id = 4;</code>
   *
   * @return The walletId.
   */
  java.lang.String getWalletId();
  /**
   * <code>string wallet_id = 4;</code>
   *
   * @return The bytes for walletId.
   */
  com.google.protobuf.ByteString getWalletIdBytes();

  /**
   *
   *
   * <pre>
   * The DID of the wallet
   * </pre>
   *
   * <code>string public_did = 5;</code>
   *
   * @return The publicDid.
   */
  java.lang.String getPublicDid();
  /**
   *
   *
   * <pre>
   * The DID of the wallet
   * </pre>
   *
   * <code>string public_did = 5;</code>
   *
   * @return The bytes for publicDid.
   */
  com.google.protobuf.ByteString getPublicDidBytes();

  /**
   * <code>string config_type = 6;</code>
   *
   * @return The configType.
   */
  java.lang.String getConfigType();
  /**
   * <code>string config_type = 6;</code>
   *
   * @return The bytes for configType.
   */
  com.google.protobuf.ByteString getConfigTypeBytes();

  /**
   *
   *
   * <pre>
   * List of active authentication tokens for this wallet.
   * This list does not contain the issued token, only metadata
   * such as ID, description, and creation date.
   * </pre>
   *
   * <code>repeated .services.account.v1.WalletAuthToken auth_tokens = 7;</code>
   */
  java.util.List<trinsic.services.account.v1.WalletAuthToken> getAuthTokensList();
  /**
   *
   *
   * <pre>
   * List of active authentication tokens for this wallet.
   * This list does not contain the issued token, only metadata
   * such as ID, description, and creation date.
   * </pre>
   *
   * <code>repeated .services.account.v1.WalletAuthToken auth_tokens = 7;</code>
   */
  trinsic.services.account.v1.WalletAuthToken getAuthTokens(int index);
  /**
   *
   *
   * <pre>
   * List of active authentication tokens for this wallet.
   * This list does not contain the issued token, only metadata
   * such as ID, description, and creation date.
   * </pre>
   *
   * <code>repeated .services.account.v1.WalletAuthToken auth_tokens = 7;</code>
   */
  int getAuthTokensCount();
  /**
   *
   *
   * <pre>
   * List of active authentication tokens for this wallet.
   * This list does not contain the issued token, only metadata
   * such as ID, description, and creation date.
   * </pre>
   *
   * <code>repeated .services.account.v1.WalletAuthToken auth_tokens = 7;</code>
   */
  java.util.List<? extends trinsic.services.account.v1.WalletAuthTokenOrBuilder>
      getAuthTokensOrBuilderList();
  /**
   *
   *
   * <pre>
   * List of active authentication tokens for this wallet.
   * This list does not contain the issued token, only metadata
   * such as ID, description, and creation date.
   * </pre>
   *
   * <code>repeated .services.account.v1.WalletAuthToken auth_tokens = 7;</code>
   */
  trinsic.services.account.v1.WalletAuthTokenOrBuilder getAuthTokensOrBuilder(int index);

  /**
   *
   *
   * <pre>
   * List of external identity IDs (email addresses, phone numbers, etc.) associated with this wallet.
   * This is deprecated; use `external_identities` instead.
   * </pre>
   *
   * <code>repeated string external_identity_ids = 8 [deprecated = true];</code>
   *
   * @deprecated services.provider.v1.WalletConfiguration.external_identity_ids is deprecated. See
   *     services/provider/v1/provider.proto;l=120
   * @return A list containing the externalIdentityIds.
   */
  @java.lang.Deprecated
  java.util.List<java.lang.String> getExternalIdentityIdsList();
  /**
   *
   *
   * <pre>
   * List of external identity IDs (email addresses, phone numbers, etc.) associated with this wallet.
   * This is deprecated; use `external_identities` instead.
   * </pre>
   *
   * <code>repeated string external_identity_ids = 8 [deprecated = true];</code>
   *
   * @deprecated services.provider.v1.WalletConfiguration.external_identity_ids is deprecated. See
   *     services/provider/v1/provider.proto;l=120
   * @return The count of externalIdentityIds.
   */
  @java.lang.Deprecated
  int getExternalIdentityIdsCount();
  /**
   *
   *
   * <pre>
   * List of external identity IDs (email addresses, phone numbers, etc.) associated with this wallet.
   * This is deprecated; use `external_identities` instead.
   * </pre>
   *
   * <code>repeated string external_identity_ids = 8 [deprecated = true];</code>
   *
   * @deprecated services.provider.v1.WalletConfiguration.external_identity_ids is deprecated. See
   *     services/provider/v1/provider.proto;l=120
   * @param index The index of the element to return.
   * @return The externalIdentityIds at the given index.
   */
  @java.lang.Deprecated
  java.lang.String getExternalIdentityIds(int index);
  /**
   *
   *
   * <pre>
   * List of external identity IDs (email addresses, phone numbers, etc.) associated with this wallet.
   * This is deprecated; use `external_identities` instead.
   * </pre>
   *
   * <code>repeated string external_identity_ids = 8 [deprecated = true];</code>
   *
   * @deprecated services.provider.v1.WalletConfiguration.external_identity_ids is deprecated. See
   *     services/provider/v1/provider.proto;l=120
   * @param index The index of the value to return.
   * @return The bytes of the externalIdentityIds at the given index.
   */
  @java.lang.Deprecated
  com.google.protobuf.ByteString getExternalIdentityIdsBytes(int index);

  /**
   *
   *
   * <pre>
   * Ecosystem in which this wallet is contained.
   * </pre>
   *
   * <code>string ecosystem_id = 9;</code>
   *
   * @return The ecosystemId.
   */
  java.lang.String getEcosystemId();
  /**
   *
   *
   * <pre>
   * Ecosystem in which this wallet is contained.
   * </pre>
   *
   * <code>string ecosystem_id = 9;</code>
   *
   * @return The bytes for ecosystemId.
   */
  com.google.protobuf.ByteString getEcosystemIdBytes();

  /**
   * <code>string description = 10;</code>
   *
   * @return The description.
   */
  java.lang.String getDescription();
  /**
   * <code>string description = 10;</code>
   *
   * @return The bytes for description.
   */
  com.google.protobuf.ByteString getDescriptionBytes();

  /**
   *
   *
   * <pre>
   * List of external identities associated with this wallet.
   * </pre>
   *
   * <code>repeated .services.provider.v1.WalletExternalIdentity external_identities = 11;</code>
   */
  java.util.List<trinsic.services.provider.v1.WalletExternalIdentity> getExternalIdentitiesList();
  /**
   *
   *
   * <pre>
   * List of external identities associated with this wallet.
   * </pre>
   *
   * <code>repeated .services.provider.v1.WalletExternalIdentity external_identities = 11;</code>
   */
  trinsic.services.provider.v1.WalletExternalIdentity getExternalIdentities(int index);
  /**
   *
   *
   * <pre>
   * List of external identities associated with this wallet.
   * </pre>
   *
   * <code>repeated .services.provider.v1.WalletExternalIdentity external_identities = 11;</code>
   */
  int getExternalIdentitiesCount();
  /**
   *
   *
   * <pre>
   * List of external identities associated with this wallet.
   * </pre>
   *
   * <code>repeated .services.provider.v1.WalletExternalIdentity external_identities = 11;</code>
   */
  java.util.List<? extends trinsic.services.provider.v1.WalletExternalIdentityOrBuilder>
      getExternalIdentitiesOrBuilderList();
  /**
   *
   *
   * <pre>
   * List of external identities associated with this wallet.
   * </pre>
   *
   * <code>repeated .services.provider.v1.WalletExternalIdentity external_identities = 11;</code>
   */
  trinsic.services.provider.v1.WalletExternalIdentityOrBuilder getExternalIdentitiesOrBuilder(
      int index);
}
