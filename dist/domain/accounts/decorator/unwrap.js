"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapToBase = unwrapToBase;
function unwrapToBase(acc) {
    let cur = acc;
    while (cur && typeof cur === "object" && "wrap" in cur)
        cur = cur.wrap;
    return cur;
}
