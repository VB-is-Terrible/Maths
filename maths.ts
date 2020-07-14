const make_grid = function make_grid(
	line1: string,
	line2: string,
	symbol: string,
	empty: number = 1,
	min_length: number = 0,
) {
	const stage = document.querySelector('#stage') as HTMLElement;
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
	let queue: HTMLParagraphElement[] = [];
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
}

class Answerer {
	max = 0;
	input: HTMLInputElement;
	success_mark: HTMLElement;
	failure_mark: HTMLElement;
	stage: HTMLElement;
	answer: number = 0;
	constructor() {
		this.input = document.querySelector('#answer') as HTMLInputElement;
		this.success_mark = document.querySelector('#responseSuccess') as HTMLElement;
		this.failure_mark = document.querySelector('#responseFailure') as HTMLElement;
		this.stage = document.querySelector('#stage') as HTMLElement;
		if (
			this.input === null ||
			this.success_mark === null ||
			this.failure_mark === null ||
			this.stage === null
		) {
			throw "Failed to find needed UI element";
		}
		document.querySelector('#submit')?.addEventListener('click', () => {
			this.submit();
		})
		this.input.addEventListener('keypress', (e) => {
			if (e.key === "Enter") {
				this.submit();
			}
		})
	}
	set_question(line1: number, line2: number, symbol: string, answer: number) {
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
		} else {
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

let answerer: Answerer;

const randint = (lower: number, upper: number) => {
	return Math.floor(Math.random() * (upper - lower) + lower);
}

const addition = function addition() {
	const q1 = randint(1000, 9999);
	const q2 = randint(1000, 9999);
	answerer.set_question(q1, q2, '+', q1 + q2);
}

const minus = function minus() {
	let q1 = randint(1000, 9999);
	let q2 = randint(1000, 9999);
	if (q2 > q1) {
		[q1, q2] = [q2, q1];
	}
	answerer.set_question(q1, q2, '-', q1 - q2);
}

const multi = function multi() {
	let q1 = randint(101, 999);
	let q2 = randint(2, 9);
	answerer.set_question(q1, q2, '*', q1 * q2);
}

const main = function main () {
	answerer = new Answerer();
	document.querySelector('button.addition')?.addEventListener('click', addition);
	document.querySelector('button.minus')?.addEventListener('click', minus);
	document.querySelector('button.multiplication')?.addEventListener('click', multi);
}

main();
