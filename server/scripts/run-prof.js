'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const mode = process.argv[2];
const serverDir = path.resolve(__dirname, '..');
const profilesDir = path.join(serverDir, 'profiles');

if (mode !== 'cpu' && mode !== 'heap') {
  console.error('Usage: node run-prof.js <cpu|heap>');
  process.exit(1);
}

fs.mkdirSync(profilesDir, { recursive: true });
console.log('Profiles dir:', profilesDir);

const nodeArgs =
  mode === 'cpu'
    ? [
        '--cpu-prof',
        `--cpu-prof-dir=${profilesDir}`,
        '--cpu-prof-name=cpu-profile.cpuprofile',
        'src/index.js',
      ]
    : [
        '--heap-prof',
        `--heap-prof-dir=${profilesDir}`,
        '--heap-prof-name=heap-profile.heapprofile',
        'src/index.js',
      ];

const result = spawnSync(process.execPath, nodeArgs, {
  cwd: serverDir,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
