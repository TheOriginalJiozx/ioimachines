package com.ioimachines.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${file.upload-dir:uploads}")
    private String uploadDirectory;
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String resolved = uploadDirectory;
        Path candidate = Paths.get(uploadDirectory);
        if (!candidate.isAbsolute()) {
            String home = System.getenv("HOME");
            if (home != null && !home.isBlank()) {
                resolved = Paths.get(home, uploadDirectory).toAbsolutePath().toString();
            } else {
                resolved = candidate.toAbsolutePath().toString();
            }
        } else {
            resolved = candidate.toAbsolutePath().toString();
        }
        String path = "file:" + (resolved.endsWith("/") ? resolved : resolved + "/");
        registry.addResourceHandler("/uploads/**").addResourceLocations(path);
    }
}
