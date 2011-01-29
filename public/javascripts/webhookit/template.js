
var editor = CodeMirror.fromTextArea('code', {
  height: "350px",
  parserfile: "parsexml.js",
  stylesheet: "/javascripts/codemirror/css/xmlcolors.css",
  path: "/javascripts/codemirror/js/",
  continuousScanning: 500,
  lineNumbers: true
});