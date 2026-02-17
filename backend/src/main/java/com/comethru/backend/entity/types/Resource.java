package com.comethru.backend.entity.types;

public enum Resource {
    USER("User");

    private final String value;

    Resource(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }
}
