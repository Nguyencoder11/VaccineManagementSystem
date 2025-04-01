package com.app.vaxms_server.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.sql.Time;

public class SqlTimeSerializer extends JsonDeserializer<Time> {
    @Override
    public Time deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        return Time.valueOf(jp.getValueAsString() + ":00");
    }
}
