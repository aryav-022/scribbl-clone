"use server";

import { randomUUID } from "crypto";

export async function generatePlayerId() {
	const uuid = randomUUID();
	return uuid.toString();
}

export async function checkPlayerIdAvailability(playerId: string) {
	return true;
}
