package com.aqi.backend.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AqiApiResponse {
    private String status;
    private Map<String, Object> data;
}