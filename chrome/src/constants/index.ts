// packages
import { nanoid } from 'nanoid';

export const NOTE_TYPES = [
	/*{ key: 'line-solid', value: 'solid line', short: 'ls' },
	{ key: 'line-dot', value: 'dotted line', short: 'ldo' },*/
	{ key: 'grid-dot', value: 'dotted grid', short: 'gdo' },
	{ key: 'grid-dash', value: 'dashed grid', short: 'gda' },
	{ key: 'grid-solid', value: 'solid grid', short: 'gs' }
];

export const SWATCH_COLORS = [
	{ key: 'o', value: 'orange' },
	{ key: 'y', value: 'yellow' },
	{ key: 'g', value: 'green' },
	{ key: 'm', value: 'mint' },
	{ key: 'b', value: 'blue' },
	{ key: 'p', value: 'purple' }
];

export const MARKS = [
	{ key: 'x', value: 'x mark' },
	{ key: 'c', value: 'check mark' }
];

export const NOUNS_DICT = [
	'salmon', 'tuna', 'avocado', 'cucumber', 'shrimp', 'crab', 'eel', 'unagi', 'tobiko', 'masago', 'nori', 'rice', 'seaweed', 'wasabi', 'soy sauce', 'ginger', 'tempura', 'California roll', 'Philadelphia roll', 'spicy tuna roll', 'dragon roll', 'rainbow roll', 'maki', 'nigiri', 'sashimi', 'sushi rice', 'sushi grade', 'roll', 'hand roll', 'temaki', 'poke', 'rice ball', 'triangle', 'umeboshi', 'pickled plum', 'furikake', 'sesame seeds', 'snack', 'lunch', 'creation', 'texture', 'bite', 'plate', 'art', 'shiso leaf', 'tarako', 'kombu', 'kelp', 'okaka', 'flakes', 'tsukemono', 'topping', 'filling', 'wrap', 'mayo', 'eel sauce', 'mango', 'paste', 'pickle', 'kanikama', 'tako', 'sake', 'hamachi', 'tai', 'maguro', 'ebi', 'ikura', 'oshinko', 'hosomaki', 'gunkanmaki', 'chirashizushi', 'oshizushi', 'kapppamaki', 'inarizushi', 'futomaki', 'uramaki', 'onigiri', 'spider roll', 'Alaska roll', 'Boston roll', 'caterpillar roll', 'firecracker roll', 'volcano roll', 'vegetable roll', 'dynamite roll', 'jackpot roll', 'memo', 'task', 'chore', 'errand', 'plan', 'ponzu', 'octopus', 'roe', 'amadai', 'anago', 'awabi', 'aji', 'chu-toro', 'gari', 'hamaguri', 'hotate', 'ika', 'iwashi', 'kamasu', 'kazunoko', 'kome', 'koshu', 'miso shiru', 'oboro', 'otoshi', 'shoyu', 'suzuki', 'tamago', 'toro', 'tofu', 'tekkamaki'
];

export const ADJECTIVES_DICT = [
	'Zen', 'Serene', 'Chaotic', 'Busy', 'Non-essential', 'Bottom-priority', 'Minute', 'Genius', 'Simple', 'Too much', 'Umami', 'Unbelievable', 'Delicious', 'Coastal', 'Ocean', 'Misty', 'Spicy', 'Tangy', 'Savory', 'Delicate', 'Fresh', 'Vibrant', 'Colorful', 'Artistic', 'Whimsical', 'Dreamy', 'Ninja', 'Sumo', 'Karate-chop', 'Tiny', 'Flavor', 'Explosive', 'Pocket', 'Rolling', 'Zen', 'Crabby', 'Pickled', 'Ginger', 'Patty', 'Rice-y', 'Get it done', 'Tackle this', 'Knock out', 'Wrap up', 'Sort out', 'Deal with', 'Time to', 'Top priority', 'Best', 'High importance', 'Quick win', 'Short and sweet', 'Tough nut', 'Breezing', 'Smooth', 'Bumpy', 'Gentle', 'Super duper', 'Radically cool', 'Totally awesome', 'Don\'t forget', 'Pretty much', 'Sort of', 'Maybe later', 'In a jiffy', 'ASAP', 'No sweat', 'Easy peasy', 'Let\'s roll', 'Seriously though', 'Almost done', 'Work smarter, not', 'Level up', 'Full steam ahead', 'Keep calm', 'Never give up', 'Stay focused', 'New beginnings', 'Turning point', 'Finishing touch', 'Home stretch', 'Clean slate', 'Challenging', 'Rice overload', 'A little fishy', 'Pefecting the', 'Journey to the', 'Mysterious', 'Reserved for', 'Confidential', 'Silly', 'Stellar', 'Totally', 'Mega', 'Amazing', 'Awesome', 'Chewy', 'Crunchy', 'Silky', 'Rough', 'Mild', 'Gloomy', 'Sunny', 'Sweet', 'Peaceful', 'Crisp', 'Teeny-tiny', 'Humongous', 'Gigantic', 'Massive', 'Incomplete', 'Long-term', 'Short-term', 'Hold on,', 'Urgent', 'Raw', 'Delightful', 'Feast on', 'Adventurous', 'Snappy'
];

export const GUIDELINES_TAB = {
	name: 'Guidelines', color: 'o', mark: 'x', order: 0,
	lists: {
		'1': {
			name: 'Guide to using noto maki pt. 1', note: 'grid-dot', heading: '',
			items: [
				{ id: nanoid(), text: 'Hello there.', completed: true, indent: 1 },
				{ id: nanoid(), text: 'You can start by typing your to-do items here!', completed: false, indent: 1 },
				{ id: nanoid(), text: 'At the start of a line, press "tab" to indent a line. Can only indent up to 4 times (5 levels).', completed: false, indent: 1 },
				{ id: nanoid(), text: 'I am at level 2!', completed: false, indent: 2 },
				{ id: nanoid(), text: 'I am at level 3!', completed: false, indent: 3 },
				{ id: nanoid(), text: 'I am at level 4!', completed: false, indent: 4 },
				{ id: nanoid(), text: 'I am at level 5! Press enter and you will go to next line with the previous indentation!', completed: false, indent: 5 },
				{ id: nanoid(), text: 'You can press enter to reduce your indentation if you have no text on the current line.', completed: false, indent: 4 },
				{ id: nanoid(), text: 'You can perform basic formatting to your text: <b>bolding</b> (ctrl+b/cmd+b), <i>italicizing</i> (ctrl+i/cmd+i), and <u>underlining</u> (ctrl+u/cmd+u).', completed: false, indent: 1 },
				{ id: nanoid(), text: '<u><b>Please click the right arrow sign</b></u> above to go to the next page. The little guide continues there!', completed: false, indent: 1 },
			]
		},
		'2': {
			name: 'Guide to using noto maki pt. 2', note: 'grid-dot', heading: '',
			items: [
				{ id: nanoid(), text: '<u><b>Like making maki rolls, you need to be patient and follow basic guidelines:</b></u>', completed: false, indent: 1 },
				{ id: nanoid(), text: '<b>Create a new tabby</b>: click on that + button on the left!', completed: false, indent: 2 },
				{ id: nanoid(), text: '<b>Rename a note</b>: type on the field next to your tab name at the top', completed: false, indent: 2 },
				{ id: nanoid(), text: '<b>Tabby popup menu 👀:</b> right-click on a tabby!', completed: false, indent: 2 },
				{ id: nanoid(), text: '<b>Rename a tabby</b>', completed: false, indent: 3 },
				{ id: nanoid(), text: '<b>Delete a tabby 🙁</b> (must confirm!) ', completed: false, indent: 3 },
				{ id: nanoid(), text: '<b>Reorder a tabby</b>', completed: false, indent: 3 },
				{ id: nanoid(), text: '<b>Simple customization? 😮</b>: toolboxes on your right!', completed: false, indent: 2 },
				{ id: nanoid(), text: '<b>Changing a specific <u>note</u>\'s type</b>', completed: false, indent: 3 },
				{ id: nanoid(), text: '<b>Changing a <u>tabby</u>\'s color</b>', completed: false, indent: 3 },
				{ id: nanoid(), text: '<b>Changing a <u>tabby</u>\'s marking</b>', completed: false, indent: 3 },
				{ id: nanoid(), text: '<b>Cycle your notes in this tab</b>: click the arrow signs at the top between the current date and time!', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Note: It will only work if you have added new notes with that "New note +" button!', completed: false, indent: 3 },
				{ id: nanoid(), text: '<b>Save your notes</b>: click the "Save" button if you ever want to.', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Note: The extension auto saves it for you every 2 minutes, if you ever hide the side panel, or if you close the window.', completed: false, indent: 3 },
				{ id: nanoid(), text: '<b>Mark your to-do items complete by checking the checkmark at the front of each line!</b>', completed: false, indent: 1 },
				{ id: nanoid(), text: 'Happy to-do completing!', completed: true, indent: 1 },
			]
		}
	}
};

export const PATCHES_TAB = {
	name: 'Patches', color: 'y', mark: 'x', order: 1,
	lists: {
		'1': {
			name: '1.1.0', note: 'grid-dot', heading: 'Patch 1.1.0 notes', updated: '07/15/2025, 12:00 AM',
			items: [
				{ id: nanoid(), text: 'Editing fixes', completed: false, indent: 1 },
				{ id: nanoid(), text: 'Backspace & enter for indentation on blank lines', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Up and down arrow navigation between lines', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Select all lines and with backspace, enter, and delete keys', completed: false, indent: 2 },
				{ id: nanoid(), text: 'New functionalities', completed: false, indent: 1 },
				{ id: nanoid(), text: 'Added note deletion', completed: false, indent: 2 },
				{ id: nanoid(), text: 'UI changes', completed: false, indent: 1 },
				{ id: nanoid(), text: 'Note action bar includes delete note option', completed: false, indent: 1 },
				{ id: nanoid(), text: 'Date and time moved to left side', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Note navigation inside of tab & note name', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Current page out of total pages indicator', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Other bug fixes', completed: false, indent: 1 },
				{ id: nanoid(), text: 'Sorting tabs bug', completed: false, indent: 2 },
			]
		},
		'2': {
			name: '1.1.1', note: 'grid-dot', heading: 'Patch 1.1.1 notes', updated: '07/??/2025, 12:00 AM',
			items: [
				{ id: nanoid(), text: 'Editing fixes', completed: false, indent: 1 },
				{ id: nanoid(), text: 'Removed select all lines', completed: false, indent: 2 },
				{ id: nanoid(), text: '*Only able to select all in current line', completed: false, indent: 3 },
				{ id: nanoid(), text: 'Left and right arrow navigation between lines', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Some indentation fixes', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Pasting rich text disabled', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Auto save change', completed: false, indent: 2 },
				{ id: nanoid(), text: 'From auto saving every 2 minutes →', completed: false, indent: 3 },
				{ id: nanoid(), text: 'To auto saving every time you write something new ✅', completed: false, indent: 3 },
				{ id: nanoid(), text: 'Date and time additions', completed: false, indent: 1 },
				{ id: nanoid(), text: 'Included last updated date and time for each note', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Notes now show in order of last updated date and time', completed: false, indent: 1 },
				{ id: nanoid(), text: 'UI changes', completed: false, indent: 1 },
				{ id: nanoid(), text: 'Added hamburger menu UI to see list of notes in each tab', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Other bugs', completed: false, indent: 1 },
				{ id: nanoid(), text: 'Heading overrides other headings bug', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Delete key not deleting text bug', completed: false, indent: 2 },
			]
		}
	}
};