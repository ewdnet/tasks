// REFS

// refNumber
function refNumber(initial: number | null) {
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

// tasks overall progress
export const progressOverall = refNumber(null);

// pageView
export const pageView = refString('tasks');

// searchTerm
export const searchTerm = refString('');

// categories status
export const categoryStatus = refString('');

// filter (category)
export const categorySelected = refString('');

// filter (status)
export const taskStatus = refString('');

// Paginator Reset (scips to page 1 when filters change)
export const paginatorReset = refNumber(1);

// task being edited
export const taskEdit = refString('');

// task being deleted
export const taskDelete = refString('');
