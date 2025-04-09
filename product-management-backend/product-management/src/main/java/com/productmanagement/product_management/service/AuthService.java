package com.productmanagement.product_management.service;

import com.productmanagement.product_management.dto.*;
import com.productmanagement.product_management.entity.User;
import com.productmanagement.product_management.repository.UserRepository;
import com.productmanagement.product_management.security.JwtUtil;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication; // ✅ correct import!
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager manager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository repo, PasswordEncoder encoder, AuthenticationManager manager, JwtUtil jwtUtil) {
        this.repo = repo;
        this.encoder = encoder;
        this.manager = manager;
        this.jwtUtil = jwtUtil;
    }

    public void register(RegisterRequest req) {
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        repo.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        System.out.println("=== AuthService.login() called ===");

        System.out.println("Email: " + request.getEmail());
        System.out.println("Password: " + request.getPassword());

        try {
            System.out.println("Authenticating...");
            Authentication authentication = manager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword()
                    )
            );
            System.out.println("Authenticated: " + authentication.isAuthenticated());

            if (authentication.isAuthenticated()) {
                System.out.println("Generating JWT...");
                String token = jwtUtil.generateToken(request.getEmail());
                System.out.println("Generated token: " + token);
                return new AuthResponse(token);
            } else {
                System.out.println("Authentication failed.");
                throw new RuntimeException("Invalid credentials");
            }

        } catch (Exception e) {
            System.out.println("❌ Error in login: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Login failed", e);
        }
}
}
