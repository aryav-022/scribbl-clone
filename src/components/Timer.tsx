"use client";

import { useEffect, useState } from "react";

let audioCtx: AudioContext | null = null;

interface TimerProps {
	drawTime: number;
}

export default function Timer({ drawTime }: TimerProps) {
	const [time, setTime] = useState(drawTime);

	function playNote(freq: number, type: OscillatorType, dur = 0.1) {
		if (!audioCtx || audioCtx.state === "closed") {
			audioCtx = new AudioContext();
		}

		const osc = audioCtx.createOscillator();
		const gainNode = audioCtx.createGain();

		osc.frequency.value = freq;
		osc.type = type;
		osc.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		gainNode.gain.value = 0.05; // Initial gain value
		gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);

		osc.start();
		osc.stop(audioCtx.currentTime + dur);
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setTime((prevTime) => prevTime - 1);
			playNote(100, "sine");
		}, 1000);

		return () => {
			clearInterval(interval); // Clean up interval on unmount
			playNote(400, "triangle", 0.5); // Play a final "end" note
		};
	}, []);

	return (
		<span
			className='absolute top-4 left-4 grid place-items-center h-12 w-12 text-lg border-2 rounded-full'
			aria-label={`Timer: ${time} seconds remaining`}>
			{time}
		</span>
	);
}
