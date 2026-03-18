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
const jsFiles = ['story.js', 'state.js', 'save.js', 'engine.js', 'core.js'];
let jsContent = '';
for (const file of jsFiles) {
    jsContent += fs.readFileSync(path.join(SRC_DIR, 'js', file), 'utf8') + '\\n\\n';
}

// Inject CSS and JS into HTML
let combinedHtml = htmlContent;
combinedHtml = combinedHtml.replace('<!-- INJECT_CSS -->', `<style>\\n${cssContent}\\n</style>`);
combinedHtml = combinedHtml.replace('<!-- INJECT_JS -->', `<script>\\n${jsContent}\\n</script>`);

const formatData = {
    name: "MobileCube",
    version: "0.1.0",
    author: "FrancescoLimpias",
    description: "A mobile-first story format for Twine based on SugarCube.",
    image: "icon.svg",
    url: "https://github.com/FrancescoLimpias/mobile-cube",
    license: "BSD-2-Clause",
    proofing: false,
    source: combinedHtml
};

const output = `window.storyFormat(${JSON.stringify(formatData)});`;

fs.writeFileSync(path.join(BUILD_DIR, 'format.js'), output, 'utf8');
console.log('Build completed. Generated dist/format.js');
