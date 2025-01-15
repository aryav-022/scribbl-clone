import PlayersColumn from "@/components/PlayersColumn";
import Canvas from "@/components/Panel";
import MessageInputBox from "@/components/MessageInputBox";
import { checkRoomExists } from "@/lib/Game";
import { redirect } from "next/navigation";

interface GamePageParams {
	params: Promise<{
		roomId: string;
	}>;
}

export default async function GamePage({ params }: GamePageParams) {
	const { roomId } = await params;

	const roomExists = await checkRoomExists(roomId);

	if (!roomExists) redirect("/");

	const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/players?roomId=${roomId}`, {
		cache: "no-store",
	});
	const initialPlayers = await res.json();

	return (
		<div className='flex h-dvh'>
			<PlayersColumn initialPlayers={initialPlayers} />

			<div className='h-full grow flex flex-col'>
				<Canvas roomId={roomId} />
				<MessageInputBox roomId={roomId} />
			</div>
		</div>
	);
}
