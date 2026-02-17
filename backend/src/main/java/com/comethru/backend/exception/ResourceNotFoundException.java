package com.comethru.backend.exception;

import com.comethru.backend.entity.types.Resource;
import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BaseException {

    private final Resource resourceType;
    private final Object resourceId;

    private ResourceNotFoundException(Resource resourceType, Object resourceId) {
        super(
                resourceType + " with id " + resourceId + " not found",
                null,
                ErrorCode.RESOURCE_NOT_FOUND,
                HttpStatus.NOT_FOUND
        );
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }

    public Resource resourceType() {
        return resourceType;
    }

    public Object resourceId() {
        return resourceId;
    }

    public static ResourceNotFoundException resource(Resource resourceType, Object resourceId) {
        return new ResourceNotFoundException(resourceType, resourceId);
    }

    public static ResourceNotFoundException user(Long userId) {
        return new ResourceNotFoundException(Resource.USER, userId);
    }

    public static ResourceNotFoundException user(String phoneNumber) {
        return new ResourceNotFoundException(Resource.USER, phoneNumber);
    }
}