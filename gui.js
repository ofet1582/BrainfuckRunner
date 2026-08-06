"use strict";


var debug = false;
var stick = false;
// var quick = false; //useless in this ver.
var output_mode = 0;// string.
var cells_number = 17;
var cells_half_id = (cells_number - 1) / 2; // 8.
var cells = [];
var origin = -cells_half_id;

var speed = 200 // 1s / delay

var chars = unicode;

const code_box = document.querySelector("div#code-box");
var code = code_box.innerText;
code_box.addEventListener("beforeinput", function(event) {
    log(event);
    const type = event.inputType;
    if (type === "insertText") {
        const char = event.data;
    }
    code = code_box.innerText;
});

const div_debug = document.querySelector("div.block.debug");
const debug_button = document.querySelector("button#debug-button");
debug_button.addEventListener("click", function() {
    div_debug.classList.toggle("none-display", debug);
    debug = !debug;
});

const left_button = document.querySelector("button#move-left");
const right_button = document.querySelector("button#move-right");
left_button.addEventListener("click", function() {
    origin--;
    mid_cell_input.value = origin + cells_half_id;
    show_tape();
})
right_button.addEventListener("click", function() {
    origin++;
    mid_cell_input.value = origin + cells_half_id;
    show_tape();
})
const mid_cell_input = document.querySelector("input#mid-cell");
mid_cell_input.addEventListener("change", function(event) {
    origin = parseInt(mid_cell_input.value) - cells_half_id;
    show_tape();
});

const stick_checkbox = document.querySelector("input#stick");
stick_checkbox.addEventListener("change", function() {
    stick = stick_checkbox.checked;
});
const cells_eara = document.querySelector("span.cells");

const speed_input = document.querySelector("input#speed");
speed_input.addEventListener("change", function() {
    let speed_number = parseFloat(speed_input.value);
    if (speed_number > 0) {
        speed = 1000 / speed_number;
    } else {
        speed = 0;
        speed_input.value = 0;
    }
    if (intervalID) {
        clearInterval(intervalID);
        intervalID = setInterval(step, speed);
    }
})

var output_area = document.querySelector("div#output-area");

const run_button = document.querySelector("button#run-button");
run_button.addEventListener("click", function() {
    run();
})

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
    code_box.innerHTML = "";
    let part;
    for (part of parsed.parts) {
        code_box.appendChild(part.toHTML());
    }
}

function init_cells() {
    let cell, id, box, pointer, num, char;
    cells_eara.replaceChildren();
    for (let i = 0; i < cells_number; i++) {
        cell = document.createElement("span");
        cell.classList.add("cell");
            id = document.createElement("div");
            id.classList.add("id");
            id.innerHTML = "0";
            cell.appendChild(id);
            
            box = document.createElement("div");
            box.classList.add("box");
                num = document.createElement("div");
                num.classList.add("num");
                num.innerHTML = "0";
                box.appendChild(num);

                char = document.createElement("div");
                char.classList.add("char");
                char.innerHTML = "^@";
                box.append(char);
            cell.append(box);

            pointer = document.createElement("div");
            pointer.classList.add("pointer");
            pointer.innerHTML = "";
            cell.append(pointer);
        cells_eara.appendChild(cell);
        cells.push({
            cell: cell,
            id: id,
            num: num,
            char: char,
            pointer: pointer
        })
    }
}

function show_tape() {
    let cell;
    let id;
    for (let i = 0; i < cells_number; i++) {
        id = origin + i;
        cell = cells[i];
        if (id < 0 || id > MAX) {
            cell.cell.classList.toggle("hidden", true);
        } else {
            cell.cell.classList.toggle("hidden", false);
            cell.id.innerHTML = id;
            num = tape[id];
            num = ! num ? 0 : num;
            cell.num.innerHTML = num;
            cell.char.innerHTML = chars[num].symbol;
            if (chars[num].explain) {
                cell.char.title = chars[num].explain;
            } else {
                cell.char.removeAttribute("title");
            }
            cell.pointer.innerHTML = id === pointer ? "▲" : "";
        }
    }
}

function output(char_number, number) {
    outputs.push(char_number);
    let char = chars[char_number]
    switch (output_mode) {
        case 0: {
            switch (char.type) {
                case 1:
                case 2: {
                    output_area.innerHTML += char.symbol.repeat(number);
                    break;
                }
                case 0: {
                    switch (char_number) {
                        case 10: {
                            output_area.innerHTML += '<br>'.repeat(number);
                        }
                    }
                }
            }
            break;
        }
    }
}

function end() {
    if (intervalID) {
        clearInterval(intervalID);
        intervalID = undefined;
    }
    last?.noncurrent();
    code_box.setAttribute("contenteditable", true);
}
init_cells();
init();
show_tape();