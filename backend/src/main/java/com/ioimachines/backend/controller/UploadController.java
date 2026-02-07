package com.ioimachines.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/uploads")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "file required"));
        try {
            String original = StringUtils.cleanPath(file.getOriginalFilename());
            String ext = "";
            int idx = original.lastIndexOf('.');
            if (idx >= 0) ext = original.substring(idx);
            String name = UUID.randomUUID().toString() + ext;

            Path dirPath = Paths.get(uploadDir);
            if (!dirPath.isAbsolute()) {
                Path cwd = Paths.get("").toAbsolutePath();
                Path candidate = cwd;
                Path resolved = null;
                try {
                    while (candidate != null) {
                        if (Files.exists(candidate.resolve("frontend"))) {
                            resolved = candidate.resolve(uploadDir).normalize();
                            break;
                        }
                        candidate = candidate.getParent();
                    }
                } catch (Exception ignored) {}
                if (resolved != null) dirPath = resolved;
                else dirPath = cwd.resolve(uploadDir).normalize();
            } else {
                dirPath = dirPath.toAbsolutePath().normalize();
            }

            Files.createDirectories(dirPath);
            Path target = dirPath.resolve(name);
            Files.copy(file.getInputStream(), target);

            String urlPath = "/" + dirPath.getFileName().toString() + "/" + name; // e.g. /uploads/uuid.jpg
            Map<String, Object> resp = new HashMap<>();
            resp.put("ok", true);
            resp.put("url", urlPath);
            resp.put("path", target.toString());
            return ResponseEntity.ok(resp);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "failed to save"));
        }
    }
}
