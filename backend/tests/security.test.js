const request = require('supertest');
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(helmet());
app.get('/test', (req, res) => res.status(200).send('OK'));

describe('🛡️ Security Headers Test', () => {
    it('should have security headers enabled via Helmet', async () => {
        const response = await request(app).get('/test');
        
        // Check for essential security headers
        expect(response.headers['x-content-type-options']).toBe('nosniff');
        expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
        expect(response.headers['x-dns-prefetch-control']).toBe('off');
        expect(response.headers['strict-transport-security']).toBeDefined();
    });
});
