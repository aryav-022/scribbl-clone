"use client";

import { useLocalStorage } from "@/hook/useLocalStorage";
import { generateAvatar } from "@/lib/Avatar";
import { createGame, joinGame } from "@/lib/Game";
import { checkPlayerIdAvailability, generatePlayerId } from "@/lib/PlayerId";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function LoginForm() {
	const router = useRouter();

	const [playerId, setPlayerId] = useLocalStorage("playerId");

	const [isPlayerIdAvailable, setIsPlayerIdAvailable] = useState(true);

	const playerIdInputRef = useRef<HTMLInputElement>(null);
	const avatarButton = useRef<HTMLButtonElement>(null);

	function updatePlayerId(playerId: string) {
		if (!playerIdInputRef.current) return;

		playerIdInputRef.current.value = playerId;

		checkPlayerIdAvailability(playerId).then((isAvailable) => {
			setIsPlayerIdAvailable(isAvailable);
		});

		generateAvatar.run(playerId).then((avatar: string) => {
			if (avatarButton.current) {
				avatarButton.current.innerHTML = avatar;
			}
		});
	}

	function regeneratePlayerId() {
		generatePlayerId().then(updatePlayerId);
	}

	useEffect(regeneratePlayerId, []);

	async function handleSubmit(formData: FormData) {
		const actionType = formData.get("action") as string;
		const playerId = formData.get("playerId") as string;

		if (actionType === "create") {
			const res = await createGame(playerId);

			if (!res.success) {
				alert(res.message);
				return;
			}

			setPlayerId(playerId);

			router.push(`/game/${playerId}`);
		} else {
			const roomId = formData.get("room") as string;
			const res = await joinGame(playerId, roomId);

			if (!res.success) {
				alert(res.error);
				return;
			}

			setPlayerId(playerId);

			router.push(`/game/${roomId}`);
		}
	}

	return (
		<form className='flex w-fit items-center gap-4' action={handleSubmit}>
			<div>
				<button
					ref={avatarButton}
					className='w-40 h-40'
					type='button'
					title='Regenerte Avatar'
					onClick={regeneratePlayerId}
				/>
				<div className='text-xs text-gray-500 text-center'>
					Click on avatar to randomize player ID
				</div>
			</div>

			<div className='w-full space-y-4'>
				<fieldset className='w-full'>
					<label htmlFor='playerId' className='block font-semibold'>
						Player ID
					</label>

					<input
						id='playerId'
						name='playerId'
						type='text'
						className='w-full p-2 border border-gray-300 text-black rounded-md'
						placeholder='Enter player ID to create a player'
						ref={playerIdInputRef}
						onChange={(e) => updatePlayerId(e.target.value)}
					/>

					<p
						className={cn(
							"text-xs mt-1",
							isPlayerIdAvailable ? "text-green-600" : "text-red-600"
						)}>
						{isPlayerIdAvailable
							? "Player ID is available"
							: "Player ID is not available"}
					</p>
				</fieldset>

				<fieldset className='w-full'>
					<label htmlFor='room' className='block font-semibold'>
						Room ID
					</label>

					<input
						id='room'
						name='room'
						type='text'
						className='w-full p-2 border border-gray-300 text-black rounded-md'
						placeholder='Enter room ID to join a game'
					/>
				</fieldset>

				<div className='flex gap-4 w-full'>
					<button
						type='submit'
						name='action'
						value='create'
						className='w-full px-4 py-2 rounded-md bg-blue-800 font-semibold'>
						Create Game
					</button>

					<button
						type='submit'
						name='action'
						value='join'
						className='w-full px-4 py-2 rounded-md bg-red-800 font-semibold'>
						Join Game
					</button>
				</div>
			</div>
		</form>
	);
}
