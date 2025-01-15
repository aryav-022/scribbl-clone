"use client";

import { useSocketEvent } from "@/hook/useSocketEvent";
import { generateAvatar } from "@/lib/Avatar";
import { useCallback, useState } from "react";
import Animate from "./Animate";

interface PlayerCardProps {
	playerId: string;
}

export default function PlayerCard({ playerId }: PlayerCardProps) {
	const avatar = generateAvatar(playerId);

	const [message, setMessage] = useState<string | null>(null);

	const onMessage = useCallback((_playerId: string, _message: string) => {
		if (playerId === _playerId) {
			setMessage(_message);
		}
	}, []);

	useSocketEvent("message", onMessage);

	return (
		<div className='flex flex-col max-h-[calc((100%_-_((var(--player-count)_-_1)_*_0.5rem))/var(--player-count))] w-full bg-neutral-500 bg-opacity-20 rounded-lg p-1 relative'>
			<div
				className='w-full overflow-hidden shrink flex [&>svg]:w-full'
				dangerouslySetInnerHTML={{ __html: avatar }}
			/>
			<p title={playerId} className='text-center grow-0 shrink-0 text-xs line-clamp-1'>
				{playerId}
			</p>

			{message && (
				<Animate animateOn={message}>
					<div className='absolute animate-mount line-clamp-3 text-xs bottom-1/4 left-[90%] py-1 px-2 rounded-lg bg-neutral-600 z-50'>
						{message}
					</div>
				</Animate>
			)}
		</div>
	);
}
