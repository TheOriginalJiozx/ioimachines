package com.ioimachines.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class UploadsInitializer {
    private static final Logger logger = LoggerFactory.getLogger(UploadsInitializer.class);

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @PostConstruct
    public void ensureUploadsDir() {
        try {
            Path dirPath;
            Path candidate = Paths.get(uploadDir);
            if (candidate.isAbsolute()) {
                dirPath = candidate.toAbsolutePath().normalize();
            } else {
                String home = System.getenv("HOME");
                if (home != null && !home.isBlank()) {
                    dirPath = Paths.get(home, uploadDir).toAbsolutePath().normalize();
                } else {
                    dirPath = candidate.toAbsolutePath().normalize();
                }
            }
            Files.createDirectories(dirPath);
            logger.info("Ensured uploads directory exists: {}", dirPath.toString());
        } catch (IOException e) {
            logger.error("Failed to create uploads directory: {}", uploadDir, e);
        }
    }
}
