import PlayersColumn from "@/components/PlayersColumn";
import Panel from "@/components/Panel";
import { checkRoomExists } from "@/lib/Game";
import { redirect } from "next/navigation";
import GuessInputBox from "@/components/GuessInputBox";

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
				<Panel roomId={roomId} />
				<GuessInputBox />
			</div>
		</div>
	);
}
