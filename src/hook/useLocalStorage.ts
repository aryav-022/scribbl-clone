"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue?: T) {
	const [value, setValue] = useState<T>(() => {
		const item = window.localStorage.getItem(key);
		return item ? JSON.parse(item) : initialValue;
	});

	useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue] as const;
}
