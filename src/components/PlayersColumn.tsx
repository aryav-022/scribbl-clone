"use client";

import { useCallback, useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import { socket } from "@/socket";
import { useSocketEvent } from "@/hook/useSocketEvent";

interface PlayersColumnParams {
	initialPlayers: string[];
}

export default function PlayersColumn({ initialPlayers }: PlayersColumnParams) {
	const [players, setPlayers] = useState<string[]>(initialPlayers);

	const onPlayerJoined = useCallback((_playerId: string) => {
		setPlayers((_players) => [..._players, _playerId]);
	}, []);

	const onPlayerLeft = useCallback((_playerId: string) => {
		setPlayers((_players) => _players.filter((_player) => _player !== _playerId));
	}, []);

	useSocketEvent("player-joined", onPlayerJoined);
	useSocketEvent("player-left", onPlayerLeft);

	useEffect(() => {
		document.documentElement.style.setProperty("--player-count", players.length.toString());
	}, [players]);

	return (
		<aside className='h-full w-fit max-w-36 flex flex-col gap-2 p-2 items-start justify-start border-r border-neutral-800'>
			{players.map((playerId) => (
				<PlayerCard key={playerId} playerId={playerId} />
			))}
		</aside>
	);
}
