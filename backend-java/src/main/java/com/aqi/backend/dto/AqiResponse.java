package com.aqi.backend.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AqiResponse {
    private String city;
    private int aqi;
    private String category;
    private String color;
    private String dominantPollutant;
    private String time;
    private double[] geo;
    private Map<String, Object> details;
    private String source;
}