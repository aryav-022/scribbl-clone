"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: Exclude<T, undefined> | null = null) {
	const [value, setValue] = useState<Exclude<T, undefined> | null>(initialValue);

	useEffect(() => {
		const item = localStorage.getItem(key);
		const parsedItem = item ? JSON.parse(item) : null;
		setValue(parsedItem ? parsedItem : initialValue);
	}, [key, initialValue]);

	function _setValue(_value: Exclude<T, undefined> | null) {
		localStorage.setItem(key, JSON.stringify(_value));
		setValue(_value);
	}

	return [value, _setValue] as const;
}
