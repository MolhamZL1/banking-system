import { Observer } from './observer';

export class Subject<E> {
  private observers: Observer<E>[] = [];

  subscribe(observer: Observer<E>) {
    this.observers.push(observer);
  }

  async notify(event: E) {
    // ملاحظة: نخليها sequential حتى لو SMS/Email فشل نعرف مين فشل
    for (const o of this.observers) {
      await o.update(event);
    }
  }
}
