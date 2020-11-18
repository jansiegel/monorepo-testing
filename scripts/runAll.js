const [ /* node bin */, /* path to this script */, command] = process.argv;
const spawn = require('child_process').spawnSync;
const order = [
  'monorepo-testing',
  'lib1',
  'lib2'
];
let hasErrors = false;

order.forEach((project) => {
  if (hasErrors) {
    return;
  }
  const spawnedCommand = spawn('npm', [
    'run',
    'in',
    project,
    command
  ], {
    stdio: 'inherit'
  });

  if (spawnedCommand.status) {
    hasErrors = true;
  }
});

if (hasErrors) {
  process.exitCode = 1;
}

