package com.app.vaxms_server.processor;


import com.app.vaxms_server.config.Environment;
import com.app.vaxms_server.config.PartnerInfo;
import com.app.vaxms_server.constant.Execute;
import com.app.vaxms_server.constant.MomoException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * @author hainguyen
 * Documention: https://developers.momo.vn
 */

public abstract class AbstractProcess<T, V> {
    protected PartnerInfo partnerInfo;
    protected Environment environment;
    protected Execute execute = new Execute();

    public AbstractProcess(Environment environment) {
        this.environment = environment;
        this.partnerInfo = environment.getPartnerInfo();
    }

    public static Gson getGson() {
        return new GsonBuilder()
                .disableHtmlEscaping()
                .create();
        }
    }

    public abstract V execute(T request) throws MomoException;
}
