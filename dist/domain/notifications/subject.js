"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subject = void 0;
class Subject {
    constructor() {
        this.observers = [];
    }
    subscribe(observer) {
        this.observers.push(observer);
    }
    async notify(event) {
        // ملاحظة: نخليها sequential حتى لو SMS/Email فشل نعرف مين فشل
        for (const o of this.observers) {
            await o.update(event);
        }
    }
}
exports.Subject = Subject;
