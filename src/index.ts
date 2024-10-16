export default function transform(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let dirtyFlag = false;

  // Replace `use` or `loader` property with `url-loader` to `type: 'asset/inline'`
  root.find(j.ObjectExpression).forEach((path) => {
      path.node.properties.forEach((prop, index) => {
          if (j.ObjectProperty.check(prop) && j.Identifier.check(prop.key)) {
              // Check for `use` as an array
              if (
                  prop.key.name === 'use' &&
                  j.ArrayExpression.check(prop.value) &&
                  prop.value.elements.some(
                      (el) =>
                          j.StringLiteral.check(el) &&
                          el.value === 'url-loader',
                  )
              ) {
                  path.node.properties[index] = j.objectProperty(
                      j.identifier('type'),
                      j.stringLiteral('asset/inline'),
                  );
                  dirtyFlag = true;
              }
              // Check for `use` as an object with `loader`
              else if (
                  prop.key.name === 'use' &&
                  j.ObjectExpression.check(prop.value) &&
                  prop.value.properties.some(
                      (innerProp) =>
                          j.ObjectProperty.check(innerProp) &&
                          j.Identifier.check(innerProp.key) &&
                          innerProp.key.name === 'loader' &&
                          j.StringLiteral.check(innerProp.value) &&
                          innerProp.value.value === 'url-loader',
                  )
              ) {
                  path.node.properties[index] = j.objectProperty(
                      j.identifier('type'),
                      j.stringLiteral('asset/inline'),
                  );
                  dirtyFlag = true;
              }
              // Check for `loader` directly
              else if (
                  prop.key.name === 'loader' &&
                  j.StringLiteral.check(prop.value) &&
                  prop.value.value === 'url-loader'
              ) {
                  path.node.properties[index] = j.objectProperty(
                      j.identifier('type'),
                      j.stringLiteral('asset/inline'),
                  );
                  dirtyFlag = true;
              }
          }
      });
  });

  // Rename function `webpack` to `rspack`
  root.find(j.ObjectProperty, { key: { name: 'webpack' } }).forEach(
      (path) => {
          if (j.Identifier.check(path.node.key)) {
              path.node.key.name = 'rspack';
              dirtyFlag = true;
          }
      },
  );

  return dirtyFlag ? root.toSource() : undefined;
}

export const parser = 'tsx';
