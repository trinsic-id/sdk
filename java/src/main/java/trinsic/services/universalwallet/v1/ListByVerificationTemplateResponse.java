// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/universal-wallet/v1/universal-wallet.proto

package trinsic.services.universalwallet.v1;

/**
 *
 *
 * <pre>
 * Response to `ListByVerificationTemplateRequest`
 * </pre>
 *
 * Protobuf type {@code services.universalwallet.v1.ListByVerificationTemplateResponse}
 */
public final class ListByVerificationTemplateResponse extends com.google.protobuf.GeneratedMessageV3
    implements
    // @@protoc_insertion_point(message_implements:services.universalwallet.v1.ListByVerificationTemplateResponse)
    ListByVerificationTemplateResponseOrBuilder {
  private static final long serialVersionUID = 0L;
  // Use ListByVerificationTemplateResponse.newBuilder() to construct.
  private ListByVerificationTemplateResponse(
      com.google.protobuf.GeneratedMessageV3.Builder<?> builder) {
    super(builder);
  }

  private ListByVerificationTemplateResponse() {
    items_ = com.google.protobuf.LazyStringArrayList.EMPTY;
    continuationToken_ = "";
  }

  @java.lang.Override
  @SuppressWarnings({"unused"})
  protected java.lang.Object newInstance(UnusedPrivateParameter unused) {
    return new ListByVerificationTemplateResponse();
  }

  @java.lang.Override
  public final com.google.protobuf.UnknownFieldSet getUnknownFields() {
    return this.unknownFields;
  }

  public static final com.google.protobuf.Descriptors.Descriptor getDescriptor() {
    return trinsic.services.universalwallet.v1.UniversalWalletOuterClass
        .internal_static_services_universalwallet_v1_ListByVerificationTemplateResponse_descriptor;
  }

  @java.lang.Override
  protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internalGetFieldAccessorTable() {
    return trinsic.services.universalwallet.v1.UniversalWalletOuterClass
        .internal_static_services_universalwallet_v1_ListByVerificationTemplateResponse_fieldAccessorTable
        .ensureFieldAccessorsInitialized(
            trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse.class,
            trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse.Builder.class);
  }

  public static final int ITEMS_FIELD_NUMBER = 1;
  private com.google.protobuf.LazyStringList items_;
  /**
   *
   *
   * <pre>
   * Array of query results, as JSON strings
   * </pre>
   *
   * <code>repeated string items = 1;</code>
   *
   * @return A list containing the items.
   */
  public com.google.protobuf.ProtocolStringList getItemsList() {
    return items_;
  }
  /**
   *
   *
   * <pre>
   * Array of query results, as JSON strings
   * </pre>
   *
   * <code>repeated string items = 1;</code>
   *
   * @return The count of items.
   */
  public int getItemsCount() {
    return items_.size();
  }
  /**
   *
   *
   * <pre>
   * Array of query results, as JSON strings
   * </pre>
   *
   * <code>repeated string items = 1;</code>
   *
   * @param index The index of the element to return.
   * @return The items at the given index.
   */
  public java.lang.String getItems(int index) {
    return items_.get(index);
  }
  /**
   *
   *
   * <pre>
   * Array of query results, as JSON strings
   * </pre>
   *
   * <code>repeated string items = 1;</code>
   *
   * @param index The index of the value to return.
   * @return The bytes of the items at the given index.
   */
  public com.google.protobuf.ByteString getItemsBytes(int index) {
    return items_.getByteString(index);
  }

  public static final int HAS_MORE_RESULTS_FIELD_NUMBER = 2;
  private boolean hasMoreResults_;
  /**
   *
   *
   * <pre>
   * Whether more results are available for this query via `continuation_token`
   * </pre>
   *
   * <code>bool has_more_results = 2;</code>
   *
   * @return The hasMoreResults.
   */
  @java.lang.Override
  public boolean getHasMoreResults() {
    return hasMoreResults_;
  }

  public static final int CONTINUATION_TOKEN_FIELD_NUMBER = 3;
  private volatile java.lang.Object continuationToken_;
  /**
   *
   *
   * <pre>
   * Token to fetch next set of results via `ListByVerificationTemplateRequest`
   * </pre>
   *
   * <code>string continuation_token = 3;</code>
   *
   * @return The continuationToken.
   */
  @java.lang.Override
  public java.lang.String getContinuationToken() {
    java.lang.Object ref = continuationToken_;
    if (ref instanceof java.lang.String) {
      return (java.lang.String) ref;
    } else {
      com.google.protobuf.ByteString bs = (com.google.protobuf.ByteString) ref;
      java.lang.String s = bs.toStringUtf8();
      continuationToken_ = s;
      return s;
    }
  }
  /**
   *
   *
   * <pre>
   * Token to fetch next set of results via `ListByVerificationTemplateRequest`
   * </pre>
   *
   * <code>string continuation_token = 3;</code>
   *
   * @return The bytes for continuationToken.
   */
  @java.lang.Override
  public com.google.protobuf.ByteString getContinuationTokenBytes() {
    java.lang.Object ref = continuationToken_;
    if (ref instanceof java.lang.String) {
      com.google.protobuf.ByteString b =
          com.google.protobuf.ByteString.copyFromUtf8((java.lang.String) ref);
      continuationToken_ = b;
      return b;
    } else {
      return (com.google.protobuf.ByteString) ref;
    }
  }

  private byte memoizedIsInitialized = -1;

  @java.lang.Override
  public final boolean isInitialized() {
    byte isInitialized = memoizedIsInitialized;
    if (isInitialized == 1) return true;
    if (isInitialized == 0) return false;

    memoizedIsInitialized = 1;
    return true;
  }

  @java.lang.Override
  public void writeTo(com.google.protobuf.CodedOutputStream output) throws java.io.IOException {
    for (int i = 0; i < items_.size(); i++) {
      com.google.protobuf.GeneratedMessageV3.writeString(output, 1, items_.getRaw(i));
    }
    if (hasMoreResults_ != false) {
      output.writeBool(2, hasMoreResults_);
    }
    if (!com.google.protobuf.GeneratedMessageV3.isStringEmpty(continuationToken_)) {
      com.google.protobuf.GeneratedMessageV3.writeString(output, 3, continuationToken_);
    }
    getUnknownFields().writeTo(output);
  }

  @java.lang.Override
  public int getSerializedSize() {
    int size = memoizedSize;
    if (size != -1) return size;

    size = 0;
    {
      int dataSize = 0;
      for (int i = 0; i < items_.size(); i++) {
        dataSize += computeStringSizeNoTag(items_.getRaw(i));
      }
      size += dataSize;
      size += 1 * getItemsList().size();
    }
    if (hasMoreResults_ != false) {
      size += com.google.protobuf.CodedOutputStream.computeBoolSize(2, hasMoreResults_);
    }
    if (!com.google.protobuf.GeneratedMessageV3.isStringEmpty(continuationToken_)) {
      size += com.google.protobuf.GeneratedMessageV3.computeStringSize(3, continuationToken_);
    }
    size += getUnknownFields().getSerializedSize();
    memoizedSize = size;
    return size;
  }

  @java.lang.Override
  public boolean equals(final java.lang.Object obj) {
    if (obj == this) {
      return true;
    }
    if (!(obj instanceof trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse)) {
      return super.equals(obj);
    }
    trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse other =
        (trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse) obj;

    if (!getItemsList().equals(other.getItemsList())) return false;
    if (getHasMoreResults() != other.getHasMoreResults()) return false;
    if (!getContinuationToken().equals(other.getContinuationToken())) return false;
    if (!getUnknownFields().equals(other.getUnknownFields())) return false;
    return true;
  }

  @java.lang.Override
  public int hashCode() {
    if (memoizedHashCode != 0) {
      return memoizedHashCode;
    }
    int hash = 41;
    hash = (19 * hash) + getDescriptor().hashCode();
    if (getItemsCount() > 0) {
      hash = (37 * hash) + ITEMS_FIELD_NUMBER;
      hash = (53 * hash) + getItemsList().hashCode();
    }
    hash = (37 * hash) + HAS_MORE_RESULTS_FIELD_NUMBER;
    hash = (53 * hash) + com.google.protobuf.Internal.hashBoolean(getHasMoreResults());
    hash = (37 * hash) + CONTINUATION_TOKEN_FIELD_NUMBER;
    hash = (53 * hash) + getContinuationToken().hashCode();
    hash = (29 * hash) + getUnknownFields().hashCode();
    memoizedHashCode = hash;
    return hash;
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse parseFrom(
      java.nio.ByteBuffer data) throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse parseFrom(
      java.nio.ByteBuffer data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse parseFrom(
      byte[] data) throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse parseFrom(
      byte[] data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse parseFrom(
      java.io.InputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(PARSER, input);
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse parseFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(
        PARSER, input, extensionRegistry);
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse
      parseDelimitedFrom(java.io.InputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseDelimitedWithIOException(PARSER, input);
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse
      parseDelimitedFrom(
          java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
          throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseDelimitedWithIOException(
        PARSER, input, extensionRegistry);
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse parseFrom(
      com.google.protobuf.CodedInputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(PARSER, input);
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse parseFrom(
      com.google.protobuf.CodedInputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(
        PARSER, input, extensionRegistry);
  }

  @java.lang.Override
  public Builder newBuilderForType() {
    return newBuilder();
  }

  public static Builder newBuilder() {
    return DEFAULT_INSTANCE.toBuilder();
  }

  public static Builder newBuilder(
      trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse prototype) {
    return DEFAULT_INSTANCE.toBuilder().mergeFrom(prototype);
  }

  @java.lang.Override
  public Builder toBuilder() {
    return this == DEFAULT_INSTANCE ? new Builder() : new Builder().mergeFrom(this);
  }

  @java.lang.Override
  protected Builder newBuilderForType(com.google.protobuf.GeneratedMessageV3.BuilderParent parent) {
    Builder builder = new Builder(parent);
    return builder;
  }
  /**
   *
   *
   * <pre>
   * Response to `ListByVerificationTemplateRequest`
   * </pre>
   *
   * Protobuf type {@code services.universalwallet.v1.ListByVerificationTemplateResponse}
   */
  public static final class Builder extends com.google.protobuf.GeneratedMessageV3.Builder<Builder>
      implements
      // @@protoc_insertion_point(builder_implements:services.universalwallet.v1.ListByVerificationTemplateResponse)
      trinsic.services.universalwallet.v1.ListByVerificationTemplateResponseOrBuilder {
    public static final com.google.protobuf.Descriptors.Descriptor getDescriptor() {
      return trinsic.services.universalwallet.v1.UniversalWalletOuterClass
          .internal_static_services_universalwallet_v1_ListByVerificationTemplateResponse_descriptor;
    }

    @java.lang.Override
    protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
        internalGetFieldAccessorTable() {
      return trinsic.services.universalwallet.v1.UniversalWalletOuterClass
          .internal_static_services_universalwallet_v1_ListByVerificationTemplateResponse_fieldAccessorTable
          .ensureFieldAccessorsInitialized(
              trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse.class,
              trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse.Builder.class);
    }

    // Construct using
    // trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse.newBuilder()
    private Builder() {}

    private Builder(com.google.protobuf.GeneratedMessageV3.BuilderParent parent) {
      super(parent);
    }

    @java.lang.Override
    public Builder clear() {
      super.clear();
      items_ = com.google.protobuf.LazyStringArrayList.EMPTY;
      bitField0_ = (bitField0_ & ~0x00000001);
      hasMoreResults_ = false;

      continuationToken_ = "";

      return this;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.Descriptor getDescriptorForType() {
      return trinsic.services.universalwallet.v1.UniversalWalletOuterClass
          .internal_static_services_universalwallet_v1_ListByVerificationTemplateResponse_descriptor;
    }

    @java.lang.Override
    public trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse
        getDefaultInstanceForType() {
      return trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse
          .getDefaultInstance();
    }

    @java.lang.Override
    public trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse build() {
      trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse result =
          buildPartial();
      if (!result.isInitialized()) {
        throw newUninitializedMessageException(result);
      }
      return result;
    }

    @java.lang.Override
    public trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse buildPartial() {
      trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse result =
          new trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse(this);
      int from_bitField0_ = bitField0_;
      if (((bitField0_ & 0x00000001) != 0)) {
        items_ = items_.getUnmodifiableView();
        bitField0_ = (bitField0_ & ~0x00000001);
      }
      result.items_ = items_;
      result.hasMoreResults_ = hasMoreResults_;
      result.continuationToken_ = continuationToken_;
      onBuilt();
      return result;
    }

    @java.lang.Override
    public Builder clone() {
      return super.clone();
    }

    @java.lang.Override
    public Builder setField(
        com.google.protobuf.Descriptors.FieldDescriptor field, java.lang.Object value) {
      return super.setField(field, value);
    }

    @java.lang.Override
    public Builder clearField(com.google.protobuf.Descriptors.FieldDescriptor field) {
      return super.clearField(field);
    }

    @java.lang.Override
    public Builder clearOneof(com.google.protobuf.Descriptors.OneofDescriptor oneof) {
      return super.clearOneof(oneof);
    }

    @java.lang.Override
    public Builder setRepeatedField(
        com.google.protobuf.Descriptors.FieldDescriptor field, int index, java.lang.Object value) {
      return super.setRepeatedField(field, index, value);
    }

    @java.lang.Override
    public Builder addRepeatedField(
        com.google.protobuf.Descriptors.FieldDescriptor field, java.lang.Object value) {
      return super.addRepeatedField(field, value);
    }

    @java.lang.Override
    public Builder mergeFrom(com.google.protobuf.Message other) {
      if (other instanceof trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse) {
        return mergeFrom(
            (trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse) other);
      } else {
        super.mergeFrom(other);
        return this;
      }
    }

    public Builder mergeFrom(
        trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse other) {
      if (other
          == trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse
              .getDefaultInstance()) return this;
      if (!other.items_.isEmpty()) {
        if (items_.isEmpty()) {
          items_ = other.items_;
          bitField0_ = (bitField0_ & ~0x00000001);
        } else {
          ensureItemsIsMutable();
          items_.addAll(other.items_);
        }
        onChanged();
      }
      if (other.getHasMoreResults() != false) {
        setHasMoreResults(other.getHasMoreResults());
      }
      if (!other.getContinuationToken().isEmpty()) {
        continuationToken_ = other.continuationToken_;
        onChanged();
      }
      this.mergeUnknownFields(other.getUnknownFields());
      onChanged();
      return this;
    }

    @java.lang.Override
    public final boolean isInitialized() {
      return true;
    }

    @java.lang.Override
    public Builder mergeFrom(
        com.google.protobuf.CodedInputStream input,
        com.google.protobuf.ExtensionRegistryLite extensionRegistry)
        throws java.io.IOException {
      if (extensionRegistry == null) {
        throw new java.lang.NullPointerException();
      }
      try {
        boolean done = false;
        while (!done) {
          int tag = input.readTag();
          switch (tag) {
            case 0:
              done = true;
              break;
            case 10:
              {
                java.lang.String s = input.readStringRequireUtf8();
                ensureItemsIsMutable();
                items_.add(s);
                break;
              } // case 10
            case 16:
              {
                hasMoreResults_ = input.readBool();

                break;
              } // case 16
            case 26:
              {
                continuationToken_ = input.readStringRequireUtf8();

                break;
              } // case 26
            default:
              {
                if (!super.parseUnknownField(input, extensionRegistry, tag)) {
                  done = true; // was an endgroup tag
                }
                break;
              } // default:
          } // switch (tag)
        } // while (!done)
      } catch (com.google.protobuf.InvalidProtocolBufferException e) {
        throw e.unwrapIOException();
      } finally {
        onChanged();
      } // finally
      return this;
    }

    private int bitField0_;

    private com.google.protobuf.LazyStringList items_ =
        com.google.protobuf.LazyStringArrayList.EMPTY;

    private void ensureItemsIsMutable() {
      if (!((bitField0_ & 0x00000001) != 0)) {
        items_ = new com.google.protobuf.LazyStringArrayList(items_);
        bitField0_ |= 0x00000001;
      }
    }
    /**
     *
     *
     * <pre>
     * Array of query results, as JSON strings
     * </pre>
     *
     * <code>repeated string items = 1;</code>
     *
     * @return A list containing the items.
     */
    public com.google.protobuf.ProtocolStringList getItemsList() {
      return items_.getUnmodifiableView();
    }
    /**
     *
     *
     * <pre>
     * Array of query results, as JSON strings
     * </pre>
     *
     * <code>repeated string items = 1;</code>
     *
     * @return The count of items.
     */
    public int getItemsCount() {
      return items_.size();
    }
    /**
     *
     *
     * <pre>
     * Array of query results, as JSON strings
     * </pre>
     *
     * <code>repeated string items = 1;</code>
     *
     * @param index The index of the element to return.
     * @return The items at the given index.
     */
    public java.lang.String getItems(int index) {
      return items_.get(index);
    }
    /**
     *
     *
     * <pre>
     * Array of query results, as JSON strings
     * </pre>
     *
     * <code>repeated string items = 1;</code>
     *
     * @param index The index of the value to return.
     * @return The bytes of the items at the given index.
     */
    public com.google.protobuf.ByteString getItemsBytes(int index) {
      return items_.getByteString(index);
    }
    /**
     *
     *
     * <pre>
     * Array of query results, as JSON strings
     * </pre>
     *
     * <code>repeated string items = 1;</code>
     *
     * @param index The index to set the value at.
     * @param value The items to set.
     * @return This builder for chaining.
     */
    public Builder setItems(int index, java.lang.String value) {
      if (value == null) {
        throw new NullPointerException();
      }
      ensureItemsIsMutable();
      items_.set(index, value);
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * Array of query results, as JSON strings
     * </pre>
     *
     * <code>repeated string items = 1;</code>
     *
     * @param value The items to add.
     * @return This builder for chaining.
     */
    public Builder addItems(java.lang.String value) {
      if (value == null) {
        throw new NullPointerException();
      }
      ensureItemsIsMutable();
      items_.add(value);
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * Array of query results, as JSON strings
     * </pre>
     *
     * <code>repeated string items = 1;</code>
     *
     * @param values The items to add.
     * @return This builder for chaining.
     */
    public Builder addAllItems(java.lang.Iterable<java.lang.String> values) {
      ensureItemsIsMutable();
      com.google.protobuf.AbstractMessageLite.Builder.addAll(values, items_);
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * Array of query results, as JSON strings
     * </pre>
     *
     * <code>repeated string items = 1;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearItems() {
      items_ = com.google.protobuf.LazyStringArrayList.EMPTY;
      bitField0_ = (bitField0_ & ~0x00000001);
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * Array of query results, as JSON strings
     * </pre>
     *
     * <code>repeated string items = 1;</code>
     *
     * @param value The bytes of the items to add.
     * @return This builder for chaining.
     */
    public Builder addItemsBytes(com.google.protobuf.ByteString value) {
      if (value == null) {
        throw new NullPointerException();
      }
      checkByteStringIsUtf8(value);
      ensureItemsIsMutable();
      items_.add(value);
      onChanged();
      return this;
    }

    private boolean hasMoreResults_;
    /**
     *
     *
     * <pre>
     * Whether more results are available for this query via `continuation_token`
     * </pre>
     *
     * <code>bool has_more_results = 2;</code>
     *
     * @return The hasMoreResults.
     */
    @java.lang.Override
    public boolean getHasMoreResults() {
      return hasMoreResults_;
    }
    /**
     *
     *
     * <pre>
     * Whether more results are available for this query via `continuation_token`
     * </pre>
     *
     * <code>bool has_more_results = 2;</code>
     *
     * @param value The hasMoreResults to set.
     * @return This builder for chaining.
     */
    public Builder setHasMoreResults(boolean value) {

      hasMoreResults_ = value;
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * Whether more results are available for this query via `continuation_token`
     * </pre>
     *
     * <code>bool has_more_results = 2;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearHasMoreResults() {

      hasMoreResults_ = false;
      onChanged();
      return this;
    }

    private java.lang.Object continuationToken_ = "";
    /**
     *
     *
     * <pre>
     * Token to fetch next set of results via `ListByVerificationTemplateRequest`
     * </pre>
     *
     * <code>string continuation_token = 3;</code>
     *
     * @return The continuationToken.
     */
    public java.lang.String getContinuationToken() {
      java.lang.Object ref = continuationToken_;
      if (!(ref instanceof java.lang.String)) {
        com.google.protobuf.ByteString bs = (com.google.protobuf.ByteString) ref;
        java.lang.String s = bs.toStringUtf8();
        continuationToken_ = s;
        return s;
      } else {
        return (java.lang.String) ref;
      }
    }
    /**
     *
     *
     * <pre>
     * Token to fetch next set of results via `ListByVerificationTemplateRequest`
     * </pre>
     *
     * <code>string continuation_token = 3;</code>
     *
     * @return The bytes for continuationToken.
     */
    public com.google.protobuf.ByteString getContinuationTokenBytes() {
      java.lang.Object ref = continuationToken_;
      if (ref instanceof String) {
        com.google.protobuf.ByteString b =
            com.google.protobuf.ByteString.copyFromUtf8((java.lang.String) ref);
        continuationToken_ = b;
        return b;
      } else {
        return (com.google.protobuf.ByteString) ref;
      }
    }
    /**
     *
     *
     * <pre>
     * Token to fetch next set of results via `ListByVerificationTemplateRequest`
     * </pre>
     *
     * <code>string continuation_token = 3;</code>
     *
     * @param value The continuationToken to set.
     * @return This builder for chaining.
     */
    public Builder setContinuationToken(java.lang.String value) {
      if (value == null) {
        throw new NullPointerException();
      }

      continuationToken_ = value;
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * Token to fetch next set of results via `ListByVerificationTemplateRequest`
     * </pre>
     *
     * <code>string continuation_token = 3;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearContinuationToken() {

      continuationToken_ = getDefaultInstance().getContinuationToken();
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * Token to fetch next set of results via `ListByVerificationTemplateRequest`
     * </pre>
     *
     * <code>string continuation_token = 3;</code>
     *
     * @param value The bytes for continuationToken to set.
     * @return This builder for chaining.
     */
    public Builder setContinuationTokenBytes(com.google.protobuf.ByteString value) {
      if (value == null) {
        throw new NullPointerException();
      }
      checkByteStringIsUtf8(value);

      continuationToken_ = value;
      onChanged();
      return this;
    }

    @java.lang.Override
    public final Builder setUnknownFields(final com.google.protobuf.UnknownFieldSet unknownFields) {
      return super.setUnknownFields(unknownFields);
    }

    @java.lang.Override
    public final Builder mergeUnknownFields(
        final com.google.protobuf.UnknownFieldSet unknownFields) {
      return super.mergeUnknownFields(unknownFields);
    }

    // @@protoc_insertion_point(builder_scope:services.universalwallet.v1.ListByVerificationTemplateResponse)
  }

  // @@protoc_insertion_point(class_scope:services.universalwallet.v1.ListByVerificationTemplateResponse)
  private static final trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse
      DEFAULT_INSTANCE;

  static {
    DEFAULT_INSTANCE = new trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse();
  }

  public static trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse
      getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static final com.google.protobuf.Parser<ListByVerificationTemplateResponse> PARSER =
      new com.google.protobuf.AbstractParser<ListByVerificationTemplateResponse>() {
        @java.lang.Override
        public ListByVerificationTemplateResponse parsePartialFrom(
            com.google.protobuf.CodedInputStream input,
            com.google.protobuf.ExtensionRegistryLite extensionRegistry)
            throws com.google.protobuf.InvalidProtocolBufferException {
          Builder builder = newBuilder();
          try {
            builder.mergeFrom(input, extensionRegistry);
          } catch (com.google.protobuf.InvalidProtocolBufferException e) {
            throw e.setUnfinishedMessage(builder.buildPartial());
          } catch (com.google.protobuf.UninitializedMessageException e) {
            throw e.asInvalidProtocolBufferException().setUnfinishedMessage(builder.buildPartial());
          } catch (java.io.IOException e) {
            throw new com.google.protobuf.InvalidProtocolBufferException(e)
                .setUnfinishedMessage(builder.buildPartial());
          }
          return builder.buildPartial();
        }
      };

  public static com.google.protobuf.Parser<ListByVerificationTemplateResponse> parser() {
    return PARSER;
  }

  @java.lang.Override
  public com.google.protobuf.Parser<ListByVerificationTemplateResponse> getParserForType() {
    return PARSER;
  }

  @java.lang.Override
  public trinsic.services.universalwallet.v1.ListByVerificationTemplateResponse
      getDefaultInstanceForType() {
    return DEFAULT_INSTANCE;
  }
}
