// constants
import { ADJECTIVES_DICT, NOUNS_DICT } from '../constants';

export function getFromIndex(array: any[], fieldCheck: string, value: any, returnField?: string | null) {
	const index = array.findIndex((a) => a[fieldCheck] == value);
	if (returnField) return array[index][returnField];
	return array[index];
}

export function generateListName(): string {
	const adjective = ADJECTIVES_DICT[Math.floor(Math.random() * ADJECTIVES_DICT.length)];
	const noun = NOUNS_DICT[Math.floor(Math.random() * NOUNS_DICT.length)]
	return adjective + ' ' + noun;
}