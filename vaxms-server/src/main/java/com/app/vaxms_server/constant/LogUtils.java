package com.app.vaxms_server.constant;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;

public class LogUtils {
    static Logger logger;

    public static void init() {
        logger = Logger.getLogger(LogUtils.class);
        BasicConfigurator.configure();
    }

    public static void info(String serviceCode, Object object) {
        logger.info(new StringBuilder().append("[").append(serviceCode).append("]: ").append(object));
    }

    public static void info(Object object) {
        logger.info(object);
    }

    public static void debug(Object object) {
        logger.debug(object);
    }

    public static void error(Object object) {
        logger.error(object);
    }

    public static void warn(Object object) {
        logger.warn(object);
    }
}
