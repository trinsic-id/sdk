// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/universal-wallet/v1/universal-wallet.proto

package trinsic.services.universalwallet.v1;

/**
 *
 *
 * <pre>
 * Response to `InsertItemRequest`
 * </pre>
 *
 * Protobuf type {@code services.universalwallet.v1.InsertItemResponse}
 */
public final class InsertItemResponse extends com.google.protobuf.GeneratedMessageV3
    implements
    // @@protoc_insertion_point(message_implements:services.universalwallet.v1.InsertItemResponse)
    InsertItemResponseOrBuilder {
  private static final long serialVersionUID = 0L;
  // Use InsertItemResponse.newBuilder() to construct.
  private InsertItemResponse(com.google.protobuf.GeneratedMessageV3.Builder<?> builder) {
    super(builder);
  }

  private InsertItemResponse() {
    itemId_ = "";
  }

  @java.lang.Override
  @SuppressWarnings({"unused"})
  protected java.lang.Object newInstance(UnusedPrivateParameter unused) {
    return new InsertItemResponse();
  }

  @java.lang.Override
  public final com.google.protobuf.UnknownFieldSet getUnknownFields() {
    return this.unknownFields;
  }

  public static final com.google.protobuf.Descriptors.Descriptor getDescriptor() {
    return trinsic.services.universalwallet.v1.UniversalWalletOuterClass
        .internal_static_services_universalwallet_v1_InsertItemResponse_descriptor;
  }

  @java.lang.Override
  protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internalGetFieldAccessorTable() {
    return trinsic.services.universalwallet.v1.UniversalWalletOuterClass
        .internal_static_services_universalwallet_v1_InsertItemResponse_fieldAccessorTable
        .ensureFieldAccessorsInitialized(
            trinsic.services.universalwallet.v1.InsertItemResponse.class,
            trinsic.services.universalwallet.v1.InsertItemResponse.Builder.class);
  }

  public static final int ITEM_ID_FIELD_NUMBER = 2;
  private volatile java.lang.Object itemId_;
  /**
   *
   *
   * <pre>
   * ID of item inserted into wallet
   * </pre>
   *
   * <code>string item_id = 2;</code>
   *
   * @return The itemId.
   */
  @java.lang.Override
  public java.lang.String getItemId() {
    java.lang.Object ref = itemId_;
    if (ref instanceof java.lang.String) {
      return (java.lang.String) ref;
    } else {
      com.google.protobuf.ByteString bs = (com.google.protobuf.ByteString) ref;
      java.lang.String s = bs.toStringUtf8();
      itemId_ = s;
      return s;
    }
  }
  /**
   *
   *
   * <pre>
   * ID of item inserted into wallet
   * </pre>
   *
   * <code>string item_id = 2;</code>
   *
   * @return The bytes for itemId.
   */
  @java.lang.Override
  public com.google.protobuf.ByteString getItemIdBytes() {
    java.lang.Object ref = itemId_;
    if (ref instanceof java.lang.String) {
      com.google.protobuf.ByteString b =
          com.google.protobuf.ByteString.copyFromUtf8((java.lang.String) ref);
      itemId_ = b;
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
    if (!com.google.protobuf.GeneratedMessageV3.isStringEmpty(itemId_)) {
      com.google.protobuf.GeneratedMessageV3.writeString(output, 2, itemId_);
    }
    getUnknownFields().writeTo(output);
  }

  @java.lang.Override
  public int getSerializedSize() {
    int size = memoizedSize;
    if (size != -1) return size;

    size = 0;
    if (!com.google.protobuf.GeneratedMessageV3.isStringEmpty(itemId_)) {
      size += com.google.protobuf.GeneratedMessageV3.computeStringSize(2, itemId_);
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
    if (!(obj instanceof trinsic.services.universalwallet.v1.InsertItemResponse)) {
      return super.equals(obj);
    }
    trinsic.services.universalwallet.v1.InsertItemResponse other =
        (trinsic.services.universalwallet.v1.InsertItemResponse) obj;

    if (!getItemId().equals(other.getItemId())) return false;
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
    hash = (37 * hash) + ITEM_ID_FIELD_NUMBER;
    hash = (53 * hash) + getItemId().hashCode();
    hash = (29 * hash) + getUnknownFields().hashCode();
    memoizedHashCode = hash;
    return hash;
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse parseFrom(
      java.nio.ByteBuffer data) throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse parseFrom(
      java.nio.ByteBuffer data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse parseFrom(
      byte[] data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse parseFrom(
      java.io.InputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(PARSER, input);
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse parseFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(
        PARSER, input, extensionRegistry);
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse parseDelimitedFrom(
      java.io.InputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseDelimitedWithIOException(PARSER, input);
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse parseDelimitedFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseDelimitedWithIOException(
        PARSER, input, extensionRegistry);
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse parseFrom(
      com.google.protobuf.CodedInputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(PARSER, input);
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse parseFrom(
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
      trinsic.services.universalwallet.v1.InsertItemResponse prototype) {
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
   * Response to `InsertItemRequest`
   * </pre>
   *
   * Protobuf type {@code services.universalwallet.v1.InsertItemResponse}
   */
  public static final class Builder extends com.google.protobuf.GeneratedMessageV3.Builder<Builder>
      implements
      // @@protoc_insertion_point(builder_implements:services.universalwallet.v1.InsertItemResponse)
      trinsic.services.universalwallet.v1.InsertItemResponseOrBuilder {
    public static final com.google.protobuf.Descriptors.Descriptor getDescriptor() {
      return trinsic.services.universalwallet.v1.UniversalWalletOuterClass
          .internal_static_services_universalwallet_v1_InsertItemResponse_descriptor;
    }

    @java.lang.Override
    protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
        internalGetFieldAccessorTable() {
      return trinsic.services.universalwallet.v1.UniversalWalletOuterClass
          .internal_static_services_universalwallet_v1_InsertItemResponse_fieldAccessorTable
          .ensureFieldAccessorsInitialized(
              trinsic.services.universalwallet.v1.InsertItemResponse.class,
              trinsic.services.universalwallet.v1.InsertItemResponse.Builder.class);
    }

    // Construct using trinsic.services.universalwallet.v1.InsertItemResponse.newBuilder()
    private Builder() {}

    private Builder(com.google.protobuf.GeneratedMessageV3.BuilderParent parent) {
      super(parent);
    }

    @java.lang.Override
    public Builder clear() {
      super.clear();
      itemId_ = "";

      return this;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.Descriptor getDescriptorForType() {
      return trinsic.services.universalwallet.v1.UniversalWalletOuterClass
          .internal_static_services_universalwallet_v1_InsertItemResponse_descriptor;
    }

    @java.lang.Override
    public trinsic.services.universalwallet.v1.InsertItemResponse getDefaultInstanceForType() {
      return trinsic.services.universalwallet.v1.InsertItemResponse.getDefaultInstance();
    }

    @java.lang.Override
    public trinsic.services.universalwallet.v1.InsertItemResponse build() {
      trinsic.services.universalwallet.v1.InsertItemResponse result = buildPartial();
      if (!result.isInitialized()) {
        throw newUninitializedMessageException(result);
      }
      return result;
    }

    @java.lang.Override
    public trinsic.services.universalwallet.v1.InsertItemResponse buildPartial() {
      trinsic.services.universalwallet.v1.InsertItemResponse result =
          new trinsic.services.universalwallet.v1.InsertItemResponse(this);
      result.itemId_ = itemId_;
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
      if (other instanceof trinsic.services.universalwallet.v1.InsertItemResponse) {
        return mergeFrom((trinsic.services.universalwallet.v1.InsertItemResponse) other);
      } else {
        super.mergeFrom(other);
        return this;
      }
    }

    public Builder mergeFrom(trinsic.services.universalwallet.v1.InsertItemResponse other) {
      if (other == trinsic.services.universalwallet.v1.InsertItemResponse.getDefaultInstance())
        return this;
      if (!other.getItemId().isEmpty()) {
        itemId_ = other.itemId_;
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
            case 18:
              {
                itemId_ = input.readStringRequireUtf8();

                break;
              } // case 18
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

    private java.lang.Object itemId_ = "";
    /**
     *
     *
     * <pre>
     * ID of item inserted into wallet
     * </pre>
     *
     * <code>string item_id = 2;</code>
     *
     * @return The itemId.
     */
    public java.lang.String getItemId() {
      java.lang.Object ref = itemId_;
      if (!(ref instanceof java.lang.String)) {
        com.google.protobuf.ByteString bs = (com.google.protobuf.ByteString) ref;
        java.lang.String s = bs.toStringUtf8();
        itemId_ = s;
        return s;
      } else {
        return (java.lang.String) ref;
      }
    }
    /**
     *
     *
     * <pre>
     * ID of item inserted into wallet
     * </pre>
     *
     * <code>string item_id = 2;</code>
     *
     * @return The bytes for itemId.
     */
    public com.google.protobuf.ByteString getItemIdBytes() {
      java.lang.Object ref = itemId_;
      if (ref instanceof String) {
        com.google.protobuf.ByteString b =
            com.google.protobuf.ByteString.copyFromUtf8((java.lang.String) ref);
        itemId_ = b;
        return b;
      } else {
        return (com.google.protobuf.ByteString) ref;
      }
    }
    /**
     *
     *
     * <pre>
     * ID of item inserted into wallet
     * </pre>
     *
     * <code>string item_id = 2;</code>
     *
     * @param value The itemId to set.
     * @return This builder for chaining.
     */
    public Builder setItemId(java.lang.String value) {
      if (value == null) {
        throw new NullPointerException();
      }

      itemId_ = value;
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * ID of item inserted into wallet
     * </pre>
     *
     * <code>string item_id = 2;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearItemId() {

      itemId_ = getDefaultInstance().getItemId();
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * ID of item inserted into wallet
     * </pre>
     *
     * <code>string item_id = 2;</code>
     *
     * @param value The bytes for itemId to set.
     * @return This builder for chaining.
     */
    public Builder setItemIdBytes(com.google.protobuf.ByteString value) {
      if (value == null) {
        throw new NullPointerException();
      }
      checkByteStringIsUtf8(value);

      itemId_ = value;
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

    // @@protoc_insertion_point(builder_scope:services.universalwallet.v1.InsertItemResponse)
  }

  // @@protoc_insertion_point(class_scope:services.universalwallet.v1.InsertItemResponse)
  private static final trinsic.services.universalwallet.v1.InsertItemResponse DEFAULT_INSTANCE;

  static {
    DEFAULT_INSTANCE = new trinsic.services.universalwallet.v1.InsertItemResponse();
  }

  public static trinsic.services.universalwallet.v1.InsertItemResponse getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static final com.google.protobuf.Parser<InsertItemResponse> PARSER =
      new com.google.protobuf.AbstractParser<InsertItemResponse>() {
        @java.lang.Override
        public InsertItemResponse parsePartialFrom(
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

  public static com.google.protobuf.Parser<InsertItemResponse> parser() {
    return PARSER;
  }

  @java.lang.Override
  public com.google.protobuf.Parser<InsertItemResponse> getParserForType() {
    return PARSER;
  }

  @java.lang.Override
  public trinsic.services.universalwallet.v1.InsertItemResponse getDefaultInstanceForType() {
    return DEFAULT_INSTANCE;
  }
}
