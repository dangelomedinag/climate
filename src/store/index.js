export class store {
	value = undefined;
	constructor(initialValue) {
		this.value = initialValue;
	}

	update(cb) {
		const val = cb(this.value);
		this.value = val;
		return this.value;
	}

	set(newValue) {
		this.value = newValue;
		return this.value;
	}
}
