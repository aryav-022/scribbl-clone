"use client";

import { useSocketEvent } from "@/hook/useSocketEvent";
import { socket } from "@/socket";
import { useCallback, useRef } from "react";
import { useReadLocalStorage } from "usehooks-ts";

export default function GuessInputBox() {
	const playerId = useReadLocalStorage<string>("playerId", {
		initializeWithValue: false,
	});

	const submitButtonRef = useRef<HTMLButtonElement>(null);

	function submitGuess(formData: FormData) {
		const guess = formData.get("guess");

		if (submitButtonRef.current && !submitButtonRef.current.disabled) {
			socket.emit("guess", guess);
		}
	}

	const onTurn = useCallback(
		(_playerId: string) => {
			if (submitButtonRef.current) {
				const myTurn = _playerId === playerId;
				submitButtonRef.current.disabled = myTurn;
			}
		},
		[playerId]
	);

	useSocketEvent("turn", onTurn);

	return (
		<form action={submitGuess} className='flex justify-self-end'>
			<input
				type='text'
				name='guess'
				placeholder='Guess Drawing'
				className='w-full border-2 border-neutral-700 bg-transparent p-2'
			/>
			<button
				ref={submitButtonRef}
				disabled
				type='submit'
				className='px-3 py-1 bg-blue-600 disabled:bg-neutral-500'>
				Send
			</button>
		</form>
	);
}
