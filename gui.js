"use strict";

const code_box = document.querySelector("div#code-box");
var code = code_box.innerText;

code_box.addEventListener("input", function(event) {
    const type = event.inputType;
    if (type === "insertText") {
        const char = event.data;
    }
    code = code_box.innerText;
});

var debug = false;
var div_debug = document.querySelector("div.block.debug");
var debug_button = document.querySelector("button#debug-button");

debug_button.addEventListener("click", function() {
    div_debug.classList.toggle("none-display", debug);
    debug = !debug;
});

function toHTMLstring(str) {
    let r = ""// return
    let c;
    for (c of str) {
        switch (c) {
            case "\n": {
                r += "<br>";
                break;
            }
            default: {
                r += c;
            }
        }
    }
    return r;
}

function format_codebox() {
    parsed = parse(code);
    code_box.innerHTML = "";
    let part;
    for (part of parsed.parts) {
        code_box.appendChild(part.toHTML());
    }
}