import { checkPlayerIdAvailability } from "./PlayerId";

export async function checkRoomExists(roomId: string) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/room?roomId=${roomId}`, {
		cache: "no-store",
	});
	return await res.json();
}

export async function createGame(playerId: string) {
	const isAvailable = await checkPlayerIdAvailability(playerId);

	if (!isAvailable) {
		return { success: false, message: "Player ID is not available" };
	}

	return { success: true, message: null };
}

export async function joinGame(playerId: string, roomId: string) {
	const isPlayerIdAvailable = await checkPlayerIdAvailability(playerId);

	if (!isPlayerIdAvailable) {
		return { success: false, error: "Player ID is not available" };
	}

	if (!roomId) {
		return { success: false, error: "Room ID is required" };
	}

	const roomExists = await checkRoomExists(roomId);

	if (!roomExists) {
		return { success: false, message: "Room doesn't exists" };
	}

	return { success: true, message: null };
}
