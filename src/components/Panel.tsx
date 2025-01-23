"use client";

import { useSocketEvent } from "@/hook/useSocketEvent";
import { socket } from "@/socket";
import { useCallback, useState } from "react";
import { useReadLocalStorage } from "usehooks-ts";
import Canvas from "./Canvas";
import ScoreCard from "./ScoreCard";
import Timer from "./Timer";
import AdminPanel from "./AdminPanel";

interface PanelProps {
	roomId: string;
}

interface PlayerScore {
	playerId: string;
	score: number;
}

interface GameConfig {
	rounds: number;
	drawTime: number;
}

export default function Panel({ roomId }: PanelProps) {
	const playerId = useReadLocalStorage<string>("playerId", {
		initializeWithValue: false,
	});
	const [word, setWord] = useState<string>("");
	const [isGameStarted, setIsGameStarted] = useState(false);
	const [turn, setTurn] = useState(false);
	const [displayScore, setDisplayScore] = useState(true);
	const [totalScores, setTotalScores] = useState<PlayerScore[]>([]);
	const [round, setRound] = useState(0);
	const [enableNewGameButton, setEnableNewGameButton] = useState(false);
	const [gameConfig, setGameConfig] = useState({ rounds: 5, drawTime: 60 });

	const isAdmin = playerId === roomId;

	const onGameStart = useCallback((gameConfig: GameConfig) => {
		setGameConfig(gameConfig);
		setIsGameStarted(true);
	}, []);

	const onTurn = useCallback(
		(_playerId: string) => {
			setTurn(playerId === _playerId);
			setDisplayScore(false);
		},
		[playerId]
	);

	const onWord = useCallback((_word: string) => {
		setWord(_word);
	}, []);

	const onScore = useCallback((_totalScores: PlayerScore[]) => {
		setDisplayScore(true);
		setTotalScores(_totalScores);
	}, []);

	const onRound = useCallback((_round: number) => {
		setRound(_round);
	}, []);

	const onGameOver = useCallback(() => {
		setEnableNewGameButton(true);
	}, []);

	useSocketEvent("start-game", onGameStart);
	useSocketEvent("turn", onTurn);
	useSocketEvent("word", onWord);
	useSocketEvent("score", onScore);
	useSocketEvent("round", onRound);
	useSocketEvent("game-over", onGameOver);

	function startGame(formData: FormData) {
		const rounds = formData.get("rounds");
		const drawTime = formData.get("drawTime");

		if (!rounds || !drawTime) return;

		setGameConfig({
			rounds: parseInt(rounds as string),
			drawTime: parseInt(drawTime as string),
		});

		socket.emit("start-game", rounds, drawTime);

		setIsGameStarted(true);
	}

	function createNewGame() {
		setEnableNewGameButton(false);
		setIsGameStarted(false);
	}

	return (
		<div className='h-full grid place-items-center relative'>
			{isGameStarted ? (
				displayScore ? (
					<ScoreCard
						totalScores={totalScores}
						gameEnded={enableNewGameButton}
						createNewGame={createNewGame}
					/>
				) : (
					<>
						<Canvas turn={turn} />
						{turn ? (
							<div className='absolute top-4 left-1/2 right-1/2'>{word}</div>
						) : null}
						<Timer drawTime={gameConfig.drawTime} />
						<span className='absolute top-4 right-4'>Round {round}</span>
					</>
				)
			) : isAdmin ? (
				<AdminPanel startGame={startGame} />
			) : (
				<p>Game not started yet.</p>
			)}
		</div>
	);
}
