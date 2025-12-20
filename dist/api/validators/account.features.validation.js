"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFeatureSchema = void 0;
const zod_1 = require("zod");
exports.AddFeatureSchema = zod_1.z.object({
    type: zod_1.z.enum(["PREMIUM", "INSURANCE", "OVERDRAFT_PLUS"]),
    numberValue: zod_1.z.coerce.number().nonnegative().optional(),
});
