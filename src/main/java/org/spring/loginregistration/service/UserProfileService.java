package org.spring.loginregistration.service;

import org.spring.loginregistration.dto.UserProfileResponse;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.model.UserProfile;
import org.spring.loginregistration.repository.UserProfileRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileService (UserProfileRepository userProfileRepository, UserRepository userRepository){
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }

    public UserProfileResponse gettingInfo(Long userId){
        UserProfileResponse userProfileResponse = new UserProfileResponse();

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found."));
        Optional<UserProfile> optionalUserProfile = userProfileRepository.findByUser(user);

        if (optionalUserProfile.isEmpty()){
            throw new RuntimeException("No UserProfile found.");
        }

        UserProfile userProfile = optionalUserProfile.get();

        userProfileResponse.setAge(userProfile.getAge());
        userProfileResponse.setGender(userProfile.getGender());
        userProfileResponse.setBloodGroup(userProfile.getBloodGroup());
        userProfileResponse.setKnownDisease(userProfile.getKnownDisease());
        userProfileResponse.setSymptoms(userProfile.getSymptoms());
        userProfileResponse.setAllergies(userProfile.getAllergies());

        return userProfileResponse;

    }

    public void settingInfo(Long userId, UserProfileResponse userProfileResponse){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found."));
        UserProfile userProfile = new UserProfile();

        if (userProfileRepository.findByUser(user).isPresent()){
            throw new RuntimeException("User profile already Exist.");
        }
        userProfile.setUser(user);
        userProfile.setAge(userProfileResponse.getAge());
        userProfile.setGender(userProfileResponse.getGender());
        userProfile.setBloodGroup(userProfileResponse.getBloodGroup());
        userProfile.setKnownDisease(userProfileResponse.getKnownDisease());
        userProfile.setSymptoms(userProfileResponse.getSymptoms());
        userProfile.setAllergies(userProfileResponse.getAllergies());

        userProfileRepository.save(userProfile);

    }

    public void updateInfo(Long userId, UserProfileResponse userProfileResponse){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found."));

        Optional<UserProfile> userProfile = userProfileRepository.findByUser(user);
        if (userProfile.isEmpty()){
            throw new RuntimeException("No UserProfile found.");
        }

        UserProfile userProfile1 = userProfile.get();
        userProfile1.setAge(userProfileResponse.getAge());
        userProfile1.setGender(userProfileResponse.getGender());
        userProfile1.setBloodGroup(userProfileResponse.getBloodGroup());
        userProfile1.setKnownDisease(userProfileResponse.getKnownDisease());
        userProfile1.setSymptoms(userProfileResponse.getSymptoms());
        userProfile1.setAllergies(userProfileResponse.getAllergies());

        userProfileRepository.save(userProfile1);

    }
}
