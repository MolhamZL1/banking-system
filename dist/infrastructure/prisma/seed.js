"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = __importDefault(require("./client"));
async function main() {
    const username = 'admin';
    const email = 'orangegames16@gmail.com';
    const existing = await client_1.default.user.findFirst({
        where: { OR: [{ username }, { email }] },
    });
    if (existing) {
        console.log('Admin already exists');
        return;
    }
    const adminPass = process.env.ADMIN_PASSWORD;
    const passwordHash = await bcrypt_1.default.hash(adminPass, 10);
    await client_1.default.user.create({
        data: {
            username,
            email,
            passwordHash,
            role: 'ADMIN',
            isEmailVerified: true, // مهم: خليه مفعل مباشرة
        },
    });
    console.log('Admin created ✅');
}
main().finally(() => client_1.default.$disconnect());
