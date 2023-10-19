import {applyChangesToString, ChangeType, joinPathFragments, readProjectConfiguration, Tree,} from '@nx/devkit';
import {classify, dasherize} from "@nx/devkit/src/utils/string-utils";
import {wrapAngularDevkitSchematic} from "nx/src/adapter/ngcli-adapter";
import {createSourceFile, Identifier, isIdentifier, isVariableStatement, ScriptTarget} from "typescript";
import {MyStepGeneratorSchema} from './schema';

export async function myStepGenerator(
  tree: Tree,
  options: MyStepGeneratorSchema
) {
  const moduleSchematic = wrapAngularDevkitSchematic(
    '@schematics/angular',
    'module'
  );
  await moduleSchematic(tree, {
    name: dasherize(options.name),
    project: options.project
  });

  const projectDir = readProjectConfiguration(tree, options.project).root;
  const configFileName = joinPathFragments(projectDir, 'src', 'app', 'app.config.ts');
  const fileContents = tree.read(configFileName).toString('utf-8');
  const sourceFile = createSourceFile(configFileName, fileContents, ScriptTarget.Latest);

  const stepsDeclaration = sourceFile.statements
    .filter(isVariableStatement)
    .map(s => s.declarationList.declarations[0])
    .filter(d => isIdentifier(d.name))
    .find(d => (d.name as Identifier).escapedText === 'loginSteps');

  const stepToAdd = `"${classify(options.name)}",`;
  const newContents = applyChangesToString(fileContents, [{
    type: ChangeType.Insert,
    index: stepsDeclaration.end - 1,
    text: stepToAdd
  }]);
  tree.write(configFileName, newContents);
}

export default myStepGenerator;
