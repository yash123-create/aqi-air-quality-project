package com.aqi.backend.service;

import com.aqi.backend.cache.LruCache;
import com.aqi.backend.dto.AqiApiResponse;
import com.aqi.backend.dto.AqiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class AqiService {

    @Value("${aqicn.api.token}")
    private String token;

    @Value("${aqicn.api.url}")
    private String baseUrl;

    private final Map<String, Map<String, Object>> cache = new LruCache<>(100);
    private static final long TTL = 10 * 60 * 1000;

    private final WebClient webClient = WebClient.create();

    private Map<String, String> aqiCategory(int aqi) {
        if (aqi <= 50) return Map.of("category", "Good", "color", "#009966");
        if (aqi <= 100) return Map.of("category", "Moderate", "color", "#ffde33");
        if (aqi <= 150) return Map.of("category", "Unhealthy for Sensitive Groups", "color", "#ff9933");
        if (aqi <= 200) return Map.of("category", "Unhealthy", "color", "#cc0033");
        if (aqi <= 300) return Map.of("category", "Very Unhealthy", "color", "#660099");
        return Map.of("category", "Hazardous", "color", "#7e0023");
    }

    public AqiResponse getAqi(String city) {
        String key = city.toLowerCase();

        if (cache.containsKey(key)) {
            Map<String, Object> entry = cache.get(key);
            long ts = (long) entry.get("timestamp");
            if (Instant.now().toEpochMilli() - ts < TTL) {
                AqiResponse cached = (AqiResponse) entry.get("data");
                cached.setSource("cache");
                return cached;
            }
        }

        String url = String.format("%s/%s/?token=%s", baseUrl, city, token);

        AqiApiResponse api = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(AqiApiResponse.class)
                .block();

        if (!"ok".equals(api.getStatus())) {
            throw new RuntimeException("City not found or API error");
        }

        Map<String, Object> data = api.getData();
        int aqi = (int) data.getOrDefault("aqi", -1);
        Map<String, String> meta = aqiCategory(aqi);

        Map<?, ?> cityMap = (Map<?, ?>) data.get("city");
        Map<?, ?> timeMap = (Map<?, ?>) data.get("time");

        AqiResponse res = new AqiResponse();
        res.setAqi(aqi);
        res.setCategory(meta.get("category"));
        res.setColor(meta.get("color"));
        res.setCity((String) cityMap.get("name"));

        java.util.List<?> geoList = (java.util.List<?>) cityMap.get("geo");
        double[] geo = new double[geoList.size()];
        for (int i = 0; i < geoList.size(); i++) {
            geo[i] = ((Number) geoList.get(i)).doubleValue();
        }
        res.setGeo(geo);

        res.setTime((String) timeMap.get("iso"));
        res.setDominantPollutant((String) data.get("dominentpol"));
        res.setDetails((Map<String, Object>) data.get("iaqi"));
        res.setSource("live");

        Map<String, Object> entry = new HashMap<>();
        entry.put("data", res);
        entry.put("timestamp", Instant.now().toEpochMilli());
        cache.put(key, entry);

        return res;
    }
}