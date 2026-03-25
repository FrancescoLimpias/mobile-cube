const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, 'dist');
const SRC_DIR = path.join(__dirname, 'src');

if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR);
}

const htmlContent = fs.readFileSync(path.join(SRC_DIR, 'index.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(SRC_DIR, 'css', 'core.css'), 'utf8');

// Concatenate JS files in the order they must be loaded
const jsFiles = [
    'macro.js', 
    'wikifier.js', 
    'story.js', 
    'state.js', 
    'save.js', 
    'engine.js', 
    'macros/core.js', 
    'ui.js', 
    'core.js'
];
let jsContent = '';
for (const file of jsFiles) {
    jsContent += fs.readFileSync(path.join(SRC_DIR, 'js', file), 'utf8') + '\n\n';
}

const logoPath = path.join(SRC_DIR, 'assets', 'logo.png');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const faviconHtml = `<link rel="icon" type="image/png" href="data:image/png;base64,${logoBase64}">`;

// Inject CSS, Favicon, and JS into HTML
let combinedHtml = htmlContent;
combinedHtml = combinedHtml.replace('<!-- INJECT_CSS -->', `<style>\n${cssContent}\n</style>`);
combinedHtml = combinedHtml.replace('<!-- INJECT_FAVICON -->', faviconHtml);
combinedHtml = combinedHtml.replace('<!-- INJECT_JS -->', `<script>\n${jsContent}\n</script>`);

const formatData = {
    name: "MobileCube",
    version: "0.1.0",
    author: "FrancescoLimpias",
    description: "A mobile-first story format for Twine based on SugarCube.",
    image: `data:image/png;base64,${logoBase64}`,
    url: "https://github.com/FrancescoLimpias/mobile-cube",
    license: "BSD-2-Clause",
    proofing: false,
    source: combinedHtml
};

const output = `window.storyFormat(${JSON.stringify(formatData)});`;

fs.writeFileSync(path.join(BUILD_DIR, 'format.js'), output, 'utf8');
console.log('Build completed. Generated dist/format.js');
