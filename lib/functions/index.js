"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssr = void 0;
/**
 * This file is the main entrypoint for your backend functions.
 * It should be deployed as a Cloud Function.
 */
const firebase_functions_1 = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const next_1 = __importDefault(require("next"));
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev, conf: { distDir: '.next' } });
const handle = app.getRequestHandler();
// App Hosting uses this automatically-provisioned function to serve your app.
exports.ssr = firebase_functions_1.httpsd_v2.onRequest({
    // Make function publicly accessible by default.
    invoker: 'public',
    // Set concurrency to 1000, may need to be raised for production apps.
    concurrency: 1000,
    // Keep instances warm to reduce startup latency.
    minInstances: 0,
    // Memory and CPU can be raised for more demanding apps.
    memory: '1GiB',
    cpu: 1,
}, async (req, res) => {
    // Wait for Next.js to be ready.
    await app.prepare();
    // Proxy the request to Next.js.
    return handle(req, res);
});
// Initialize Firebase Admin SDK.
firebase_admin_1.app.initializeApp();
//# sourceMappingURL=index.js.map