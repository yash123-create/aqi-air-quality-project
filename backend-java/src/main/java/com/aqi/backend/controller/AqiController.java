package com.aqi.backend.controller;

import com.aqi.backend.dto.AqiResponse;
import com.aqi.backend.service.AqiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AqiController {

    private final AqiService aqiService;

    public AqiController(AqiService aqiService) {
        this.aqiService = aqiService;
    }

    @GetMapping("/aqi")
    public AqiResponse getAqi(@RequestParam String city) {
        if (city == null || city.isBlank()) {
            throw new RuntimeException("City parameter is required");
        }
        return aqiService.getAqi(city);
    }
}