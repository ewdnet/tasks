// place files you want to import through the `$lib` alias in this folder.
// REFS

// refNumber
function refNumber(initial: number) {
	let value = $state(initial);

	return {
		get value() {
			return value;
		},
		set value(v) {
			value = v;
		}
	};
}

// refString
function refString(initial: string) {
	let value = $state(initial);

	return {
		get value() {
			return value;
		},
		set value(v) {
			value = v;
		}
	};
}

// STORES

// pageView
export const pageView = refString('tasks');

// ?
export const taskspaginator = refNumber(1);
