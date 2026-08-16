import json, re

lines = open(r'C:\Users\altam\.gemini\antigravity-ide\brain\0993b3b3-3ce9-41b0-929c-6e90fa8b87a0\.system_generated\logs\transcript_full.jsonl', encoding='utf-8').readlines()
for line in lines:
    obj = json.loads(line)
    text = obj.get('content', '')
    if 'globals.css' in text and 'The following code has been modified to include a line number before every line' in text:
        m = re.search(r'The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>\. Please note that any changes targeting the original code should remove the line number, colon, and leading space\.\n((?:.+\n?)+)', text)
        if m:
            raw = m.group(1)
            clean_lines = []
            for l in raw.split('\n'):
                if l.strip() == 'The above content shows the entire, complete file contents of the requested file.':
                    continue
                clean_lines.append(re.sub(r'^\d+:\s?', '', l))
            open('frontend/src/app/globals.css', 'w', encoding='utf-8').write('\n'.join(clean_lines))
            print('Restored globals.css')
        break
