import {applicationGenerator} from "@nx/angular/generators";
import {insertNgModuleImport} from "@nx/angular/src/generators/utils";
import {generateFiles, joinPathFragments, readProjectConfiguration, Tree} from '@nx/devkit';
import {insertImport} from "../utils/insert-import";
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

  const modulePath = joinPathFragments(projectDir, 'src', 'app', 'app.module.ts');
  insertImport(tree, modulePath, 'MyLibraryModule', '@my-workspace/my-library');
  insertNgModuleImport(tree, modulePath, 'MyLibraryModule');
}

export default myGeneratorGenerator;
