// wikifier.js - Parses passage text, resolving Twine markup, variables, and macros

window.Wikifier = (function() {
  
  /**
   * Safe evaluator function to parse simple JS expressions in the context of State.variables and State.temporary.
   * VERY basic implementation. In a full version, this would be a robust expression evaluation engine.
   */
  function evalTwineExpression(expr) {
      if (!expr) return undefined;
      
      // Basic alias replacements for TwineScript
      let jsExpr = expr
        .replace(/\bto\b/g, '=')
        .replace(/\beq\b/g, '==')
        .replace(/\bneq\b/g, '!=')
        .replace(/\bgt\b/g, '>')
        .replace(/\bgte\b/g, '>=')
        .replace(/\blt\b/g, '<')
        .replace(/\blte\b/g, '<=')
        .replace(/\band\b/g, '&&')
        .replace(/\bor\b/g, '||')
        .replace(/\bnot\b/g, '!');

      // We use a small hack to replace $var with State.variables.var and _var with State.temporary.var
      jsExpr = jsExpr.replace(/\$([a-zA-Z0-9_]+)/g, "State.variables.$1");
      jsExpr = jsExpr.replace(/_([a-zA-Z0-9_]+)/g, "State.temporary.$1");

      try {
          return (new Function(`return (${jsExpr});`))();
      } catch (e) {
          console.error("Wikifier expression error: " + jsExpr, e);
          return null;
      }
  }

  /**
   * Safely execute a Twine statement (like setting a variable)
   */
  function executeTwineStatement(stmt) {
       // Similar to expression eval, but we don't return anything
       let jsExpr = stmt
        .replace(/\bto\b/g, '=')
        .replace(/\$([a-zA-Z0-9_]+)/g, "State.variables.$1")
        .replace(/_([a-zA-Z0-9_]+)/g, "State.temporary.$1");

      try {
          (new Function(`${jsExpr};`))();
      } catch (e) {
          console.error("Wikifier statement error: " + jsExpr, e);
      }
  }

  class Wikifier {
      constructor(target, source) {
          this.target = target;
          this.source = source;
          this.output = document.createDocumentFragment();
          this.wikify();
          if (this.target) {
              this.target.appendChild(this.output);
          }
      }

      wikify() {
          // MVP Parsing Strategy
          // 1. Convert newlines to breaks or paragraphs (if not inside HTML tags ideally, but MVP here)
          // 2. Parse Links [[Link]]
          // 3. Parse Macros <<macro ...>> ... <</macro>>
          
          let text = this.source;

          // Process Macros (Simplistic matching)
          // Support pairing blocks and inline execution. For MVP we'll just evaluate <<set>> and conditional blocks.
          
          // Before anything else, parse and execute <<set>>
          text = text.replace(/<<set\s+(.+?)>>/g, (match, expression) => {
              executeTwineStatement(expression);
              return ''; // Remove from output
          });

          // Hacky <<if>> processing for MVP
          // Note: Full Twine macro parsing is deeply recursive and complex. 
          // For a true engine, we'd tokenize. Here, we'll do simple split logic.
          let ifBlocks = [];
          while (text.includes('<<if ')) {
              const startIdx = text.indexOf('<<if ');
              const endIf = text.indexOf('<</if>>', startIdx);
              if (endIf === -1) break;

              const fullBlock = text.substring(startIdx, endIf + 7);
              
              // Evaluate conditions
              const conditionMatch = fullBlock.match(/<<if\s+(.+?)>>/);
              let renderContent = '';

              if (conditionMatch) {
                  const [ifHeader, ifExpr] = conditionMatch;
                  
                  // Simplistic split logic checking <<elseif>> and <<else>>
                  let sectionsText = fullBlock.substring(ifHeader.length, fullBlock.length - 7);
                  
                  // This MVP only supports single if/else to keep logic sane for now.
                  const elseSplit = sectionsText.split('<<else>>');
                  const targetContent = evalTwineExpression(ifExpr) ? elseSplit[0] : (elseSplit[1] || '');
                  
                  text = text.substring(0, startIdx) + targetContent + text.substring(endIf + 7);
              } else {
                  // Fallback to remove broken macro
                  text = text.substring(0, startIdx) + text.substring(endIf + 7);
              }
          }

          // Evaluate raw variables: $var, _var
          text = text.replace(/(^|[^\w])\$([a-zA-Z0-9_]+)/g, (match, pre, varName) => {
              return pre + (State.variables[varName] !== undefined ? State.variables[varName] : match);
          });
          text = text.replace(/(^|[^\w])_([a-zA-Z0-9_]+)/g, (match, pre, varName) => {
              return pre + (State.temporary[varName] !== undefined ? State.temporary[varName] : match);
          });

          // Escape remaining basic HTML except script tags
          let parsed = text;

           // Re-instate strong/em
           // Too complex for RegExp without side-effects, so we'll just allow some simple ones if needed.

          // Parse links: [[Link]] or [[Title|Link]]
          parsed = parsed.replace(/\[\[(.*?)\]\]/g, (match, inner) => {
            let title = inner;
            let target = inner;

            if (inner.includes('|')) {
              [title, target] = inner.split('|');
            } else if (inner.includes('->')) {
              [title, target] = inner.split('->');
            } else if (inner.includes('<-')) {
              [target, title] = inner.split('<-');
            }

            title = title.trim();
            target = target.trim();

            const className = Story.has(target) ? 'link-internal' : 'link-broken';
            const action = `onclick="Engine.play('${target.replace(/'/g, "\\'")}')"`;

            return `<a href="javascript:void(0)" class="${className}" ${action}>${title}</a>`;
          });

          // Parse explicit buttons/links: <<button "Text" "Passage">><</button>> or <<link "Text" "Passage">><</link>>
          parsed = parsed.replace(/<<(button|link)\s+"([^"]+)"(?:\s+"([^"]+)")?>>([\s\S]*?)<<\/\1>>/g, (match, macroName, title, target, innerContent) => {
             const isButton = macroName === 'button';
             const dest = target || title;
             let className = '';
             let action = '';

             if (dest) {
                 className = (isButton ? 'macro-button ' : '') + 'macro-' + macroName + ' ' + (Story.has(dest) ? 'link-internal' : 'link-broken');
                 action = `onclick="Engine.play('${dest.replace(/'/g, "\\'")}')"`;
             }

             if (isButton) {
                 return `<button class="${className}" ${action}>${title}</button>`;
             } else {
                 return `<a href="javascript:void(0)" class="${className}" ${action}>${title}</a>`;
             }
          });

          // Text to DOM Conversion
          const container = document.createElement('div');
          
          // Fast line break transformation
          parsed = '<p>' + parsed.split(/\n\n+/).join('</p><p>') + '</p>';
          parsed = parsed.replace(/\n/g, '<br>');

          container.innerHTML = parsed;
          
          while(container.firstChild) {
              this.output.appendChild(container.firstChild);
          }
      }
  }

  return Wikifier;
})();
