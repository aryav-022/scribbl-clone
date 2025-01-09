import { createAvatar } from "@dicebear/core";
import { bigSmile } from "@dicebear/collection";
import Debounce from "./Debounce";

export const generateAvatar = new Debounce(500, (seed?: string): string => {
	const options = seed ? { seed } : {};
	const avatar = createAvatar(bigSmile, options);
	return avatar.toString();
});
