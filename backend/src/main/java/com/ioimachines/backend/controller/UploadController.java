package com.ioimachines.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UploadController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDirectory;

    @PostMapping("/uploads")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "file required"));
        try {
            String original = file.getOriginalFilename();
            if (original == null) original = "";
            original = StringUtils.cleanPath(original);
            String external = "";
            int index = original.lastIndexOf('.');
            if (index >= 0) external = original.substring(index);
            String name = UUID.randomUUID().toString() + external;

            Path dirPath = Paths.get(uploadDirectory);
            if (!dirPath.isAbsolute()) {
                Path cwd = Paths.get("").toAbsolutePath();
                dirPath = cwd.resolve(uploadDirectory).normalize();
            } else {
                dirPath = dirPath.toAbsolutePath().normalize();
            }

            Files.createDirectories(dirPath);
            Path target = dirPath.resolve(name);
            Files.copy(file.getInputStream(), target);

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(name)
                    .toUriString();
            Map<String, Object> resp = new HashMap<>();
            resp.put("ok", true);
            resp.put("url", fileDownloadUri);
            resp.put("path", target.toString());
            return ResponseEntity.ok(resp);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "failed to save"));
        }
    }
}
