import { checkPlayerIdAvailability } from "./PlayerId";

export async function createGame(playerId: string) {
	const isAvailable = await checkPlayerIdAvailability(playerId);

	if (!isAvailable) {
		return { success: false, message: "Player ID is not available" };
	}

	return { success: true, message: null };
}

export async function joinGame(playerId: string, roomId: string) {
	const isAvailable = await checkPlayerIdAvailability(playerId);

	if (!isAvailable) {
		return { success: false, error: "Player ID is not available" };
	}

	return { success: true, message: null };
}
