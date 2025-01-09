export default class Debounce {
	private timeout: any;
	private delay: number;
	private callback: (...options: any[]) => any;

	constructor(delay: number, callback: (...options: any[]) => any) {
		this.delay = delay;
		this.callback = callback;
		this.timeout = null;
	}

	public run = async (...options: any[]): Promise<ReturnType<typeof this.callback>> => {
		clearTimeout(this.timeout);

		return new Promise<ReturnType<typeof this.callback>>((resolve) => {
			this.timeout = setTimeout(() => {
				const result = this.callback(...options);
				resolve(result);
			}, this.delay);
		});
	};
}
