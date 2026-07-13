"use strict";

var log = console.log;

var tape;
var pointer;
var bracket;
var id_counter = 0;// an unique id for every [ and ]

var parsed;

const chars = ["+", "-", "<", ">", ".", ",", "[", "]"];

class Part {
    constructor(type, number = 1 /* for + - < > . , */, id, partner, partner_position, level, value /* for annotations */) {
        /*
        type == 0: +, type == 1: -,
        type == 2: <, type == 3: >,
        type == 4: ., type == 5: ,,
        type == 6: [, type == 7: ],
        type == -1: annotation
        */
        this.type = type;
        if (type === 0 || type === 1 || type === 2 || type === 3 || type === 4 || type === 5) {
            this.number = number;
            this.char = chars[type];
            this.str = this.char.repeat(number);
        } else if (type === 6 || type === 7) {
            this.id = id;
            this.partner = partner;
            this.partner_position = partner_position;
            this.char = chars[type];
            this.str = this.char;
            this.level = level;
            this.unmatched = false;// default.
        } else if (type === -1) {
            this.str = value;
        }
    }

    toHTML() {
        const HTML = document.createElement("span");
        HTML.classList.add(`char${this.type}`);
        if (this.type === 6 || this.type === 7) {
            if (!this.unmatched) {
                HTML.classList.add(`bracket-${this.level % 3}`);
            } else {
                HTML.classList.add('unmatched');
            }
        }
        if (this.type === -1) {
            HTML.classList.add("annotation");
            HTML.innerHTML = toHTMLstring(this.str);
        } else {
            HTML.innerHTML = this.str;
        }
        this.HTML = HTML;
        return HTML;
    }
}

function parse(code) {
    let parts = [];
    let char, type, number, value;
    let part;
    let left_position, left;
    let stack = [];
    let unmatched_rights = [];
    let last = undefined;

    for (let i = 0; i < code.length; i++) {
        char = code[i];
        if (number) {
            if (char === last) {
                number++;
                continue;
            } else {
                parts.push(new Part(type, number));
                number = undefined;
            }
        } else if (value) {
            if (!chars.includes(char)) {
                value += char;
                continue;
            } else {
                parts.push(new Part(-1, undefined, undefined, undefined, undefined, undefined, value));
                value = undefined;
            }
        }
        if (char === "+" || char === "-" || char === "<" || char === ">" || char === "." || char === ",") {
            type = chars.indexOf(char);
            last = char; 
            number = 1;
        } else if (char === "[") {
            // type = 6;
            stack.push(parts.length);
            parts.push(new Part(6, undefined, id_counter++, null, null, stack.length - 1));
        } else if (char === "]") {
            // type = 7;
            if (!stack.length) {
                log(111);
                part = new Part(7, undefined, id_counter++, null, null, 0);
                part.unmatched = true;
                unmatched_rights.push(part);
                parts.push(part);
                continue;
            }
            left_position = stack.pop();
            left = parts[left_position];
            left.partner = id_counter;
            left.partner_position = parts.length;
            parts.push(new Part(7, undefined, id_counter++, left.id, left_position, stack.length))
        } else if (!chars.includes(char)) {
            value = char;
        }
    }
    if (number) {
        parts.push(new Part(type, number));
    } else if (value) {
        parts.push(new Part(-1, undefined, undefined, undefined, undefined, undefined, value));
    }

    let unmatched_lefts = [];
    while (stack.length) {
        part = parts[stack.pop()];
        part.unmatched = true;
        unmatched_lefts.push(part);
    }
    return {parts, unmatched_rights, unmatched_lefts};
}

function init() {
    tape = [1];
    pointer = 0;
}
