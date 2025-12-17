import { NotificationCenter } from './notification-center';
import { EmailNotificationObserver } from './observers/email.observer';
import { SmsNotificationObserver } from './observers/sms.observer';
import { InAppNotificationObserver } from './observers/inapp.observer';

export function buildNotificationCenter() {
  const center = new NotificationCenter();

  center.subscribe(new InAppNotificationObserver());
  center.subscribe(new EmailNotificationObserver());
  center.subscribe(new SmsNotificationObserver());

  return center;
}
