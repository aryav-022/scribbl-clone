export default class Debounce<T, R> {
	private timeout: NodeJS.Timeout | null;
	private delay: number;
	private callback: (...options: T[]) => R;

	constructor(delay: number, callback: (...options: T[]) => R) {
		this.delay = delay;
		this.callback = callback;
		this.timeout = null;
	}

	public run = async (...options: T[]): Promise<R> => {
		if (this.timeout) clearTimeout(this.timeout);

		return new Promise<R>((resolve) => {
			this.timeout = setTimeout(() => {
				const result = this.callback(...options);
				resolve(result);
			}, this.delay);
		});
	};
}
