"use client";

import { useLocalStorage } from "@/hook/useLocalStorage";
import { socket } from "@/socket";
import { useRef, type KeyboardEventHandler } from "react";

interface MessageInputBoxParams {
	roomId: string;
}

export default function MessageInputBox({ roomId }: MessageInputBoxParams) {
	const [playerId, setPlayerId] = useLocalStorage("playerId");

	const submitButtonRef = useRef<HTMLButtonElement>(null);

	function sendMessage(formData: FormData) {
		const message = formData.get("message");
		socket.emit("message", roomId, playerId, message);
	}

	const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key == "Enter") {
			submitButtonRef.current?.click();
		}
	};

	return (
		<form action={sendMessage} className='flex justify-self-end'>
			<input
				type='text'
				name='message'
				className='w-full border-2 border-neutral-700 bg-transparent p-2'
				onKeyDown={onKeyDown}
			/>
			<button ref={submitButtonRef} type='submit' className='px-3 py-1 bg-blue-600'>
				Send
			</button>
		</form>
	);
}
