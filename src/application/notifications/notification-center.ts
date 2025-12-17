import { Subject } from '../../domain/notifications/subject';
import { AccountEvent } from '../../domain/notifications/events';

export class NotificationCenter extends Subject<AccountEvent> {}
