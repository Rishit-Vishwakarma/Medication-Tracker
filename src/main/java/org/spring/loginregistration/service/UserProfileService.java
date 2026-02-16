package org.spring.loginregistration.service;

import org.spring.loginregistration.model.User;
import org.spring.loginregistration.model.UserProfile;
import org.spring.loginregistration.repository.UserProfileRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileService(UserProfileRepository userProfileRepository, UserRepository userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }

    public UserProfile saveOrUpdateProfile(Long userId, UserProfile newProfile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserProfile existingProfile = userProfileRepository.findByUser(user)
                .orElse(new UserProfile());

        existingProfile.setUser(user);
        existingProfile.setAge(newProfile.getAge());
        existingProfile.setGender(newProfile.getGender());
        existingProfile.setBloodGroup(newProfile.getBloodGroup());
        existingProfile.setKnownDisease(newProfile.getKnownDisease());
        existingProfile.setSymptoms(newProfile.getSymptoms());
        existingProfile.setAllergies(newProfile.getAllergies());
        existingProfile.setNote(newProfile.getNote());
        
        // Added profile photo update
        if (newProfile.getProfilePhotoUrl() != null) {
            existingProfile.setProfilePhotoUrl(newProfile.getProfilePhotoUrl());
        }

        return userProfileRepository.save(existingProfile);
    }

    public UserProfile getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return userProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
    }
}
