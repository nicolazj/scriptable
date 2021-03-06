// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-brown; icon-glyph: magic;

// author: https://github.com/nicolazj/scriptable

// htm from https://unpkg.com/htm@3.0.4/dist/htm.umd.js
// prettier-ignore
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):n.htm=e()}(this,function(){var n=function(e,t,u,s){var r;t[0]=0;for(var p=1;p<t.length;p++){var h=t[p++],o=t[p]?(t[0]|=h?1:2,u[t[p++]]):t[++p];3===h?s[0]=o:4===h?s[1]=Object.assign(s[1]||{},o):5===h?(s[1]=s[1]||{})[t[++p]]=o:6===h?s[1][t[++p]]+=o+"":h?(r=e.apply(o,n(e,o,u,["",null])),s.push(r),o[0]?t[0]|=2:(t[p-2]=0,t[p]=r)):s.push(o)}return s},e=new Map;return function(t){var u=e.get(this);return u||(u=new Map,e.set(this,u)),(u=n(this,u.get(t)||(u.set(t,u=function(n){for(var e,t,u=1,s="",r="",p=[0],h=function(n){1===u&&(n||(s=s.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?p.push(0,n,s):3===u&&(n||s)?(p.push(3,n,s),u=2):2===u&&"..."===s&&n?p.push(4,n,0):2===u&&s&&!n?p.push(5,0,!0,s):u>=5&&((s||!n&&5===u)&&(p.push(u,0,s,t),u=6),n&&(p.push(u,n,0,t),u=6)),s=""},o=0;o<n.length;o++){o&&(1===u&&h(),h(o));for(var f=0;f<n[o].length;f++)e=n[o][f],1===u?"<"===e?(h(),p=[p],u=3):s+=e:4===u?"--"===s&&">"===e?(u=1,s=""):s=e+s[0]:r?e===r?r="":s+=e:'"'===e||"'"===e?r=e:">"===e?(h(),u=1):u&&("="===e?(u=5,t=s,s=""):"/"===e&&(u<5||">"===n[o][f+1])?(h(),3===u&&(p=p[0]),u=p,(p=p[0]).push(2,0,u),u=0):" "===e||"\t"===e||"\n"===e||"\r"===e?(h(),u=2):s+=e),3===u&&"!--"===s&&(u=4,p=p[0])}return h(),p}(t)),u),arguments,[])).length>1?u:u[0]}});

function h(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(),
  };
}

let parse = module.exports.bind(h);

function createWidget(node) {
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

  let widget = eval(`new ${node.type}()`);
  applyProps(widget, node.props);
  applyChildren(widget, node.children);
  return widget;
}

function presentWidget(widget) {
  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    widget.presentMedium();
  }
}
async function run(func) {
  try {
    await func();
  } catch (err) {
    let w = new ListWidget();
    w.addText(err.toString());
    presentWidget(w);
  } finally {
    Script.complete();
  }
}

function loadImage(url) {
  let req = new Request(url);
  return req.loadImage();
}

function randomColor() {
  return '#' + (((1 << 24) * Math.random()) | 0).toString(16);
}

module.exports = {
  parse,
  createWidget,
  loadImage,
  randomColor,
  presentWidget,
  run,
};
