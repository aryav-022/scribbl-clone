import { socket } from "@/socket";
import { useEffect } from "react";

export function useSocketEvent(event: string, handler: (...args: any[]) => void) {
	useEffect(() => {
		socket.on(event, handler);

		return () => {
			socket.off(event, handler);
		};
	}, [handler]);
}
