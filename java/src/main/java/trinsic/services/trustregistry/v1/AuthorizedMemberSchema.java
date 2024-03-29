// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/trust-registry/v1/trust-registry.proto

package trinsic.services.trustregistry.v1;

/** Protobuf type {@code services.trustregistry.v1.AuthorizedMemberSchema} */
public final class AuthorizedMemberSchema extends com.google.protobuf.GeneratedMessageV3
    implements
    // @@protoc_insertion_point(message_implements:services.trustregistry.v1.AuthorizedMemberSchema)
    AuthorizedMemberSchemaOrBuilder {
  private static final long serialVersionUID = 0L;
  // Use AuthorizedMemberSchema.newBuilder() to construct.
  private AuthorizedMemberSchema(com.google.protobuf.GeneratedMessageV3.Builder<?> builder) {
    super(builder);
  }

  private AuthorizedMemberSchema() {
    schemaUri_ = "";
    status_ = "";
    statusDetails_ = "";
  }

  @java.lang.Override
  @SuppressWarnings({"unused"})
  protected java.lang.Object newInstance(UnusedPrivateParameter unused) {
    return new AuthorizedMemberSchema();
  }

  @java.lang.Override
  public final com.google.protobuf.UnknownFieldSet getUnknownFields() {
    return this.unknownFields;
  }

  public static final com.google.protobuf.Descriptors.Descriptor getDescriptor() {
    return trinsic.services.trustregistry.v1.TrustRegistryOuterClass
        .internal_static_services_trustregistry_v1_AuthorizedMemberSchema_descriptor;
  }

  @java.lang.Override
  protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internalGetFieldAccessorTable() {
    return trinsic.services.trustregistry.v1.TrustRegistryOuterClass
        .internal_static_services_trustregistry_v1_AuthorizedMemberSchema_fieldAccessorTable
        .ensureFieldAccessorsInitialized(
            trinsic.services.trustregistry.v1.AuthorizedMemberSchema.class,
            trinsic.services.trustregistry.v1.AuthorizedMemberSchema.Builder.class);
  }

  public static final int SCHEMA_URI_FIELD_NUMBER = 1;
  private volatile java.lang.Object schemaUri_;
  /**
   * <code>string schema_uri = 1;</code>
   *
   * @return The schemaUri.
   */
  @java.lang.Override
  public java.lang.String getSchemaUri() {
    java.lang.Object ref = schemaUri_;
    if (ref instanceof java.lang.String) {
      return (java.lang.String) ref;
    } else {
      com.google.protobuf.ByteString bs = (com.google.protobuf.ByteString) ref;
      java.lang.String s = bs.toStringUtf8();
      schemaUri_ = s;
      return s;
    }
  }
  /**
   * <code>string schema_uri = 1;</code>
   *
   * @return The bytes for schemaUri.
   */
  @java.lang.Override
  public com.google.protobuf.ByteString getSchemaUriBytes() {
    java.lang.Object ref = schemaUri_;
    if (ref instanceof java.lang.String) {
      com.google.protobuf.ByteString b =
          com.google.protobuf.ByteString.copyFromUtf8((java.lang.String) ref);
      schemaUri_ = b;
      return b;
    } else {
      return (com.google.protobuf.ByteString) ref;
    }
  }

  public static final int STATUS_FIELD_NUMBER = 2;
  private volatile java.lang.Object status_;
  /**
   * <code>string status = 2;</code>
   *
   * @return The status.
   */
  @java.lang.Override
  public java.lang.String getStatus() {
    java.lang.Object ref = status_;
    if (ref instanceof java.lang.String) {
      return (java.lang.String) ref;
    } else {
      com.google.protobuf.ByteString bs = (com.google.protobuf.ByteString) ref;
      java.lang.String s = bs.toStringUtf8();
      status_ = s;
      return s;
    }
  }
  /**
   * <code>string status = 2;</code>
   *
   * @return The bytes for status.
   */
  @java.lang.Override
  public com.google.protobuf.ByteString getStatusBytes() {
    java.lang.Object ref = status_;
    if (ref instanceof java.lang.String) {
      com.google.protobuf.ByteString b =
          com.google.protobuf.ByteString.copyFromUtf8((java.lang.String) ref);
      status_ = b;
      return b;
    } else {
      return (com.google.protobuf.ByteString) ref;
    }
  }

  public static final int STATUS_DETAILS_FIELD_NUMBER = 3;
  private volatile java.lang.Object statusDetails_;
  /**
   * <code>string status_details = 3;</code>
   *
   * @return The statusDetails.
   */
  @java.lang.Override
  public java.lang.String getStatusDetails() {
    java.lang.Object ref = statusDetails_;
    if (ref instanceof java.lang.String) {
      return (java.lang.String) ref;
    } else {
      com.google.protobuf.ByteString bs = (com.google.protobuf.ByteString) ref;
      java.lang.String s = bs.toStringUtf8();
      statusDetails_ = s;
      return s;
    }
  }
  /**
   * <code>string status_details = 3;</code>
   *
   * @return The bytes for statusDetails.
   */
  @java.lang.Override
  public com.google.protobuf.ByteString getStatusDetailsBytes() {
    java.lang.Object ref = statusDetails_;
    if (ref instanceof java.lang.String) {
      com.google.protobuf.ByteString b =
          com.google.protobuf.ByteString.copyFromUtf8((java.lang.String) ref);
      statusDetails_ = b;
      return b;
    } else {
      return (com.google.protobuf.ByteString) ref;
    }
  }

  public static final int VALID_FROM_FIELD_NUMBER = 4;
  private long validFrom_;
  /**
   * <code>uint64 valid_from = 4;</code>
   *
   * @return The validFrom.
   */
  @java.lang.Override
  public long getValidFrom() {
    return validFrom_;
  }

  public static final int VALID_UNTIL_FIELD_NUMBER = 5;
  private long validUntil_;
  /**
   * <code>uint64 valid_until = 5;</code>
   *
   * @return The validUntil.
   */
  @java.lang.Override
  public long getValidUntil() {
    return validUntil_;
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
    if (!com.google.protobuf.GeneratedMessageV3.isStringEmpty(schemaUri_)) {
      com.google.protobuf.GeneratedMessageV3.writeString(output, 1, schemaUri_);
    }
    if (!com.google.protobuf.GeneratedMessageV3.isStringEmpty(status_)) {
      com.google.protobuf.GeneratedMessageV3.writeString(output, 2, status_);
    }
    if (!com.google.protobuf.GeneratedMessageV3.isStringEmpty(statusDetails_)) {
      com.google.protobuf.GeneratedMessageV3.writeString(output, 3, statusDetails_);
    }
    if (validFrom_ != 0L) {
      output.writeUInt64(4, validFrom_);
    }
    if (validUntil_ != 0L) {
      output.writeUInt64(5, validUntil_);
    }
    getUnknownFields().writeTo(output);
  }

  @java.lang.Override
  public int getSerializedSize() {
    int size = memoizedSize;
    if (size != -1) return size;

    size = 0;
    if (!com.google.protobuf.GeneratedMessageV3.isStringEmpty(schemaUri_)) {
      size += com.google.protobuf.GeneratedMessageV3.computeStringSize(1, schemaUri_);
    }
    if (!com.google.protobuf.GeneratedMessageV3.isStringEmpty(status_)) {
      size += com.google.protobuf.GeneratedMessageV3.computeStringSize(2, status_);
    }
    if (!com.google.protobuf.GeneratedMessageV3.isStringEmpty(statusDetails_)) {
      size += com.google.protobuf.GeneratedMessageV3.computeStringSize(3, statusDetails_);
    }
    if (validFrom_ != 0L) {
      size += com.google.protobuf.CodedOutputStream.computeUInt64Size(4, validFrom_);
    }
    if (validUntil_ != 0L) {
      size += com.google.protobuf.CodedOutputStream.computeUInt64Size(5, validUntil_);
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
    if (!(obj instanceof trinsic.services.trustregistry.v1.AuthorizedMemberSchema)) {
      return super.equals(obj);
    }
    trinsic.services.trustregistry.v1.AuthorizedMemberSchema other =
        (trinsic.services.trustregistry.v1.AuthorizedMemberSchema) obj;

    if (!getSchemaUri().equals(other.getSchemaUri())) return false;
    if (!getStatus().equals(other.getStatus())) return false;
    if (!getStatusDetails().equals(other.getStatusDetails())) return false;
    if (getValidFrom() != other.getValidFrom()) return false;
    if (getValidUntil() != other.getValidUntil()) return false;
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
    hash = (37 * hash) + SCHEMA_URI_FIELD_NUMBER;
    hash = (53 * hash) + getSchemaUri().hashCode();
    hash = (37 * hash) + STATUS_FIELD_NUMBER;
    hash = (53 * hash) + getStatus().hashCode();
    hash = (37 * hash) + STATUS_DETAILS_FIELD_NUMBER;
    hash = (53 * hash) + getStatusDetails().hashCode();
    hash = (37 * hash) + VALID_FROM_FIELD_NUMBER;
    hash = (53 * hash) + com.google.protobuf.Internal.hashLong(getValidFrom());
    hash = (37 * hash) + VALID_UNTIL_FIELD_NUMBER;
    hash = (53 * hash) + com.google.protobuf.Internal.hashLong(getValidUntil());
    hash = (29 * hash) + getUnknownFields().hashCode();
    memoizedHashCode = hash;
    return hash;
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema parseFrom(
      java.nio.ByteBuffer data) throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema parseFrom(
      java.nio.ByteBuffer data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema parseFrom(
      byte[] data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema parseFrom(
      java.io.InputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(PARSER, input);
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema parseFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(
        PARSER, input, extensionRegistry);
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema parseDelimitedFrom(
      java.io.InputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseDelimitedWithIOException(PARSER, input);
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema parseDelimitedFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseDelimitedWithIOException(
        PARSER, input, extensionRegistry);
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema parseFrom(
      com.google.protobuf.CodedInputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(PARSER, input);
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema parseFrom(
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
      trinsic.services.trustregistry.v1.AuthorizedMemberSchema prototype) {
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
  /** Protobuf type {@code services.trustregistry.v1.AuthorizedMemberSchema} */
  public static final class Builder extends com.google.protobuf.GeneratedMessageV3.Builder<Builder>
      implements
      // @@protoc_insertion_point(builder_implements:services.trustregistry.v1.AuthorizedMemberSchema)
      trinsic.services.trustregistry.v1.AuthorizedMemberSchemaOrBuilder {
    public static final com.google.protobuf.Descriptors.Descriptor getDescriptor() {
      return trinsic.services.trustregistry.v1.TrustRegistryOuterClass
          .internal_static_services_trustregistry_v1_AuthorizedMemberSchema_descriptor;
    }

    @java.lang.Override
    protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
        internalGetFieldAccessorTable() {
      return trinsic.services.trustregistry.v1.TrustRegistryOuterClass
          .internal_static_services_trustregistry_v1_AuthorizedMemberSchema_fieldAccessorTable
          .ensureFieldAccessorsInitialized(
              trinsic.services.trustregistry.v1.AuthorizedMemberSchema.class,
              trinsic.services.trustregistry.v1.AuthorizedMemberSchema.Builder.class);
    }

    // Construct using trinsic.services.trustregistry.v1.AuthorizedMemberSchema.newBuilder()
    private Builder() {}

    private Builder(com.google.protobuf.GeneratedMessageV3.BuilderParent parent) {
      super(parent);
    }

    @java.lang.Override
    public Builder clear() {
      super.clear();
      schemaUri_ = "";

      status_ = "";

      statusDetails_ = "";

      validFrom_ = 0L;

      validUntil_ = 0L;

      return this;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.Descriptor getDescriptorForType() {
      return trinsic.services.trustregistry.v1.TrustRegistryOuterClass
          .internal_static_services_trustregistry_v1_AuthorizedMemberSchema_descriptor;
    }

    @java.lang.Override
    public trinsic.services.trustregistry.v1.AuthorizedMemberSchema getDefaultInstanceForType() {
      return trinsic.services.trustregistry.v1.AuthorizedMemberSchema.getDefaultInstance();
    }

    @java.lang.Override
    public trinsic.services.trustregistry.v1.AuthorizedMemberSchema build() {
      trinsic.services.trustregistry.v1.AuthorizedMemberSchema result = buildPartial();
      if (!result.isInitialized()) {
        throw newUninitializedMessageException(result);
      }
      return result;
    }

    @java.lang.Override
    public trinsic.services.trustregistry.v1.AuthorizedMemberSchema buildPartial() {
      trinsic.services.trustregistry.v1.AuthorizedMemberSchema result =
          new trinsic.services.trustregistry.v1.AuthorizedMemberSchema(this);
      result.schemaUri_ = schemaUri_;
      result.status_ = status_;
      result.statusDetails_ = statusDetails_;
      result.validFrom_ = validFrom_;
      result.validUntil_ = validUntil_;
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
      if (other instanceof trinsic.services.trustregistry.v1.AuthorizedMemberSchema) {
        return mergeFrom((trinsic.services.trustregistry.v1.AuthorizedMemberSchema) other);
      } else {
        super.mergeFrom(other);
        return this;
      }
    }

    public Builder mergeFrom(trinsic.services.trustregistry.v1.AuthorizedMemberSchema other) {
      if (other == trinsic.services.trustregistry.v1.AuthorizedMemberSchema.getDefaultInstance())
        return this;
      if (!other.getSchemaUri().isEmpty()) {
        schemaUri_ = other.schemaUri_;
        onChanged();
      }
      if (!other.getStatus().isEmpty()) {
        status_ = other.status_;
        onChanged();
      }
      if (!other.getStatusDetails().isEmpty()) {
        statusDetails_ = other.statusDetails_;
        onChanged();
      }
      if (other.getValidFrom() != 0L) {
        setValidFrom(other.getValidFrom());
      }
      if (other.getValidUntil() != 0L) {
        setValidUntil(other.getValidUntil());
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
                schemaUri_ = input.readStringRequireUtf8();

                break;
              } // case 10
            case 18:
              {
                status_ = input.readStringRequireUtf8();

                break;
              } // case 18
            case 26:
              {
                statusDetails_ = input.readStringRequireUtf8();

                break;
              } // case 26
            case 32:
              {
                validFrom_ = input.readUInt64();

                break;
              } // case 32
            case 40:
              {
                validUntil_ = input.readUInt64();

                break;
              } // case 40
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

    private java.lang.Object schemaUri_ = "";
    /**
     * <code>string schema_uri = 1;</code>
     *
     * @return The schemaUri.
     */
    public java.lang.String getSchemaUri() {
      java.lang.Object ref = schemaUri_;
      if (!(ref instanceof java.lang.String)) {
        com.google.protobuf.ByteString bs = (com.google.protobuf.ByteString) ref;
        java.lang.String s = bs.toStringUtf8();
        schemaUri_ = s;
        return s;
      } else {
        return (java.lang.String) ref;
      }
    }
    /**
     * <code>string schema_uri = 1;</code>
     *
     * @return The bytes for schemaUri.
     */
    public com.google.protobuf.ByteString getSchemaUriBytes() {
      java.lang.Object ref = schemaUri_;
      if (ref instanceof String) {
        com.google.protobuf.ByteString b =
            com.google.protobuf.ByteString.copyFromUtf8((java.lang.String) ref);
        schemaUri_ = b;
        return b;
      } else {
        return (com.google.protobuf.ByteString) ref;
      }
    }
    /**
     * <code>string schema_uri = 1;</code>
     *
     * @param value The schemaUri to set.
     * @return This builder for chaining.
     */
    public Builder setSchemaUri(java.lang.String value) {
      if (value == null) {
        throw new NullPointerException();
      }

      schemaUri_ = value;
      onChanged();
      return this;
    }
    /**
     * <code>string schema_uri = 1;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearSchemaUri() {

      schemaUri_ = getDefaultInstance().getSchemaUri();
      onChanged();
      return this;
    }
    /**
     * <code>string schema_uri = 1;</code>
     *
     * @param value The bytes for schemaUri to set.
     * @return This builder for chaining.
     */
    public Builder setSchemaUriBytes(com.google.protobuf.ByteString value) {
      if (value == null) {
        throw new NullPointerException();
      }
      checkByteStringIsUtf8(value);

      schemaUri_ = value;
      onChanged();
      return this;
    }

    private java.lang.Object status_ = "";
    /**
     * <code>string status = 2;</code>
     *
     * @return The status.
     */
    public java.lang.String getStatus() {
      java.lang.Object ref = status_;
      if (!(ref instanceof java.lang.String)) {
        com.google.protobuf.ByteString bs = (com.google.protobuf.ByteString) ref;
        java.lang.String s = bs.toStringUtf8();
        status_ = s;
        return s;
      } else {
        return (java.lang.String) ref;
      }
    }
    /**
     * <code>string status = 2;</code>
     *
     * @return The bytes for status.
     */
    public com.google.protobuf.ByteString getStatusBytes() {
      java.lang.Object ref = status_;
      if (ref instanceof String) {
        com.google.protobuf.ByteString b =
            com.google.protobuf.ByteString.copyFromUtf8((java.lang.String) ref);
        status_ = b;
        return b;
      } else {
        return (com.google.protobuf.ByteString) ref;
      }
    }
    /**
     * <code>string status = 2;</code>
     *
     * @param value The status to set.
     * @return This builder for chaining.
     */
    public Builder setStatus(java.lang.String value) {
      if (value == null) {
        throw new NullPointerException();
      }

      status_ = value;
      onChanged();
      return this;
    }
    /**
     * <code>string status = 2;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearStatus() {

      status_ = getDefaultInstance().getStatus();
      onChanged();
      return this;
    }
    /**
     * <code>string status = 2;</code>
     *
     * @param value The bytes for status to set.
     * @return This builder for chaining.
     */
    public Builder setStatusBytes(com.google.protobuf.ByteString value) {
      if (value == null) {
        throw new NullPointerException();
      }
      checkByteStringIsUtf8(value);

      status_ = value;
      onChanged();
      return this;
    }

    private java.lang.Object statusDetails_ = "";
    /**
     * <code>string status_details = 3;</code>
     *
     * @return The statusDetails.
     */
    public java.lang.String getStatusDetails() {
      java.lang.Object ref = statusDetails_;
      if (!(ref instanceof java.lang.String)) {
        com.google.protobuf.ByteString bs = (com.google.protobuf.ByteString) ref;
        java.lang.String s = bs.toStringUtf8();
        statusDetails_ = s;
        return s;
      } else {
        return (java.lang.String) ref;
      }
    }
    /**
     * <code>string status_details = 3;</code>
     *
     * @return The bytes for statusDetails.
     */
    public com.google.protobuf.ByteString getStatusDetailsBytes() {
      java.lang.Object ref = statusDetails_;
      if (ref instanceof String) {
        com.google.protobuf.ByteString b =
            com.google.protobuf.ByteString.copyFromUtf8((java.lang.String) ref);
        statusDetails_ = b;
        return b;
      } else {
        return (com.google.protobuf.ByteString) ref;
      }
    }
    /**
     * <code>string status_details = 3;</code>
     *
     * @param value The statusDetails to set.
     * @return This builder for chaining.
     */
    public Builder setStatusDetails(java.lang.String value) {
      if (value == null) {
        throw new NullPointerException();
      }

      statusDetails_ = value;
      onChanged();
      return this;
    }
    /**
     * <code>string status_details = 3;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearStatusDetails() {

      statusDetails_ = getDefaultInstance().getStatusDetails();
      onChanged();
      return this;
    }
    /**
     * <code>string status_details = 3;</code>
     *
     * @param value The bytes for statusDetails to set.
     * @return This builder for chaining.
     */
    public Builder setStatusDetailsBytes(com.google.protobuf.ByteString value) {
      if (value == null) {
        throw new NullPointerException();
      }
      checkByteStringIsUtf8(value);

      statusDetails_ = value;
      onChanged();
      return this;
    }

    private long validFrom_;
    /**
     * <code>uint64 valid_from = 4;</code>
     *
     * @return The validFrom.
     */
    @java.lang.Override
    public long getValidFrom() {
      return validFrom_;
    }
    /**
     * <code>uint64 valid_from = 4;</code>
     *
     * @param value The validFrom to set.
     * @return This builder for chaining.
     */
    public Builder setValidFrom(long value) {

      validFrom_ = value;
      onChanged();
      return this;
    }
    /**
     * <code>uint64 valid_from = 4;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearValidFrom() {

      validFrom_ = 0L;
      onChanged();
      return this;
    }

    private long validUntil_;
    /**
     * <code>uint64 valid_until = 5;</code>
     *
     * @return The validUntil.
     */
    @java.lang.Override
    public long getValidUntil() {
      return validUntil_;
    }
    /**
     * <code>uint64 valid_until = 5;</code>
     *
     * @param value The validUntil to set.
     * @return This builder for chaining.
     */
    public Builder setValidUntil(long value) {

      validUntil_ = value;
      onChanged();
      return this;
    }
    /**
     * <code>uint64 valid_until = 5;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearValidUntil() {

      validUntil_ = 0L;
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

    // @@protoc_insertion_point(builder_scope:services.trustregistry.v1.AuthorizedMemberSchema)
  }

  // @@protoc_insertion_point(class_scope:services.trustregistry.v1.AuthorizedMemberSchema)
  private static final trinsic.services.trustregistry.v1.AuthorizedMemberSchema DEFAULT_INSTANCE;

  static {
    DEFAULT_INSTANCE = new trinsic.services.trustregistry.v1.AuthorizedMemberSchema();
  }

  public static trinsic.services.trustregistry.v1.AuthorizedMemberSchema getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static final com.google.protobuf.Parser<AuthorizedMemberSchema> PARSER =
      new com.google.protobuf.AbstractParser<AuthorizedMemberSchema>() {
        @java.lang.Override
        public AuthorizedMemberSchema parsePartialFrom(
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

  public static com.google.protobuf.Parser<AuthorizedMemberSchema> parser() {
    return PARSER;
  }

  @java.lang.Override
  public com.google.protobuf.Parser<AuthorizedMemberSchema> getParserForType() {
    return PARSER;
  }

  @java.lang.Override
  public trinsic.services.trustregistry.v1.AuthorizedMemberSchema getDefaultInstanceForType() {
    return DEFAULT_INSTANCE;
  }
}
