import { join } from 'node:path';
import { askText, askChoice, askMulti } from './prompts.js';
import { selectTemplates, OPTIONAL_LABELS } from './manifest.js';
import { copyTemplates } from './copy.js';
import { initRepoAndCommit, isGhAuthed, createGhRepo, realRunner } from './git.js';

export async function runNew({ cwd, rl, runner = realRunner, templatesDir, owner }) {
  const name = await askText(rl, 'Project name');
  const visibility = await askChoice(rl, 'Visibility', ['private', 'public'], 'private');
  const description = await askText(rl, 'One-line description');

  const multiItems = [
    { key: 'design',        label: OPTIONAL_LABELS.design,        default: true },
    { key: 'brainstorming', label: OPTIONAL_LABELS.brainstorming, default: true },
    { key: 'prdWriter',     label: OPTIONAL_LABELS.prdWriter,     default: true },
    { key: 'goalsSetter',   label: OPTIONAL_LABELS.goalsSetter,   default: true },
  ];
  const options = await askMulti(rl, 'Include', multiItems);

  const projectDir = join(cwd, name);
  const templates = selectTemplates(options);
  const values = { PROJECT_NAME: name, DESCRIPTION: description };

  await copyTemplates({ srcDir: templatesDir, destDir: projectDir, templates, values });

  initRepoAndCommit({ runner, cwd: projectDir, message: 'venture: initial bootstrap' });

  let ghSkipped = false;
  if (isGhAuthed({ runner })) {
    createGhRepo({ runner, owner, name, visibility, description, cwd: projectDir });
  } else {
    ghSkipped = true;
  }

  return { projectDir, visibility, ghSkipped };
}
