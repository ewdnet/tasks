// REFS

// refNumber
function refNumber<T extends number | null>(initial: T) {
	let value: T = $state(initial);

	return {
		get value() {
			return value;
		},
		set value(v: T) {
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
export const progressOverall = refNumber<number | null>(null);

// Tabs (Skeleten UI) - active tab onValueChange
export const activeTab = refString('tasks');

// searchTerm
export const searchTerm = refString('');

// categories status
export const categoryStatus = refString('');

// filter (category)
export const categorySelected = refString('');

// filter (status)
export const taskStatus = refString('');

// Paginator Reset (scips to page 1 when filters change)
export const paginatorReset = refNumber<number>(1);

// Accordion (Skeleton UI) - collapse trigger counter
export const accordionCollapsed = refNumber<number>(0);
