package com.app.vaxms_server.processor;

import com.app.vaxms_server.config.Environment;
import com.app.vaxms_server.constant.*;
import com.app.vaxms_server.dto.request.BindingTokenRequest;
import com.app.vaxms_server.dto.response.BindingTokenResponse;
import com.app.vaxms_server.dto.response.HttpResponse;

public class BindingToken extends AbstractProcess<BindingTokenRequest, BindingTokenResponse> {
    public BindingToken(Environment environment) {
        super(environment);
    }

    public static BindingTokenResponse process(Environment env, String orderId, String requestId, String partnerClientId, String callbackToken) {
        try {
            BindingToken m2Process = new BindingToken(env);

            BindingTokenRequest request = m2Process.createBindingTokenRequest(orderId, requestId, partnerClientId, callbackToken);
            BindingTokenResponse bindingTokenResponse = m2Process.execute(request);
        } catch (Exception e) {
            LogUtils.error("[BindingTokenProcess] " + e);
        }
        return null;
    }

    @Override
    public BindingTokenResponse execute(BindingTokenRequest request) throws MomoException {
        try {
            String payload = getGson().toJson(request, BindingTokenRequest.class);
            HttpResponse response = execute.sendToMomo(environment.getMomoEndpoint().getTokenBindUrl(), payload);

            if(response.getStatus() != 200) {
                throw new MomoException("[BindingTokenResponse] [" + request.getOrderId() + "] -> Error API");
            }

            System.out.println("uweryei7rye8wyreow8: " + response.getData());

            BindingTokenResponse bindingTokenResponse = getGson().fromJson(response.getData(), BindingTokenResponse.class);
            String responseRawData = Parameter.REQUEST_ID + "=" + bindingTokenResponse.getRequestId() +
                    "&" + Parameter.ORDER_ID + "=" + bindingTokenResponse.getOrderId() +
                    "&" + Parameter.MESSAGE + "=" + bindingTokenResponse.getMessage() +
                    "&" + Parameter.RESULT_CODE + "=" + bindingTokenResponse.getResultCode();
            LogUtils.info("[BindingTokenResponse] rawData: " + responseRawData);

            return bindingTokenResponse;

        } catch (Exception e) {
            LogUtils.error("[BindingTokenResponse] " + e);
            throw new IllegalArgumentException("Invalid params capture MoMo Request");
        }
    }

    public BindingTokenRequest createBindingTokenRequest(String orderId, String requestId, String partnerClientId, String callbackToken) {
        try {
            String requestRawData = new StringBuilder()
                    .append(Parameter.ACCESS_KEY).append("=").append(partnerInfo.getAccessKey()).append("&")
                    .append(Parameter.CALLBACK_TOKEN).append("=").append(callbackToken).append("&")
                    .append(Parameter.ORDER_ID).append("=").append(orderId).append("&")
                    .append(Parameter.PARTNER_CLIENT_ID).append("=").append(partnerClientId).append("&")
                    .append(Parameter.PARTNER_CODE).append("=").append(partnerInfo.getPartnerCode()).append("&")
                    .append(Parameter.REQUEST_ID).append("=").append(requestId)
                    .toString();

            String signRequest = Encoder.signHmacSHA256(requestRawData, partnerInfo.getSecretKey());
            LogUtils.debug("[BindingTokenRequest] rawData: " + requestRawData + ", [Signature] -> " + signRequest);

            return new BindingTokenRequest(partnerInfo.getPartnerCode(), orderId, requestId, Language.EN, partnerClientId, callbackToken, signRequest);
        } catch (Exception e) {
            LogUtils.error("[BindingTokenResponse] " + e);
        }

        return null;
    }

}
