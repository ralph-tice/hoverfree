// Copyright (c) 2013 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

function slice(a) {
  return Array.prototype.slice.call(a);
}

function qs(s) {
  return document.querySelector(s);
}

function qsa(s) {
  return document.querySelectorAll(s);
}

function ce(s) {
  return document.createElement(s);
}

function ge(s) {
  return document.getElementById(s);
}