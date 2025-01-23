"use client";

interface AdminPanelProps {
	startGame: (formData: FormData) => void;
}

export default function AdminPanel({ startGame }: AdminPanelProps) {
	return (
		<form
			action={startGame}
			className='bg-neutral-500 bg-opacity-20 p-6 rounded-lg flex flex-col gap-6 outline'>
			<h1 className='font-bold text-xl mb-2 border-b pb-2'>Configure Game</h1>

			<fieldset className='flex justify-between gap-4'>
				<label htmlFor='rounds' className='font-bold'>
					Rounds
				</label>
				<input
					type='number'
					id='rounds'
					name='rounds'
					min='1'
					max='10'
					defaultValue='5'
					className='bg-transparent border rounded-md p-2'
				/>
			</fieldset>

			<fieldset className='space-x-2'>
				<label htmlFor='drawTime' className='font-bold'>
					Draw Time (seconds)
				</label>
				<input
					type='number'
					id='drawTime'
					name='drawTime'
					min='30'
					max='600'
					defaultValue='60'
					className='bg-transparent border rounded-md p-2'
				/>
			</fieldset>

			<button
				type='submit'
				className='rounded-lg bg-green-700 px-4 py-2 border-2 active:scale-95 transition-transform'>
				Start Game
			</button>
		</form>
	);
}
