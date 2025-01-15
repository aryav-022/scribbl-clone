import { createAvatar } from "@dicebear/core";
import { bigSmile } from "@dicebear/collection";

export const generateAvatar = (playerId?: string): string => {
	const options = playerId ? { seed: playerId } : {};
	const avatar = createAvatar(bigSmile, options);
	return avatar.toString();
};
