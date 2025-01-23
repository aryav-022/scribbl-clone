"use client";

import { useSocketEvent } from "@/hook/useSocketEvent";
import { generateAvatar } from "@/lib/Avatar";
import { useCallback, useRef, useState } from "react";
import Animate from "./Animate";

interface PlayerCardProps {
	playerId: string;
}

export default function PlayerCard({ playerId }: PlayerCardProps) {
	const avatar = generateAvatar(playerId);

	const [guess, setGuess] = useState<string | null>(null);

	const cardRef = useRef<HTMLDivElement | null>(null);

	const onGuess = useCallback(
		(_playerId: string, _guess: string) => {
			if (playerId === _playerId) {
				setGuess(_guess);
			}
		},
		[playerId]
	);

	const onGuessed = useCallback(
		(_playerId: string) => {
			if (_playerId === playerId && cardRef.current) {
				cardRef.current.style.backgroundColor = "rgb(34 197 94 / var(--tw-bg-opacity, 1))";
			}
		},
		[playerId]
	);

	const onTurn = useCallback(() => {
		if (cardRef.current) {
			cardRef.current.style.backgroundColor = "rgb(115 115 115 / var(--tw-bg-opacity, 1))";
		}
	}, []);

	useSocketEvent("guess", onGuess);
	useSocketEvent("guessed", onGuessed);
	useSocketEvent("turn", onTurn);

	return (
		<div
			ref={cardRef}
			className='flex flex-col max-h-[calc((100%_-_((var(--player-count)_-_1)_*_0.5rem))/var(--player-count))] w-full bg-neutral-500 bg-opacity-20 rounded-lg p-1 relative'>
			<div
				className='w-full overflow-hidden shrink flex [&>svg]:w-full'
				dangerouslySetInnerHTML={{ __html: avatar }}
			/>
			<p title={playerId} className='text-center grow-0 shrink-0 text-xs line-clamp-1'>
				{playerId}
			</p>

			{guess && (
				<Animate animateOn={guess}>
					<div className='absolute animate-mount-right line-clamp-3 text-xs bottom-1/4 left-[90%] py-1 px-2 rounded-lg bg-neutral-600 z-50'>
						{guess}
					</div>
				</Animate>
			)}
		</div>
	);
}
