import {applicationGenerator} from "@nx/angular/generators";
import {Tree} from '@nx/devkit';
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
}

export default myGeneratorGenerator;
