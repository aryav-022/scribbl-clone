"use client";

import { generateAvatar } from "@/lib/Avatar";

interface PlayerScore {
	playerId: string;
	score: number;
}

interface ScoreCardProps {
	totalScores: PlayerScore[];
	gameEnded: boolean;
	createNewGame: () => void;
	isAdmin: boolean;
}

export default function ScoreCard({
	totalScores,
	gameEnded,
	createNewGame,
	isAdmin,
}: ScoreCardProps) {
	return (
		<div className='animate-mount-up max-h-full h-fit w-11/12 flex flex-col gap-4 py-4 items-center bg-neutral-500 bg-opacity-20 rounded-lg'>
			{gameEnded ? <h1>Game Over</h1> : null}

			<table className='table-auto overflow-y-auto flex-1'>
				<thead>
					<tr>
						<th className='p-4'>Rank</th>
						<th className='p-4'>Avatar</th>
						<th className='p-4'>Player ID</th>
						<th className='p-4'>Score</th>
					</tr>
				</thead>
				<tbody>
					{totalScores.map((playerScore, index) => (
						<tr key={index}>
							<td className='text-center'>{index + 1}</td>
							<td
								dangerouslySetInnerHTML={{
									__html: generateAvatar(playerScore.playerId),
								}}
							/>
							<td className='text-center'>{playerScore.playerId}</td>
							<td className='text-center'>{playerScore.score}</td>
						</tr>
					))}
				</tbody>
			</table>

			{gameEnded && isAdmin ? (
				<button
					className='px-4 py-2 rounded-lg outline bg-green-700'
					onClick={createNewGame}>
					Create New Game
				</button>
			) : null}
		</div>
	);
}
