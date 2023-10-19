import {applicationGenerator} from "@nx/angular/generators";
import {generateFiles, joinPathFragments, readProjectConfiguration, Tree} from '@nx/devkit';
import {MyGeneratorGeneratorSchema} from './schema';

export async function myGeneratorGenerator(
  tree: Tree,
  options: MyGeneratorGeneratorSchema
) {
  await applicationGenerator(tree, {
    name: options.name,
    routing: true,
    prefix: options.name,
    style: 'scss'
  });

  const sourceDir = joinPathFragments(__dirname, 'files');
  const projectDir = readProjectConfiguration(tree, options.name).root;
  const destinationDir = joinPathFragments(projectDir, 'src', 'app');
  generateFiles(tree, sourceDir, destinationDir, {});
}

export default myGeneratorGenerator;
