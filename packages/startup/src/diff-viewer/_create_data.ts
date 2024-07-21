import path from 'path';
import fs from 'fs';

const baseDir = path.resolve(__dirname, '..', '..');
console.log(`🚀 ~ baseDir:`, baseDir);

const filePath = 'src/filesystem/index.tsx';

const fullPath = path.join(baseDir, filePath);

const content = fs.readFileSync(fullPath, 'utf-8');

function interceptCode(code: string) {
  const lines = code.split('\n');

  // random delete some lines
  const deleteCount = Math.floor(Math.random() * 10);

  for (let i = 0; i < deleteCount; i++) {
    const randomIndex = Math.floor(Math.random() * lines.length);
    lines.splice(randomIndex, 1);
  }

  return lines.join('\n');
}

const file2 = 'src/diff-viewer/index.tsx';
const fullPath2 = path.join(baseDir, file2);
const content2 = fs.readFileSync(fullPath2, 'utf-8');

const data = [
  {
    path: filePath,
    oldCode: content,
    newCode: interceptCode(content)
  },
  {
    path: file2,
    oldCode: content2,
    newCode: content2
  }
]

fs.writeFileSync(path.join(baseDir, 'src/diff-viewer/data.json'), JSON.stringify(data, null, 2));
