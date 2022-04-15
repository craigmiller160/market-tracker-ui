import { nanoid } from '@reduxjs/toolkit';

export class NanoidIdentityManager {
	private ids = new Set();

	fetch(): string {
		let uuid = nanoid();
		while (this.ids.has(uuid)) {
			uuid = nanoid();
		}

		this.ids.add(uuid);
		return uuid;
	}

	get(): number {
		throw new Error('Unsupported');
	}

	inc(): number {
		throw new Error('Unsupported');
	}

	set(uuid: string): void {
		if (this.ids.has(uuid)) {
			throw new Error(`ID is already used: ${uuid}`);
		}
		this.ids.add(uuid);
	}

	reset(): void {
		this.ids.clear();
	}
}
