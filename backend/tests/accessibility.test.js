const fs = require('fs');
const path = require('path');

describe('♿ Accessibility Compliance Test', () => {
    const htmlPath = path.join(__dirname, '../../frontend/index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    it('should contain ARIA landmarks and live regions', () => {
        expect(htmlContent).toContain('aria-live="polite"');
        expect(htmlContent).toContain('aria-live="assertive"');
        expect(htmlContent).toContain('aria-label=');
    });

    it('should have semantic HTML structure', () => {
        expect(htmlContent).toContain('<header>');
        expect(htmlContent).toContain('<main>');
        expect(htmlContent).toContain('<footer>');
        expect(htmlContent).toContain('<section');
    });
});
