"use client";

import { useLocalStorage } from "@/hook/useLocalStorage";
import { useSocketEvent } from "@/hook/useSocketEvent";
import { socket } from "@/socket";
import { useCallback, useState } from "react";
import Canvas from "./Canvas";

interface PanelProps {
	roomId: string;
}
export default function Panel({ roomId }: PanelProps) {
	const [playerId, setPlayerId] = useLocalStorage("playerId");
	const [isGameStarted, setIsGameStarted] = useState(false);

	const isAdmin = playerId === roomId;

	const onGameStart = useCallback(() => {
		setIsGameStarted(true);
	}, []);

	useSocketEvent("start-game", onGameStart);

	function startGame() {
		socket.emit("start-game", roomId);
		setIsGameStarted(true);
	}

	return (
		<div className='h-full grid place-items-center'>
			{isGameStarted ? (
				<Canvas />
			) : isAdmin ? (
				<button
					type='button'
					className='rounded-lg bg-green-500 px-4 py-2 border-2 active:scale-95 transition-transform'
					onClick={startGame}>
					Start Game
				</button>
			) : (
				<p>Game not started yet.</p>
			)}
		</div>
	);
}
