"use server";

import { randomUUID } from "crypto";

export async function generatePlayerId() {
	const uuid = randomUUID();
	return uuid.toString();
}

export async function checkPlayerIdAvailability(playerId: string) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/player?playerId=${playerId}`, {
		cache: "no-store",
	});
	return await res.json();
}
