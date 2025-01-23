import { socket } from "@/socket";
import { useEffect } from "react";

export function useSocketEvent<T>(event: string, handler: (...args: T[]) => void) {
	useEffect(() => {
		socket.on(event, handler);

		return () => {
			socket.off(event, handler);
		};
	}, [event, handler]);
}
