// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.

// icon-color: green; icon-glyph: magic;
let htm = importModule('htm');

function h(type, props, ...children) {
  return {
    type,
    props,
    // use .html inside .html would cause children double array.
    children: children.flat(),
  };
}

let html = htm.bind(h);

function applyProps(comp, props = {}) {
  for (let prop in props) {
    let value = props[prop];
    if (prop[0] === '-') {
      // method
      comp[prop.substr(1)](...(value !== true ? value : [undefined]));
    } else if (prop === 'init') {
      // skip , init is for constructors
    } else if (prop === 'font') {
      comp[prop] = Array.isArray(value)
        ? Font[value[0]](value[1])
        : Font[value]();
    } else if (prop === 'padding') {
      comp.setPadding(...value);
    } else if (prop.includes('Color')) {
      comp[prop] = new Color(value);
    } else if (prop.includes('Size') || prop === 'size') {
      comp[prop] = new Size(...value);
    } else if (prop.includes('Offset')) {
      comp[prop] = new Point(...value);
    } else {
      comp[prop] = props[prop];
    }
  }
}

function applyChildren(comp, children = []) {
  for (let child of children) {
    let childComp = comp['add' + child.type](child.props && child.props.init);
    applyProps(childComp, child.props);
    applyChildren(childComp, child.children);
  }
}

function c(node) {
  let w = eval(`new ${node.type}()`);
  applyProps(w, node.props);
  applyChildren(w, node.children);
  return w;
}

function w(...args) {
  return c(html(...args));
}

module.exports = { c, w, html };
