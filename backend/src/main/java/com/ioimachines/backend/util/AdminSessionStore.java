package com.ioimachines.backend.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AdminSessionStore {
    private static class Session {
        long adminId;
        long expiresAt;

        Session(long adminId, long expiresAt) {
            this.adminId = adminId;
            this.expiresAt = expiresAt;
        }
    }

    private final Map<String, Session> sessions = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();
    private final long defaultTtlSeconds = 60 * 60 * 24;

    public String createSession(long adminId) {
        byte[] b = new byte[32];
        random.nextBytes(b);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(b);
        long exp = Instant.now().getEpochSecond() + defaultTtlSeconds;
        sessions.put(token, new Session(adminId, exp));
        return token;
    }

    public Long validate(String token) {
        if (token == null)
            return null;
        Session s = sessions.get(token);
        if (s == null)
            return null;
        if (Instant.now().getEpochSecond() > s.expiresAt) {
            sessions.remove(token);
            return null;
        }
        return s.adminId;
    }

    public void revoke(String token) {
        if (token == null)
            return;
        sessions.remove(token);
    }
}
