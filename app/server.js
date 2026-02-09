const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = 4000;
const PROJECT_ROOT = path.resolve(__dirname, '..');

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/generate', (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const systemPrompt =
    'You are a sales page generator. Read the CLAUDE.md file in the current directory for full instructions. ' +
    'IMPORTANT: Output ONLY raw HTML. No markdown fences. No explanations before or after. ' +
    'The output must be a SINGLE complete HTML file with all 7 sales page sections plus 4 modal overlays for legal pages (Terms, Privacy, Refund, Support). ' +
    'Footer links must use onclick to open modals instead of href to subpages. ' +
    'Include the inline script with openModal/closeModal functions before closing body tag. ' +
    'Start your response with the DOCTYPE declaration and end with closing html tag. Nothing else.';

  const fullPrompt = systemPrompt + '\n\nUser request: ' + prompt;

  // Pipe prompt via stdin to avoid Windows shell escaping issues
  const child = spawn('claude', ['-p', '--output-format', 'text', '--model', 'claude-haiku-4-5-20251001'], {
    cwd: PROJECT_ROOT,
    shell: true,
    windowsHide: true
  });

  let stdout = '';
  let stderr = '';
  let responded = false;

  // Set a manual timeout
  const timer = setTimeout(() => {
    if (!responded) {
      responded = true;
      child.kill();
      res.status(500).json({ error: 'Generation timed out (120s). Try a simpler prompt.' });
    }
  }, 300000);

  // Write prompt to stdin
  child.stdin.write(fullPrompt);
  child.stdin.end();

  child.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  child.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  child.on('error', (err) => {
    clearTimeout(timer);
    if (!responded) {
      responded = true;
      res.status(500).json({ error: 'Failed to start claude CLI: ' + err.message });
    }
  });

  child.on('close', (code) => {
    clearTimeout(timer);
    if (responded) return;
    responded = true;

    if (code !== 0) {
      const msg = stderr.trim() || 'Claude CLI exited with code ' + code;
      return res.status(500).json({ error: msg });
    }

    // Extract HTML from response
    let html = stdout.trim();

    // Remove ```html ... ``` wrapper if present
    const fenceMatch = html.match(/```html?\s*\n?([\s\S]*?)```/);
    if (fenceMatch) {
      html = fenceMatch[1].trim();
    }

    // Validate it looks like HTML
    if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html') && !html.startsWith('<!doctype')) {
      const htmlStart = html.indexOf('<!DOCTYPE');
      const htmlStartAlt = html.indexOf('<!doctype');
      const startIdx = htmlStart !== -1 ? htmlStart : htmlStartAlt;

      if (startIdx !== -1) {
        html = html.substring(startIdx);
      } else {
        return res.status(500).json({
          error: 'Response did not contain valid HTML. Try again.'
        });
      }
    }

    // Trim anything after closing </html>
    const htmlEndIdx = html.lastIndexOf('</html>');
    if (htmlEndIdx !== -1) {
      html = html.substring(0, htmlEndIdx + '</html>'.length);
    }

    res.json({ html });
  });
});

app.listen(PORT, () => {
  console.log('PV White Creator running at http://localhost:' + PORT);
});
