package com.app.vaxms_server.constant;

import com.app.vaxms_server.dto.response.HttpResponse;
import com.app.vaxms_server.dto.request.HttpRequest;
import okhttp3.*;
import okio.Buffer;

import java.io.IOException;

public class Execute {
    OkHttpClient client = new OkHttpClient();

    public HttpResponse sendToMomo(String endpoint, String payload) {
        try {
            HttpRequest httpRequest = new HttpRequest("POST", endpoint, payload, "application/json");

            Request request = createRequest(httpRequest);

            LogUtils.debug("[HttpPostToMoMo] Endpoint:: " + httpRequest.getEndpoint() + ", RequestBody:: " + httpRequest.getPayload());

            Response result = client.newCall(request).execute();
            HttpResponse response = new HttpResponse(result.code(), result.body().string(), result.headers());

            LogUtils.info("[HttpResponseFromMoMo] " + response.toString());

            return response;
        }catch (Exception e){
            LogUtils.error("[ExecuteSendToMoMo] " + e);
        }
        return null;
    }

    public static Request createRequest(HttpRequest request) {
        RequestBody body = RequestBody.create(MediaType.get(request.getContentType()), request.getPayload());
        return new Request.Builder()
                .method(request.getMethod(), body)
                .url(request.getEndpoint())
                .build();
    }

    public String getBodyAsString(Request request) throws IOException {
        Buffer buffer = new Buffer();
        RequestBody body = request.body();
        body.writeTo(buffer);
        return buffer.readUtf8();
    }
}
