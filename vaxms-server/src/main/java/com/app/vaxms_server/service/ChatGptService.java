package com.app.vaxms_server.service;

import okhttp3.*;
//import org.cloudinary.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatGptService {
    @Value("${openai.api.key}")
    private String openaiApiKey;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/completions";

    public String getChatResponse(String userMessage) {
        RestTemplate restTemplate  = new RestTemplate();

        // Cấu trúc request body
        String requestBody = "{"
                + "\"model\": \"gpt-3.5-turbo\","
                + "\"messages\": [{\"role\": \"system\", \"content\": \"You are a helpful assistant.\"},"
                + "{\"role\": \"user\", \"content\": \"" + userMessage + "\"}],"
                + "\"max_tokens\": 150"
                + "}";

        // Tạo HTTP request với headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + openaiApiKey);
        headers.set("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        // Gửi POST request và nhận phản hồi
        ResponseEntity<String> response = restTemplate.exchange(
          OPENAI_API_URL,
          HttpMethod.POST,
          entity,
          String.class
        );

        // Xử lý kết quả trả về từ OpenAI API
        String responseBody = response.getBody();
        // Parse hoặc xử lý kết quả ở đây, ví dụ trích xuất phần message
        return responseBody;
    }

    public String askChatGpt(String message) {
        OkHttpClient client = new OkHttpClient();

        JSONObject json = new JSONObject();
        json.put("model", "gpt-3.5-turbo");
        json.put("message", new JSONArray()
                .put(new JSONObject().put("role", "user").put("content", message))
        );

        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, json.toString());

        Request request = new Request.Builder()
                .url("https://api.openai.com/v1/chat/completions")
                .addHeader("Authorization", "Bearer " + openaiApiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                String responseBody = response.body().string();
                JSONObject obj = new JSONObject(responseBody);
                return obj.getJSONArray("choices")
                        .getJSONObject(0)
                        .getJSONObject("message")
                        .getString("content");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "Xin lỗi, tôi không thể phản hồi lúc này.";
    }
}
