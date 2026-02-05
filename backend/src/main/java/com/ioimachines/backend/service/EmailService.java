package com.ioimachines.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String smtpFrom;

    public boolean sendSimpleMessage(String to, String subject, String text, String replyTo) {
        if (mailSender == null) {
            log.info("[EmailService] Mail sender not configured. Logging email instead.");
            log.info("To: {}", to);
            log.info("Subject: {}", subject);
            log.info("Body: {}", text);
            if (replyTo != null && !replyTo.isEmpty())
                log.info("Reply-To: {}", replyTo);
            return true;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            if (smtpFrom != null && !smtpFrom.isEmpty())
                message.setFrom(smtpFrom);
            if (replyTo != null && !replyTo.isEmpty())
                message.setReplyTo(replyTo);
            mailSender.send(message);
            log.info("Sent email to {}", to);
            return true;
        } catch (Exception e) {
            log.error("Failed to send email", e);
            return false;
        }
    }
}
