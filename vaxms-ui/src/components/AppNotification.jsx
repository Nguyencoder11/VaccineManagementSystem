import React from 'react';
import { notification } from 'antd';

const openNotificationWithIcon = (type, title, description, confirmBtn, onClick)=> {
    const handleOnClickBtn = () => {
        onClick();
        notification.destroy();
    }

    const btn = (
      <span onClick={handleOnClickBtn}>{confirmBtn}</span>
    );

    const notice = notification[type]({
        message: title,
        description: description,
        btn: confirmBtn ? btn : '',
    });

    return (
        <>
            {notice}
        </>
    )
}

export const AppNotification = {
    success: (title, description, confirmBtn, onClick) => {
        openNotificationWithIcon("success", title, description, confirmBtn, onClick);
    },
    info: (title, description, confirmBtn, onClick) => {
        openNotificationWithIcon("info", title, description, confirmBtn, onClick);
    },
    warning: (title, description, confirmBtn, onClick) => {
        openNotificationWithIcon("warning", title, description, confirmBtn, onClick);
    },
    error: (title, description, confirmBtn, onClick) => {
        openNotificationWithIcon("error", title, description, confirmBtn, onClick);
    },
}