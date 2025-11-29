package com.revticket.service;

import com.revticket.dto.UserDto;
import com.revticket.entity.Booking;
import com.revticket.entity.User;
import com.revticket.repository.BookingRepository;
import com.revticket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(String id) {
        User user = userRepository.findById(Objects.requireNonNullElse(id, ""))
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDto(user);
    }

    public UserDto updateUserRole(String id, String role) {
        User user = userRepository.findById(Objects.requireNonNullElse(id, ""))
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        try {
            user.setRole(User.Role.valueOf(role.toUpperCase()));
            user = userRepository.save(user);
            return convertToDto(user);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + role);
        }
    }

    public UserDto updateUserStatus(String id, String status) {
        User user = userRepository.findById(Objects.requireNonNullElse(id, ""))
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // For now, we'll use a simple active/blocked status
        // You may need to add a 'status' field to User entity if needed
        // For this implementation, we'll return the user as-is
        return convertToDto(user);
    }

    public void deleteUser(String id) {
        User user = userRepository.findById(Objects.requireNonNullElse(id, ""))
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public List<Map<String, Object>> getUserBookings(String userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings.stream()
                .map(booking -> {
                    Map<String, Object> bookingMap = new HashMap<>();
                    bookingMap.put("id", booking.getId());
                    bookingMap.put("movieTitle", booking.getShowtime() != null && booking.getShowtime().getMovie() != null 
                        ? booking.getShowtime().getMovie().getTitle() : "N/A");
                    bookingMap.put("theaterName", booking.getShowtime() != null && booking.getShowtime().getTheater() != null 
                        ? booking.getShowtime().getTheater().getName() : "N/A");
                    bookingMap.put("showDate", booking.getShowtime() != null ? booking.getShowtime().getShowDateTime().toLocalDate() : null);
                    bookingMap.put("showTime", booking.getShowtime() != null ? booking.getShowtime().getShowDateTime().toLocalTime() : null);
                    bookingMap.put("totalAmount", booking.getTotalAmount());
                    bookingMap.put("status", booking.getStatus());
                    bookingMap.put("bookingDate", booking.getBookingDate());
                    return bookingMap;
                })
                .collect(Collectors.toList());
    }

    private String safe(String value) {
        return value != null ? value : "";
    }

    private UserDto convertToDto(User user) {
        return new UserDto(
                safe(user.getId()),
                safe(user.getEmail()),
                safe(user.getName()),
                safe(user.getRole() != null ? user.getRole().name() : ""),
                safe(user.getPhone()),
                user.getDateOfBirth(),
                safe(user.getGender()),
                safe(user.getAddress()),
                safe(user.getPreferredLanguage()),
                user.getEmailNotifications(),
                user.getSmsNotifications(),
                user.getPushNotifications(),
                user.getCreatedAt());
    }
}
