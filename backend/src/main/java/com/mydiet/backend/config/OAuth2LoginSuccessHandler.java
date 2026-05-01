package com.mydiet.backend.config;

import com.mydiet.backend.entity.User;
import com.mydiet.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extract user attributes from Google OAuth2 response
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        String googleId = oAuth2User.getAttribute("sub");

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        
        if (userOptional.isPresent()) {
            // Update existing user record
            user = userOptional.get();
            if (!"google".equals(user.getProvider())) {
                user.setProvider("google");
                user.setProviderUserId(googleId);
            }
            user.setAvatarUrl(picture);
            user = userRepository.save(user);
        } else {
            // Provision new user
            user = new User();
            user.setEmail(email);
            user.setUsername(name != null ? name : "Google User");
            user.setProvider("google");
            user.setProviderUserId(googleId);
            user.setAvatarUrl(picture);
            user = userRepository.save(user);
        }

        // Redirect to frontend client with user identifier
        String redirectUrl = frontendUrl + "/oauth2-redirect?userId=" + user.getId();
        response.sendRedirect(redirectUrl);
    }
}