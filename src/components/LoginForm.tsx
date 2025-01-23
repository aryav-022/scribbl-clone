"use client";

import { generateAvatar } from "@/lib/Avatar";
import Debounce from "@/lib/Debounce";
import { createGame, joinGame } from "@/lib/Game";
import { checkPlayerIdAvailability, generatePlayerId } from "@/lib/PlayerId";
import { cn } from "@/lib/utils";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const generateAvatarDebounced = new Debounce(500, generateAvatar);

export default function LoginForm() {
	const router = useRouter();

	const [, setPlayerId] = useLocalStorage<string | null>("playerId", null, {
		initializeWithValue: false,
	});

	const [playerIdInput, setPlayerIdInput] = useState({
		ok: true,
		helpText: {
			message: "Player ID is available",
			className: "text-green-600",
		},
	});

	const playerIdInputRef = useRef<HTMLInputElement>(null);
	const avatarButton = useRef<HTMLButtonElement>(null);

	function updatePlayerId(_playerId: string) {
		if (!playerIdInputRef.current) return;

		playerIdInputRef.current.value = _playerId;

		checkPlayerIdAvailability(_playerId).then((isAvailable) => {
			setPlayerIdInput({
				ok: isAvailable,
				helpText: {
					message: isAvailable ? "Player ID is available" : "Player ID is not available",
					className: isAvailable ? "text-green-600" : "text-red-600",
				},
			});
		});

		generateAvatarDebounced.run(_playerId).then((avatar: string) => {
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
		const _playerId = formData.get("playerId") as string;

		let roomId, res;

		if (actionType === "create") {
			roomId = _playerId;
			res = await createGame(_playerId);
		} else {
			roomId = formData.get("room") as string;
			res = await joinGame(_playerId, roomId);
		}

		if (!res.success) {
			alert(res.message);
			return;
		}

		setPlayerId(_playerId);

		socket.emit("join-game", roomId, _playerId);

		router.push(`/game/${roomId}`);
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

					<p className={cn("text-xs mt-1", playerIdInput.helpText.className)}>
						{playerIdInput.helpText.message}
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
