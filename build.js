const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, 'dist');
const SRC_DIR = path.join(__dirname, 'src');

if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR);
}

const htmlContent = fs.readFileSync(path.join(SRC_DIR, 'index.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(SRC_DIR, 'css', 'core.css'), 'utf8');
const jsContent = fs.readFileSync(path.join(SRC_DIR, 'js', 'core.js'), 'utf8');

// Inject CSS and JS into HTML
let combinedHtml = htmlContent;
combinedHtml = combinedHtml.replace('<!-- INJECT_CSS -->', `<style>${cssContent}</style>`);
combinedHtml = combinedHtml.replace('<!-- INJECT_JS -->', `<script>${jsContent}</script>`);

const formatData = {
    name: "MobileCube",
    version: "0.1.0",
    author: "FrancescoLimpias",
    description: "A mobile-first story format for Twine.",
    image: "icon.svg",
    url: "https://github.com/FrancescoLimpias/mobile-cube",
    license: "BSD-2-Clause",
    proofing: false,
    source: combinedHtml
};

const output = `window.storyFormat(${JSON.stringify(formatData)});`;

fs.writeFileSync(path.join(BUILD_DIR, 'format.js'), output, 'utf8');
console.log('Build completed. Generated dist/format.js');
