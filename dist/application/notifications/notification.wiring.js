"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNotificationCenter = buildNotificationCenter;
const notification_center_1 = require("./notification-center");
const email_observer_1 = require("./observers/email.observer");
const sms_observer_1 = require("./observers/sms.observer");
const inapp_observer_1 = require("./observers/inapp.observer");
function buildNotificationCenter() {
    const center = new notification_center_1.NotificationCenter();
    center.subscribe(new inapp_observer_1.InAppNotificationObserver());
    center.subscribe(new email_observer_1.EmailNotificationObserver());
    center.subscribe(new sms_observer_1.SmsNotificationObserver());
    return center;
}
