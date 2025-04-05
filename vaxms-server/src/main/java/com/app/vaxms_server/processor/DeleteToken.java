package com.app.vaxms_server.processor;

import com.app.vaxms_server.config.Environment;
import com.app.vaxms_server.constant.Encoder;
import com.app.vaxms_server.constant.LogUtils;
import com.app.vaxms_server.constant.MomoException;
import com.app.vaxms_server.constant.Parameter;
import com.app.vaxms_server.dto.request.DeleteTokenRequest;
import com.app.vaxms_server.dto.response.DeleteTokenResponse;
import com.app.vaxms_server.dto.response.HttpResponse;

public class DeleteToken extends AbstractProcess<DeleteTokenRequest, DeleteTokenResponse> {
    public DeleteToken(Environment environment) {
        super(environment);
    }

    @Override
    public DeleteTokenResponse execute(DeleteTokenRequest request) throws MomoException {
        try {
            String payload = getGson().toJson(request, DeleteTokenRequest.class);

            HttpResponse response = execute.sendToMomo(environment.getMomoEndpoint().getTokenDeleteUrl(), payload);

            if (response.getStatus() != 200) {
                throw new MomoException("[DeleteTokenResponse] [" + request.getOrderId() + "] -> Error API");
            }

            System.out.println("uweryei7rye8wyreow8: "+ response.getData());

            DeleteTokenResponse deleteTokenResponse = getGson().fromJson(response.getData(), DeleteTokenResponse.class);
            String responserawData = Parameter.REQUEST_ID + "=" +
                    "&" + Parameter.ORDER_ID + "=" + deleteTokenResponse.getOrderId() +
                    "&" + Parameter.MESSAGE + "=" + deleteTokenResponse.getMessage() +
                    "&" + Parameter.RESULT_CODE + "=" + deleteTokenResponse.getResultCode();

            LogUtils.info("[DeleteTokenResponse] rawData: " + responserawData);

            return deleteTokenResponse;
        } catch (Exception exception) {
            LogUtils.error("[DeleteTokenResponse] "+ exception);
            throw new IllegalArgumentException("Invalid params capture MoMo Request");
        }
    }

    public static DeleteTokenResponse process(Environment env, String requestId, String orderId, String partnerClientId, String token) {
        try {
            DeleteToken m2Process = new DeleteToken(env);

            DeleteTokenRequest request = m2Process.createDeleteTokenRequest(orderId, requestId, partnerClientId, token);
            DeleteTokenResponse response = m2Process.execute(request);

            return response;

        } catch (Exception e) {
            LogUtils.error("[DeleteTokenProcess] " + e);
        }

        return null;
    }

    public DeleteTokenRequest createDeleteTokenRequest(String orderId, String requestId, String partnerClientId, String token) {
        try {
            String requestRawData = new StringBuilder()
                    .append(Parameter.ACCESS_KEY).append("=").append(partnerInfo.getAccessKey()).append("&")
                    .append(Parameter.ORDER_ID).append("=").append(orderId).append("&")
                    .append(Parameter.PARTNER_CLIENT_ID).append("=").append(partnerClientId).append("&")
                    .append(Parameter.PARTNER_CODE).append("=").append(partnerInfo.getPartnerCode()).append("&")
                    .append(Parameter.REQUEST_ID).append("=").append(requestId).append("&")
                    .append(Parameter.TOKEN).append("=").append(token)
                    .toString();

            String signRequest = Encoder.signHmacSHA256(requestRawData, partnerInfo.getSecretKey());
            LogUtils.debug("[DeleteTokenRequest] rawData: " + requestRawData + ", [Signature] -> " + signRequest);

        } catch (Exception e) {
            LogUtils.error("[DeleteTokenRequest] "+ e);
        }

        return null;
    }
}
