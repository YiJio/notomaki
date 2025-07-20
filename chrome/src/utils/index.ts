// packages
import { format } from 'date-fns';
import { enUS, ja, zhCN } from 'date-fns/locale';
// constants
import { ADJECTIVES_DICT, NOUNS_DICT } from '../constants/dict';
import { LOCALIZE_TERMS } from '../constants/localize';
import { MARKS, NOTE_TYPES, SWATCH_COLORS } from '../constants';

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

export function getDateTime(lang: string, date: string | number | Date): string {
	const newDate = new Date(date);
	const options: any = {
		year: 'numeric', month: '2-digit', day: '2-digit',
		hour: '2-digit', minute: '2-digit',
		hour12: false
	};
	if(lang === 'ja') return newDate.toLocaleString('ja', options).replace(',', '');
	else if(lang === 'zh') return newDate.toLocaleString('zh-CN', options).replace(',', '');
	return newDate.toLocaleString('en-US', options).replace(',', '');
}

export function getDateTimeNow(lang: string): string {
	const now = new Date();
	return getDateTime(lang, now);
}

export function getLocalizationDateTime(currLang: string = 'en', mode: string, p: number | string | Date): string {
	let result: string = '';
	const date = new Date(p);
	if (mode === 'year') {
		if (currLang === 'en') result = format(date, 'yyyy/MM/dd', { locale: enUS });
		else if (currLang === 'ja') result = format(date, 'yyyy年MMMd日', { locale: ja });
		else if(currLang === 'zh') result = format(date, 'yyyy年MMMd号', { locale: zhCN });
	} else if (mode === 'this-year') {
		if (currLang === 'en') result = format(date, 'MM/dd', { locale: enUS });
		else if (currLang === 'ja') result = format(date, '今年MMMd日', { locale: ja });
		else if(currLang === 'zh') result = format(date, '今年MMMd号', { locale: zhCN });
	} else if (mode === 'week') {
		//const day = date.getDay() as Day;
		result = format(date, 'EEEE', { locale: currLang === 'en' ? enUS : currLang === 'ja' ? ja : zhCN })
		//else if(currLang === 'zh') result = zhCN.localize.day(day, { width: 'wide' });
	}
	return result;
}

export function getLocalizationToolbox(currLang: string = 'en', value: string, mode: string): string {
	let result = getFromIndex(NOTE_TYPES, 'key', value);
	if(mode === 'swatches') { result = getFromIndex(SWATCH_COLORS, 'key', value); }
	else if(mode === 'marks') { result = getFromIndex(MARKS, 'key', value); }
	return result[currLang];
}

export function getLocalization(currLang: string = 'en', key: string | number, p: number | string | Date | null = null): string {
	const result = getFromIndex(LOCALIZE_TERMS, 'key', key);
	let string = result[currLang];
	if (p && string.indexOf('*') !== -1) { string = string.replace('*', p); }
	return string;
}