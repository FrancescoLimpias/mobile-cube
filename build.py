import os
import json

base_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(base_dir, 'dist')
src_dir = os.path.join(base_dir, 'src')

if not os.path.exists(build_dir):
    os.makedirs(build_dir)

with open(os.path.join(src_dir, 'index.html'), 'r', encoding='utf-8') as f:
    html_content = f.read()

with open(os.path.join(src_dir, 'css', 'core.css'), 'r', encoding='utf-8') as f:
    css_content = f.read()

js_files = [
    'macro.js', 
    'wikifier.js', 
    'story.js', 
    'state.js', 
    'save.js', 
    'engine.js', 
    'macros/core.js', 
    'ui.js', 
    'core.js'
]
js_content = ""

for js_file in js_files:
    with open(os.path.join(src_dir, 'js', js_file), 'r', encoding='utf-8') as f:
        js_content += f.read() + "\n\n"

# Inject CSS and JS into HTML
combined_html = html_content.replace('<!-- INJECT_CSS -->', f'<style>\n{css_content}\n</style>')
combined_html = combined_html.replace('<!-- INJECT_JS -->', f'<script>\n{js_content}\n</script>')

format_data = {
    "name": "MobileCube",
    "version": "0.1.0",
    "author": "FrancescoLimpias",
    "description": "A mobile-first story format for Twine based on SugarCube.",
    "image": "icon.svg",
    "url": "https://github.com/FrancescoLimpias/mobile-cube",
    "license": "BSD-2-Clause",
    "proofing": False,
    "source": combined_html
}

output = f"window.storyFormat({json.dumps(format_data)});"

with open(os.path.join(build_dir, 'format.js'), 'w', encoding='utf-8') as f:
    f.write(output)

print("Build completed. Generated dist/format.js")
