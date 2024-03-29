// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/connect/v1/connect.proto

package trinsic.services.connect.v1;

/**
 *
 *
 * <pre>
 * Request to list all IDVSessions you've created
 * </pre>
 *
 * Protobuf type {@code services.connect.v1.ListSessionsRequest}
 */
public final class ListSessionsRequest extends com.google.protobuf.GeneratedMessageV3
    implements
    // @@protoc_insertion_point(message_implements:services.connect.v1.ListSessionsRequest)
    ListSessionsRequestOrBuilder {
  private static final long serialVersionUID = 0L;
  // Use ListSessionsRequest.newBuilder() to construct.
  private ListSessionsRequest(com.google.protobuf.GeneratedMessageV3.Builder<?> builder) {
    super(builder);
  }

  private ListSessionsRequest() {
    orderBy_ = 0;
    orderDirection_ = 0;
  }

  @java.lang.Override
  @SuppressWarnings({"unused"})
  protected java.lang.Object newInstance(UnusedPrivateParameter unused) {
    return new ListSessionsRequest();
  }

  @java.lang.Override
  public final com.google.protobuf.UnknownFieldSet getUnknownFields() {
    return this.unknownFields;
  }

  public static final com.google.protobuf.Descriptors.Descriptor getDescriptor() {
    return trinsic.services.connect.v1.ConnectOuterClass
        .internal_static_services_connect_v1_ListSessionsRequest_descriptor;
  }

  @java.lang.Override
  protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internalGetFieldAccessorTable() {
    return trinsic.services.connect.v1.ConnectOuterClass
        .internal_static_services_connect_v1_ListSessionsRequest_fieldAccessorTable
        .ensureFieldAccessorsInitialized(
            trinsic.services.connect.v1.ListSessionsRequest.class,
            trinsic.services.connect.v1.ListSessionsRequest.Builder.class);
  }

  private int bitField0_;
  public static final int ORDER_BY_FIELD_NUMBER = 1;
  private int orderBy_;
  /**
   *
   *
   * <pre>
   * The field by which sessions should be sorted. Defaults to `CREATED`.
   * </pre>
   *
   * <code>.services.connect.v1.SessionOrdering order_by = 1;</code>
   *
   * @return The enum numeric value on the wire for orderBy.
   */
  @java.lang.Override
  public int getOrderByValue() {
    return orderBy_;
  }
  /**
   *
   *
   * <pre>
   * The field by which sessions should be sorted. Defaults to `CREATED`.
   * </pre>
   *
   * <code>.services.connect.v1.SessionOrdering order_by = 1;</code>
   *
   * @return The orderBy.
   */
  @java.lang.Override
  public trinsic.services.connect.v1.SessionOrdering getOrderBy() {
    @SuppressWarnings("deprecation")
    trinsic.services.connect.v1.SessionOrdering result =
        trinsic.services.connect.v1.SessionOrdering.valueOf(orderBy_);
    return result == null ? trinsic.services.connect.v1.SessionOrdering.UNRECOGNIZED : result;
  }

  public static final int ORDER_DIRECTION_FIELD_NUMBER = 2;
  private int orderDirection_;
  /**
   *
   *
   * <pre>
   * The order in which sessions should be sorted. Defaults to `ASCENDING`.
   * </pre>
   *
   * <code>.services.common.v1.OrderDirection order_direction = 2;</code>
   *
   * @return The enum numeric value on the wire for orderDirection.
   */
  @java.lang.Override
  public int getOrderDirectionValue() {
    return orderDirection_;
  }
  /**
   *
   *
   * <pre>
   * The order in which sessions should be sorted. Defaults to `ASCENDING`.
   * </pre>
   *
   * <code>.services.common.v1.OrderDirection order_direction = 2;</code>
   *
   * @return The orderDirection.
   */
  @java.lang.Override
  public trinsic.services.common.v1.OrderDirection getOrderDirection() {
    @SuppressWarnings("deprecation")
    trinsic.services.common.v1.OrderDirection result =
        trinsic.services.common.v1.OrderDirection.valueOf(orderDirection_);
    return result == null ? trinsic.services.common.v1.OrderDirection.UNRECOGNIZED : result;
  }

  public static final int PAGE_SIZE_FIELD_NUMBER = 3;
  private int pageSize_;
  /**
   *
   *
   * <pre>
   * The number of results to return per page.
   * Must be between `1` and `10`, inclusive.
   * Defaults to `10`.
   * </pre>
   *
   * <code>optional int32 page_size = 3;</code>
   *
   * @return Whether the pageSize field is set.
   */
  @java.lang.Override
  public boolean hasPageSize() {
    return ((bitField0_ & 0x00000001) != 0);
  }
  /**
   *
   *
   * <pre>
   * The number of results to return per page.
   * Must be between `1` and `10`, inclusive.
   * Defaults to `10`.
   * </pre>
   *
   * <code>optional int32 page_size = 3;</code>
   *
   * @return The pageSize.
   */
  @java.lang.Override
  public int getPageSize() {
    return pageSize_;
  }

  public static final int PAGE_FIELD_NUMBER = 4;
  private int page_;
  /**
   *
   *
   * <pre>
   * The page index of results to return.
   * Starts at `1`.
   * Defaults to `1`.
   * </pre>
   *
   * <code>optional int32 page = 4;</code>
   *
   * @return Whether the page field is set.
   */
  @java.lang.Override
  public boolean hasPage() {
    return ((bitField0_ & 0x00000002) != 0);
  }
  /**
   *
   *
   * <pre>
   * The page index of results to return.
   * Starts at `1`.
   * Defaults to `1`.
   * </pre>
   *
   * <code>optional int32 page = 4;</code>
   *
   * @return The page.
   */
  @java.lang.Override
  public int getPage() {
    return page_;
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
    if (orderBy_ != trinsic.services.connect.v1.SessionOrdering.CREATED.getNumber()) {
      output.writeEnum(1, orderBy_);
    }
    if (orderDirection_ != trinsic.services.common.v1.OrderDirection.ASCENDING.getNumber()) {
      output.writeEnum(2, orderDirection_);
    }
    if (((bitField0_ & 0x00000001) != 0)) {
      output.writeInt32(3, pageSize_);
    }
    if (((bitField0_ & 0x00000002) != 0)) {
      output.writeInt32(4, page_);
    }
    getUnknownFields().writeTo(output);
  }

  @java.lang.Override
  public int getSerializedSize() {
    int size = memoizedSize;
    if (size != -1) return size;

    size = 0;
    if (orderBy_ != trinsic.services.connect.v1.SessionOrdering.CREATED.getNumber()) {
      size += com.google.protobuf.CodedOutputStream.computeEnumSize(1, orderBy_);
    }
    if (orderDirection_ != trinsic.services.common.v1.OrderDirection.ASCENDING.getNumber()) {
      size += com.google.protobuf.CodedOutputStream.computeEnumSize(2, orderDirection_);
    }
    if (((bitField0_ & 0x00000001) != 0)) {
      size += com.google.protobuf.CodedOutputStream.computeInt32Size(3, pageSize_);
    }
    if (((bitField0_ & 0x00000002) != 0)) {
      size += com.google.protobuf.CodedOutputStream.computeInt32Size(4, page_);
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
    if (!(obj instanceof trinsic.services.connect.v1.ListSessionsRequest)) {
      return super.equals(obj);
    }
    trinsic.services.connect.v1.ListSessionsRequest other =
        (trinsic.services.connect.v1.ListSessionsRequest) obj;

    if (orderBy_ != other.orderBy_) return false;
    if (orderDirection_ != other.orderDirection_) return false;
    if (hasPageSize() != other.hasPageSize()) return false;
    if (hasPageSize()) {
      if (getPageSize() != other.getPageSize()) return false;
    }
    if (hasPage() != other.hasPage()) return false;
    if (hasPage()) {
      if (getPage() != other.getPage()) return false;
    }
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
    hash = (37 * hash) + ORDER_BY_FIELD_NUMBER;
    hash = (53 * hash) + orderBy_;
    hash = (37 * hash) + ORDER_DIRECTION_FIELD_NUMBER;
    hash = (53 * hash) + orderDirection_;
    if (hasPageSize()) {
      hash = (37 * hash) + PAGE_SIZE_FIELD_NUMBER;
      hash = (53 * hash) + getPageSize();
    }
    if (hasPage()) {
      hash = (37 * hash) + PAGE_FIELD_NUMBER;
      hash = (53 * hash) + getPage();
    }
    hash = (29 * hash) + getUnknownFields().hashCode();
    memoizedHashCode = hash;
    return hash;
  }

  public static trinsic.services.connect.v1.ListSessionsRequest parseFrom(java.nio.ByteBuffer data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.connect.v1.ListSessionsRequest parseFrom(
      java.nio.ByteBuffer data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.connect.v1.ListSessionsRequest parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.connect.v1.ListSessionsRequest parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.connect.v1.ListSessionsRequest parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.connect.v1.ListSessionsRequest parseFrom(
      byte[] data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.connect.v1.ListSessionsRequest parseFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(PARSER, input);
  }

  public static trinsic.services.connect.v1.ListSessionsRequest parseFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(
        PARSER, input, extensionRegistry);
  }

  public static trinsic.services.connect.v1.ListSessionsRequest parseDelimitedFrom(
      java.io.InputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseDelimitedWithIOException(PARSER, input);
  }

  public static trinsic.services.connect.v1.ListSessionsRequest parseDelimitedFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseDelimitedWithIOException(
        PARSER, input, extensionRegistry);
  }

  public static trinsic.services.connect.v1.ListSessionsRequest parseFrom(
      com.google.protobuf.CodedInputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(PARSER, input);
  }

  public static trinsic.services.connect.v1.ListSessionsRequest parseFrom(
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

  public static Builder newBuilder(trinsic.services.connect.v1.ListSessionsRequest prototype) {
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
   * Request to list all IDVSessions you've created
   * </pre>
   *
   * Protobuf type {@code services.connect.v1.ListSessionsRequest}
   */
  public static final class Builder extends com.google.protobuf.GeneratedMessageV3.Builder<Builder>
      implements
      // @@protoc_insertion_point(builder_implements:services.connect.v1.ListSessionsRequest)
      trinsic.services.connect.v1.ListSessionsRequestOrBuilder {
    public static final com.google.protobuf.Descriptors.Descriptor getDescriptor() {
      return trinsic.services.connect.v1.ConnectOuterClass
          .internal_static_services_connect_v1_ListSessionsRequest_descriptor;
    }

    @java.lang.Override
    protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
        internalGetFieldAccessorTable() {
      return trinsic.services.connect.v1.ConnectOuterClass
          .internal_static_services_connect_v1_ListSessionsRequest_fieldAccessorTable
          .ensureFieldAccessorsInitialized(
              trinsic.services.connect.v1.ListSessionsRequest.class,
              trinsic.services.connect.v1.ListSessionsRequest.Builder.class);
    }

    // Construct using trinsic.services.connect.v1.ListSessionsRequest.newBuilder()
    private Builder() {}

    private Builder(com.google.protobuf.GeneratedMessageV3.BuilderParent parent) {
      super(parent);
    }

    @java.lang.Override
    public Builder clear() {
      super.clear();
      orderBy_ = 0;

      orderDirection_ = 0;

      pageSize_ = 0;
      bitField0_ = (bitField0_ & ~0x00000001);
      page_ = 0;
      bitField0_ = (bitField0_ & ~0x00000002);
      return this;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.Descriptor getDescriptorForType() {
      return trinsic.services.connect.v1.ConnectOuterClass
          .internal_static_services_connect_v1_ListSessionsRequest_descriptor;
    }

    @java.lang.Override
    public trinsic.services.connect.v1.ListSessionsRequest getDefaultInstanceForType() {
      return trinsic.services.connect.v1.ListSessionsRequest.getDefaultInstance();
    }

    @java.lang.Override
    public trinsic.services.connect.v1.ListSessionsRequest build() {
      trinsic.services.connect.v1.ListSessionsRequest result = buildPartial();
      if (!result.isInitialized()) {
        throw newUninitializedMessageException(result);
      }
      return result;
    }

    @java.lang.Override
    public trinsic.services.connect.v1.ListSessionsRequest buildPartial() {
      trinsic.services.connect.v1.ListSessionsRequest result =
          new trinsic.services.connect.v1.ListSessionsRequest(this);
      int from_bitField0_ = bitField0_;
      int to_bitField0_ = 0;
      result.orderBy_ = orderBy_;
      result.orderDirection_ = orderDirection_;
      if (((from_bitField0_ & 0x00000001) != 0)) {
        result.pageSize_ = pageSize_;
        to_bitField0_ |= 0x00000001;
      }
      if (((from_bitField0_ & 0x00000002) != 0)) {
        result.page_ = page_;
        to_bitField0_ |= 0x00000002;
      }
      result.bitField0_ = to_bitField0_;
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
      if (other instanceof trinsic.services.connect.v1.ListSessionsRequest) {
        return mergeFrom((trinsic.services.connect.v1.ListSessionsRequest) other);
      } else {
        super.mergeFrom(other);
        return this;
      }
    }

    public Builder mergeFrom(trinsic.services.connect.v1.ListSessionsRequest other) {
      if (other == trinsic.services.connect.v1.ListSessionsRequest.getDefaultInstance())
        return this;
      if (other.orderBy_ != 0) {
        setOrderByValue(other.getOrderByValue());
      }
      if (other.orderDirection_ != 0) {
        setOrderDirectionValue(other.getOrderDirectionValue());
      }
      if (other.hasPageSize()) {
        setPageSize(other.getPageSize());
      }
      if (other.hasPage()) {
        setPage(other.getPage());
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
            case 8:
              {
                orderBy_ = input.readEnum();

                break;
              } // case 8
            case 16:
              {
                orderDirection_ = input.readEnum();

                break;
              } // case 16
            case 24:
              {
                pageSize_ = input.readInt32();
                bitField0_ |= 0x00000001;
                break;
              } // case 24
            case 32:
              {
                page_ = input.readInt32();
                bitField0_ |= 0x00000002;
                break;
              } // case 32
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

    private int orderBy_ = 0;
    /**
     *
     *
     * <pre>
     * The field by which sessions should be sorted. Defaults to `CREATED`.
     * </pre>
     *
     * <code>.services.connect.v1.SessionOrdering order_by = 1;</code>
     *
     * @return The enum numeric value on the wire for orderBy.
     */
    @java.lang.Override
    public int getOrderByValue() {
      return orderBy_;
    }
    /**
     *
     *
     * <pre>
     * The field by which sessions should be sorted. Defaults to `CREATED`.
     * </pre>
     *
     * <code>.services.connect.v1.SessionOrdering order_by = 1;</code>
     *
     * @param value The enum numeric value on the wire for orderBy to set.
     * @return This builder for chaining.
     */
    public Builder setOrderByValue(int value) {

      orderBy_ = value;
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * The field by which sessions should be sorted. Defaults to `CREATED`.
     * </pre>
     *
     * <code>.services.connect.v1.SessionOrdering order_by = 1;</code>
     *
     * @return The orderBy.
     */
    @java.lang.Override
    public trinsic.services.connect.v1.SessionOrdering getOrderBy() {
      @SuppressWarnings("deprecation")
      trinsic.services.connect.v1.SessionOrdering result =
          trinsic.services.connect.v1.SessionOrdering.valueOf(orderBy_);
      return result == null ? trinsic.services.connect.v1.SessionOrdering.UNRECOGNIZED : result;
    }
    /**
     *
     *
     * <pre>
     * The field by which sessions should be sorted. Defaults to `CREATED`.
     * </pre>
     *
     * <code>.services.connect.v1.SessionOrdering order_by = 1;</code>
     *
     * @param value The orderBy to set.
     * @return This builder for chaining.
     */
    public Builder setOrderBy(trinsic.services.connect.v1.SessionOrdering value) {
      if (value == null) {
        throw new NullPointerException();
      }

      orderBy_ = value.getNumber();
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * The field by which sessions should be sorted. Defaults to `CREATED`.
     * </pre>
     *
     * <code>.services.connect.v1.SessionOrdering order_by = 1;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearOrderBy() {

      orderBy_ = 0;
      onChanged();
      return this;
    }

    private int orderDirection_ = 0;
    /**
     *
     *
     * <pre>
     * The order in which sessions should be sorted. Defaults to `ASCENDING`.
     * </pre>
     *
     * <code>.services.common.v1.OrderDirection order_direction = 2;</code>
     *
     * @return The enum numeric value on the wire for orderDirection.
     */
    @java.lang.Override
    public int getOrderDirectionValue() {
      return orderDirection_;
    }
    /**
     *
     *
     * <pre>
     * The order in which sessions should be sorted. Defaults to `ASCENDING`.
     * </pre>
     *
     * <code>.services.common.v1.OrderDirection order_direction = 2;</code>
     *
     * @param value The enum numeric value on the wire for orderDirection to set.
     * @return This builder for chaining.
     */
    public Builder setOrderDirectionValue(int value) {

      orderDirection_ = value;
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * The order in which sessions should be sorted. Defaults to `ASCENDING`.
     * </pre>
     *
     * <code>.services.common.v1.OrderDirection order_direction = 2;</code>
     *
     * @return The orderDirection.
     */
    @java.lang.Override
    public trinsic.services.common.v1.OrderDirection getOrderDirection() {
      @SuppressWarnings("deprecation")
      trinsic.services.common.v1.OrderDirection result =
          trinsic.services.common.v1.OrderDirection.valueOf(orderDirection_);
      return result == null ? trinsic.services.common.v1.OrderDirection.UNRECOGNIZED : result;
    }
    /**
     *
     *
     * <pre>
     * The order in which sessions should be sorted. Defaults to `ASCENDING`.
     * </pre>
     *
     * <code>.services.common.v1.OrderDirection order_direction = 2;</code>
     *
     * @param value The orderDirection to set.
     * @return This builder for chaining.
     */
    public Builder setOrderDirection(trinsic.services.common.v1.OrderDirection value) {
      if (value == null) {
        throw new NullPointerException();
      }

      orderDirection_ = value.getNumber();
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * The order in which sessions should be sorted. Defaults to `ASCENDING`.
     * </pre>
     *
     * <code>.services.common.v1.OrderDirection order_direction = 2;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearOrderDirection() {

      orderDirection_ = 0;
      onChanged();
      return this;
    }

    private int pageSize_;
    /**
     *
     *
     * <pre>
     * The number of results to return per page.
     * Must be between `1` and `10`, inclusive.
     * Defaults to `10`.
     * </pre>
     *
     * <code>optional int32 page_size = 3;</code>
     *
     * @return Whether the pageSize field is set.
     */
    @java.lang.Override
    public boolean hasPageSize() {
      return ((bitField0_ & 0x00000001) != 0);
    }
    /**
     *
     *
     * <pre>
     * The number of results to return per page.
     * Must be between `1` and `10`, inclusive.
     * Defaults to `10`.
     * </pre>
     *
     * <code>optional int32 page_size = 3;</code>
     *
     * @return The pageSize.
     */
    @java.lang.Override
    public int getPageSize() {
      return pageSize_;
    }
    /**
     *
     *
     * <pre>
     * The number of results to return per page.
     * Must be between `1` and `10`, inclusive.
     * Defaults to `10`.
     * </pre>
     *
     * <code>optional int32 page_size = 3;</code>
     *
     * @param value The pageSize to set.
     * @return This builder for chaining.
     */
    public Builder setPageSize(int value) {
      bitField0_ |= 0x00000001;
      pageSize_ = value;
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * The number of results to return per page.
     * Must be between `1` and `10`, inclusive.
     * Defaults to `10`.
     * </pre>
     *
     * <code>optional int32 page_size = 3;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearPageSize() {
      bitField0_ = (bitField0_ & ~0x00000001);
      pageSize_ = 0;
      onChanged();
      return this;
    }

    private int page_;
    /**
     *
     *
     * <pre>
     * The page index of results to return.
     * Starts at `1`.
     * Defaults to `1`.
     * </pre>
     *
     * <code>optional int32 page = 4;</code>
     *
     * @return Whether the page field is set.
     */
    @java.lang.Override
    public boolean hasPage() {
      return ((bitField0_ & 0x00000002) != 0);
    }
    /**
     *
     *
     * <pre>
     * The page index of results to return.
     * Starts at `1`.
     * Defaults to `1`.
     * </pre>
     *
     * <code>optional int32 page = 4;</code>
     *
     * @return The page.
     */
    @java.lang.Override
    public int getPage() {
      return page_;
    }
    /**
     *
     *
     * <pre>
     * The page index of results to return.
     * Starts at `1`.
     * Defaults to `1`.
     * </pre>
     *
     * <code>optional int32 page = 4;</code>
     *
     * @param value The page to set.
     * @return This builder for chaining.
     */
    public Builder setPage(int value) {
      bitField0_ |= 0x00000002;
      page_ = value;
      onChanged();
      return this;
    }
    /**
     *
     *
     * <pre>
     * The page index of results to return.
     * Starts at `1`.
     * Defaults to `1`.
     * </pre>
     *
     * <code>optional int32 page = 4;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearPage() {
      bitField0_ = (bitField0_ & ~0x00000002);
      page_ = 0;
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

    // @@protoc_insertion_point(builder_scope:services.connect.v1.ListSessionsRequest)
  }

  // @@protoc_insertion_point(class_scope:services.connect.v1.ListSessionsRequest)
  private static final trinsic.services.connect.v1.ListSessionsRequest DEFAULT_INSTANCE;

  static {
    DEFAULT_INSTANCE = new trinsic.services.connect.v1.ListSessionsRequest();
  }

  public static trinsic.services.connect.v1.ListSessionsRequest getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static final com.google.protobuf.Parser<ListSessionsRequest> PARSER =
      new com.google.protobuf.AbstractParser<ListSessionsRequest>() {
        @java.lang.Override
        public ListSessionsRequest parsePartialFrom(
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

  public static com.google.protobuf.Parser<ListSessionsRequest> parser() {
    return PARSER;
  }

  @java.lang.Override
  public com.google.protobuf.Parser<ListSessionsRequest> getParserForType() {
    return PARSER;
  }

  @java.lang.Override
  public trinsic.services.connect.v1.ListSessionsRequest getDefaultInstanceForType() {
    return DEFAULT_INSTANCE;
  }
}
