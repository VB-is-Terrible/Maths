"use strict";
const make_grid = function make_grid(line1, line2, symbol, empty = 1, min_length = 0) {
    const stage = document.querySelector('#stage');
    let max = min_length;
    for (const line of [line1, line2]) {
        max = Math.max(max, line.length);
    }
    const gridLineStart = "\'";
    const gridLineEnd = "\'\n";
    // Write out grids
    let template_rows = '1fr 1fr .25em';
    for (let i = 0; i < empty; i++) {
        template_rows += ' 1fr';
    }
    let template_columns = '';
    for (let i = 0; i < max + 1; i++) {
        template_columns += ' 1fr';
    }
    let template_areas = "";
    // First line
    template_areas += gridLineStart;
    for (let i = 0; i < max; i++) {
        template_areas += 'g' + (i + 1).toString() + "x1 ";
    }
    template_areas += '.';
    template_areas += gridLineEnd;
    // Second line
    template_areas += gridLineStart;
    for (let i = 0; i < max; i++) {
        template_areas += 'g' + (i + 1).toString() + "x2 ";
    }
    template_areas += "symbol" + gridLineEnd;
    // Horizontonal line
    template_areas += gridLineStart;
    for (let i = 0; i < max + 1; i++) {
        template_areas += 'line ';
    }
    template_areas += gridLineEnd;
    // Extra lines
    for (let i = 0; i < empty; i++) {
        template_areas += gridLineStart;
        for (let j = 0; j < max; j++) {
            template_areas += 'g' + (j + 1).toString() + 'x' + (i + 3).toString() + ' ';
        }
        template_areas += '.';
        template_areas += gridLineEnd;
    }
    console.log(template_areas);
    requestAnimationFrame(() => {
        stage.style.gridTemplateRows = template_rows;
        stage.style.gridTemplateColumns = template_columns;
        stage.style.gridTemplateAreas = template_areas;
    });
    // Write out current content
    let queue = [];
    let line_count = 1;
    for (const line of [line1, line2]) {
        let spaces = max - line.length;
        for (let i = 0; i < spaces; i++) {
            let p = document.createElement('p');
            p.style.gridArea = 'g' + (i + 1).toString() + 'x' + line_count.toString();
            queue.push(p);
        }
        for (let i = spaces; i < max; i++) {
            let p = document.createElement('p');
            p.style.gridArea = 'g' + (i + 1).toString() + 'x' + line_count.toString();
            p.innerHTML = line[i - spaces];
            queue.push(p);
        }
        line_count += 1;
    }
    let symbol_p = document.createElement('p');
    symbol_p.style.gridArea = 'symbol';
    symbol_p.innerHTML = symbol;
    queue.push(symbol_p);
    let line = document.createElement('p');
    line.id = 'stageLine';
    queue.push(line);
    console.log(queue);
    requestAnimationFrame(() => {
        stage.innerHTML = '';
        for (let p of queue) {
            stage.append(p);
        }
    });
    return max;
};
class Answerer {
    constructor() {
        var _a;
        this.max = 0;
        this.answer = 0;
        this.input = document.querySelector('#answer');
        this.success_mark = document.querySelector('#responseSuccess');
        this.failure_mark = document.querySelector('#responseFailure');
        this.stage = document.querySelector('#stage');
        if (this.input === null ||
            this.success_mark === null ||
            this.failure_mark === null ||
            this.stage === null) {
            throw "Failed to find needed UI element";
        }
        (_a = document.querySelector('#submit')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            this.submit();
        });
        this.input.addEventListener('keypress', (e) => {
            if (e.key === "Enter") {
                this.submit();
            }
        });
    }
    set_question(line1, line2, symbol, answer) {
        this.max = make_grid(line1.toString(), line2.toString(), symbol, 1, answer.toString().length);
        this.answer = answer;
        this.reset_answer();
    }
    submit() {
        let current = parseInt(this.input.value);
        if (isNaN(current)) {
            this.reset_answer();
            return;
        }
        if (current === this.answer) {
            this.success();
        }
        else {
            this.failure();
        }
    }
    reset_answer() {
        requestAnimationFrame(() => {
            this.input.value = '';
            this.success_mark.style.display = 'none';
            this.failure_mark.style.display = 'none';
        });
    }
    success() {
        this.writeAnswer();
        requestAnimationFrame(() => {
            this.success_mark.style.display = 'block';
        });
    }
    failure() {
        this.writeAnswer();
        requestAnimationFrame(() => {
            this.failure_mark.style.display = 'block';
        });
    }
    writeAnswer() {
        const write = this.answer.toString();
        const len = write.length;
        const spaces = this.max - len;
        for (let i = spaces; i < this.max; i++) {
            let p = document.createElement('p');
            p.style.gridArea = 'g' + (i + 1).toString() + 'x3';
            p.innerHTML = write[i - spaces];
            requestAnimationFrame(() => {
                this.stage.append(p);
            });
        }
    }
}
let answerer;
const randint = (lower, upper) => {
    return Math.floor(Math.random() * (upper - lower) + lower);
};
const addition = function addition() {
    const q1 = randint(1000, 9999);
    const q2 = randint(1000, 9999);
    answerer.set_question(q1, q2, '+', q1 + q2);
};
const minus = function minus() {
    let q1 = randint(1000, 9999);
    let q2 = randint(1000, 9999);
    if (q2 > q1) {
        [q1, q2] = [q2, q1];
    }
    answerer.set_question(q1, q2, '-', q1 - q2);
};
const multi = function multi() {
    let q1 = randint(101, 999);
    let q2 = randint(2, 9);
    answerer.set_question(q1, q2, '*', q1 * q2);
};
const main = function main() {
    var _a, _b, _c;
    answerer = new Answerer();
    (_a = document.querySelector('button.addition')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addition);
    (_b = document.querySelector('button.minus')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', minus);
    (_c = document.querySelector('button.multiplication')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', multi);
};
main();
