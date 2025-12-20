"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClosedState = void 0;
class ClosedState {
    constructor() {
        this.name = 'CLOSED';
    }
    deposit() {
        throw new Error('Account is closed');
    }
    withdraw() {
        throw new Error('Account is closed');
    }
    freeze() {
        throw new Error('Account is closed');
    }
    suspend() {
        throw new Error('Account is closed');
    }
    activate() {
        throw new Error('Account is closed');
    }
    close() {
        // already closed
    }
}
exports.ClosedState = ClosedState;
