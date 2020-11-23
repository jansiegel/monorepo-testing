const { spawnSync, execSync } = require('child_process');
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).replace(/(\n)/gm, '');
const filesModifiedInLastCommit = execSync('git log --name-only --oneline HEAD^..HEAD', { encoding: 'utf8' }).split('\n');
const wrapperList = ['lib1', 'lib2'];
const fullTestBranches = ['test', 'codesandbox-', 'release/'];
const spawnCommand = (command) => {
  if (hasErrors) {
    return;
  }
  const spawnedCommand = spawnSync('npm', command.split(' '), {
    stdio: 'inherit'
  });

  if (spawnedCommand.status) {
    hasErrors = true;
  }

  return !hasErrors;
};
let hasErrors = false;

filesModifiedInLastCommit.shift();
filesModifiedInLastCommit.pop();

const fullTestBranchMatch = currentBranch.match(
  `(${fullTestBranches.join('|').replace('/', '\\\\/')}).*`
);

if (fullTestBranchMatch !== null && fullTestBranchMatch.index === 0) {
  const status = spawnCommand('run all test');

  if (!status) {
    process.exitCode = 1;
  }

  return;
}

const touchedProjects = [];

filesModifiedInLastCommit.forEach((fileUrl) => {
  if (fileUrl.includes('CHANGELOG')) {
    return;
  }

  const wrappersMatch = fileUrl.match('(wrappers\/)([^\/]*)(\/)');
  if (wrappersMatch) {
    const projectName = wrappersMatch[2];

    if (
      wrapperList.includes(projectName) &&
      !touchedProjects.includes(projectName)
    ) {
      touchedProjects.push(projectName);
    }

  } else {
    if (!touchedProjects.includes('monorepo-test')) {
      touchedProjects.push('monorepo-test');
    }
  }
});

console.log(touchedProjects);


touchedProjects.forEach((project) => {
  const status = spawnCommand(`run in ${project} test`);

  if (!status) {
    process.exitCode = 1;
  }
});
