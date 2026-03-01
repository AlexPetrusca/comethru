package com.comethru.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        Contact contact = new Contact();
        Info info = new Info();
        return new OpenAPI().info(info
                .title("Comethru Backend API")
                .version("0.0.1-SNAPSHOT")
                .description("REST API documentation for the Comethru backend service")
                .contact(contact.name("Comethru Team"))
        );
    }
}
