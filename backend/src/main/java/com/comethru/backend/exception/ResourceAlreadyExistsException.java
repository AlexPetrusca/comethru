package com.comethru.backend.exception;

import com.comethru.backend.entity.types.Resource;
import org.springframework.http.HttpStatus;

public class ResourceAlreadyExistsException extends BaseException {

    private final Resource resourceType;
    private final Object resourceId;

    private ResourceAlreadyExistsException(Resource resourceType, Object resourceId) {
        super(
                resourceType + " with id " + resourceId + " already exists",
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

    public static ResourceAlreadyExistsException resource(Resource resourceType, Object resourceId) {
        return new ResourceAlreadyExistsException(resourceType, resourceId);
    }

    public static ResourceAlreadyExistsException user(Long userId) {
        return new ResourceAlreadyExistsException(Resource.USER, userId);
    }

    public static ResourceAlreadyExistsException user(String phoneNumber) {
        return new ResourceAlreadyExistsException(Resource.USER, phoneNumber);
    }
}