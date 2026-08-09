"use strict";

var log = console.log;

const MAX = 30000 - 1;

var tape, pointer, index, num, order, last;
var bracket;
var id_counter = 0;// an unique id for every [ and ]
var outputs = [];

var parsed;

var intervalID;// of the run loop.

const operators = ["+", "-", ">", "<", ".", ",", "[", "]"];

class Part {
    constructor(type, number = 1 /* for + - > < . , */, id, partner, partner_position, level, value /* for annotations */) {
        /*
        type == 0: +, type == 1: -,
        type == 2: >, type == 3: <,
        type == 4: ., type == 5: ,,
        type == 6: [, type == 7: ],
        type == -1: annotation
        */
        this.type = type;
        if (type === 0 || type === 1 || type === 2 || type === 3 || type === 4 || type === 5) {
            this.number = number;
            this.char = operators[type];
            this.str = this.char.repeat(number);
        } else if (type === 6 || type === 7) {
            this.id = id;
            this.partner = partner;
            this.partner_position = partner_position;
            this.char = operators[type];
            this.str = this.char;
            this.level = level;
            this.unmatched = false;// default.
        } else if (type === -1) {
            this.str = value;
        }
    }

    toHTML() {
        const HTMLs = [];
        let HTML;
        switch (this.type) {
            case 0: case 1: case 2: case 3: case 4: case 5: {
                for (let i = 0; i < this.number; i++) {
                    HTML = document.createElement("span");
                    HTML.classList.add(`char${this.type}`);
                    HTML.classList.add(`number${this.number}`);
                    HTML.innerHTML = this.char;
                    HTMLs.push(HTML);
                }
                break;
            }
            case 6: case 7: {
                HTML = document.createElement("span");
                HTML.classList.add(`char${this.type}`);
                HTML.classList.add(
                    this.unmatched ? "unmatched" : `bracket-${this.level % 3}`
                );
                HTML.innerHTML = this.str;
                HTMLs.push(HTML);
                break;
            }
            case -1: {
                for (let c of this.str) {
                    HTML = document.createElement("span");
                    HTML.classList.add("annotation");
                    HTML.innerHTML = toHTMLchar(c);
                    HTMLs.push(HTML);
                }
                break;
            }
        }
        this.HTMLs = HTMLs;
        return HTMLs;
    }

    current() {
        for (let html of this.HTMLs) {
            html.classList.add("current");
        }
    }
    noncurrent() {
        for (let html of this.HTMLs) {
            html.classList.remove("current");
        }
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
            if (!operators.includes(char)) {
                value += char;
                continue;
            } else {
                parts.push(new Part(-1, undefined, undefined, undefined, undefined, undefined, value));
                value = undefined;
            }
        }
        if (char === "+" || char === "-" || char === ">" || char === "<" || char === "." || char === ",") {
            type = operators.indexOf(char);
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
        } else if (!operators.includes(char)) {
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
    parsed = parse(code);
    format_codebox();
    output_area.replaceChildren()
    tape = [0];
    pointer = 0;
    index = 0;
    // num = 0;
    order = parsed.parts[0];
    last = undefined;
    origin = -cells_half_id;
}

function next() {
    if (debug) {
        last?.noncurrent();
        order.current();
    }
    last = order;
    for(index++; index < parsed.parts.length; index++) {
        order = parsed.parts[index];
        if (order.type !== -1) {
            return;
        }
    }
    order = 0;
    end();
}

function step() {
    // log(order.HTML);
    switch (order.type) {
        case 0: { // +
            tape[pointer] = (tape[pointer] + order.number) % 256;
            next();
            break;
        }
        case 1: { // -
            tape[pointer] = ((tape[pointer] - order.number) % 256 + 256) % 256;
            next();
            break;
        }
        case 2: { // >
            let last_pointer = pointer;
            pointer += order.number;
            if (pointer > MAX) {
                pointer = MAX;
            }
            if (! tape[pointer]){
                tape[pointer] = 0;
            }
            if (debug && ! stick) {
                origin += pointer - last_pointer;
            }
            next();
            break;
        }
        case 3: { // <
            let last_pointer = pointer;
            pointer -= order.number;
            if (pointer < 0) {
                pointer = 0;
            }
            if (! tape[pointer]){
                tape[pointer] = 0;
            }
            if (debug && ! stick) {
                origin += pointer - last_pointer;
            }
            next();
            break;
        }
        case 4: { // .
            // Output
            output(tape[pointer], order.number);
            next();
            break;
        }
        case 5: { // ,
            // Input
            log("input", order.number);
            next();
            break;

        }
        case 6: { // [
            if (tape[pointer]) {
                next();
                break;
            }
            if (debug) {
                last?.noncurrent();
                order.current();
            }
            last = order;
            index = order.partner_position;
            order = parsed.parts[index];
            break;
        }
        case 7: {
            if (! tape[pointer]) {
                next();
                break;
            }
            if (debug) {
                last?.noncurrent();
                order.current();
            }
            last = order;
            index = order.partner_position;
            order = parsed.parts[index];
            break;
        }
    }
    // log(tape);
    if (debug) {
        show_tape();
    }
}

function run() {
    init()
    code_box.setAttribute("contenteditable", false);
    if (debug) {
        intervalID = setInterval(step, speed);
    } else {
        while (order) {
            step();
        }
    }
}