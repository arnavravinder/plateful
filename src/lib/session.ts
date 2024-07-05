import { writable, type Writable } from 'svelte/store';
import type { FoodType } from './item';

type UserData = {
	foodPref: FoodType;
	isUser: boolean;
};

type User = {
	email?: string | null;
	displayName?: string | null;
	photoURL?: string | null;
	uid?: string | null;
};

export type SessionState = {
	user: User | null;
	loading?: boolean;
	loggedIn?: boolean;
	userData: UserData | null;
};

export const session = <Writable<SessionState>>writable();
