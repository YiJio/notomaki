// packages
import { nanoid } from 'nanoid';

export const GUIDELINES_TAB = {
	name: 'Guidelines', color: 'o', mark: 'x', order: 0,
	lists: {
		'1': {
			name: 'Guide to using noto maki pt. 1', note: 'grid-dot', heading: '', updated: 1752908400000,
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
			name: 'Guide to using noto maki pt. 2', note: 'grid-dot', heading: '', updated: 1752908400000,
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
			name: 'Patch 1.1.0', note: 'grid-dot', heading: 'Patch 1.1.0 notes', updated: 1752562800000,
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
			name: 'Patch 1.1.1', note: 'grid-dot', heading: 'Patch 1.1.1 notes', updated: 1752908400000,
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
				{ id: nanoid(), text: 'UI changes & additions', completed: false, indent: 1 },
				{ id: nanoid(), text: 'Included last updated date and time for each note', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Tabs now show the most recently updated note on click', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Added hamburger menu UI to see list of notes in each tab', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Added English, Japanese, and Chinese localizations to UI (not written text)', completed: false, indent: 2 },
				{ id: nanoid(), text: 'More storage options', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Other bugs', completed: false, indent: 1 },
				{ id: nanoid(), text: 'Heading overrides other headings bug', completed: false, indent: 2 },
				{ id: nanoid(), text: 'Delete key not deleting text bug', completed: false, indent: 2 },
			]
		}
	}
};

export const TESTING_TAB = {
	name: 'Testing', color: 'g', mark: 'x', order: 1,
	lists: {
		'1': {
			name: 'Testing 1', note: 'grid-dot', heading: '', updated: 1721372400000,
			items: [
				{ id: nanoid(), text: 'Last year', completed: false, indent: 1 },
			]
		},
		'2': {
			name: 'Testing 2', note: 'grid-dot', heading: '', updated: 1749970800000,
			items: [
				{ id: nanoid(), text: '? month ago & this year', completed: false, indent: 1 },
			]
		},
		'3': {
			name: 'Testing 3', note: 'grid-dot', heading: '', updated: 1751698800000,
			items: [
				{ id: nanoid(), text: 'This month & year', completed: false, indent: 1 },
			]
		},
		'4': {
			name: 'Testing 4', note: 'grid-dot', heading: '', updated: 1752562800000,
			items: [
				{ id: nanoid(), text: 'This week', completed: false, indent: 1 },
			]
		},
		'5': {
			name: 'Testing 5', note: 'grid-dot', heading: '', updated: 1752822000000,
			items: [
				{ id: nanoid(), text: 'Yesterday', completed: false, indent: 1 },
			]
		},
		'6': {
			name: 'Testing 6', note: 'grid-dot', heading: '', updated: 1752908400000,
			items: [
				{ id: nanoid(), text: 'Today', completed: false, indent: 1 },
			]
		}
	}
};