export default function transform(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let dirtyFlag = false;

  // Replace `use` property with `url-loader` or `loader` property with `url-loader` to `type: 'asset/inline'`
  root.find(j.ObjectExpression).forEach(path => {
    const usePropertyIndex = path.node.properties.findIndex(prop =>
      j.ObjectProperty.check(prop) &&
      j.Identifier.check(prop.key) &&
      prop.key.name === 'use' &&
      ((j.ArrayExpression.check(prop.value) && prop.value.elements.some(el => j.StringLiteral.check(el) && el.value === 'url-loader')) ||
        (j.ObjectExpression.check(prop.value) && prop.value.properties.some(innerProp =>
          j.ObjectProperty.check(innerProp) &&
          j.Identifier.check(innerProp.key) &&
          innerProp.key.name === 'loader' &&
          j.StringLiteral.check(innerProp.value) &&
          innerProp.value.value === 'url-loader')))
    );

    if (usePropertyIndex !== -1) {
      path.node.properties[usePropertyIndex] = j.objectProperty(j.identifier('type'), j.stringLiteral('asset/inline'));
      dirtyFlag = true;
    }
  });

  // Rename function `webpack` to `rspack`
  root.find(j.ObjectProperty, { key: { name: 'webpack' } }).forEach(path => {
    if (j.Identifier.check(path.node.key)) {
      path.node.key.name = 'rspack';
      dirtyFlag = true;
    }
  });

  return dirtyFlag ? root.toSource() : undefined;
}


export const parser = "tsx";