// packages
import { useEffect, useState } from 'react';
// css
import './index.css';
// contexts/providers
import { ModalProvider } from './contexts/modal.context';
// hooks
import { useTodoList } from './contexts/todo.context';
// components
import { Copy, Header, NewNoteButton, Note, TabList, Toolbox } from './components';
import { NOTE_TYPES } from './components/toolbox';

function getFromIndex(array: any[], fieldCheck: string, value: any, returnField?: string | null) {
	const index = array.findIndex((a) => a[fieldCheck] == value);
	if (returnField) return array[index][returnField];
	return array[index];
}


function App() {
  const [datetime, setDatetime] = useState<string>('');
  const { activeTab, activeList, todoList, setTodoList, isLoading, error } = useTodoList();
  const activeNote = todoList?.[activeTab]?.lists?.[activeList]?.note;
  const noteShort = getFromIndex(NOTE_TYPES, 'key', activeNote)?.short;

  function updateTime() {
    const now = new Date();
    const options: any = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    };
    const formattedTime = now.toLocaleString('en-US', options).replaceAll('/', '.').replace(',', '');
    setDatetime(formattedTime);
  }

  function loadTodoList() {
    chrome.storage.sync.get(['todoList'], function (result) {
      let todoList = result.todoList;
      if (!todoList || Object.keys(todoList).length === 0) {
        todoList = {
          '1': {
            name: 'First Tab',
            color: 'o',
            order: 0,
            lists: {
              '1': {
                name: 'Untitled note #1',
                note: 'line-solid',
                items: [
                  { text: 'Item 1', completed: false, cursorPosition: 0 },
                ]
              }
            }
          }
        };
        setTodoList(todoList);
      }
    });
  }

  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    return () => { clearInterval(interval); }
  }, []);

  useEffect(() => {
    loadTodoList();
  }, []);

  useEffect(() => {
    if (isLoading) { console.log('loading...') }
    else if (error) { console.log('error', error); }
  }, [isLoading, error]);

  return (
    <div className='nm-frame nm-container'>
      <ModalProvider>
        <Header />
        <main className='nm-body'>
          <div className='nm-props nm-layer'>
            <div className='nm-props__nav'>
              <NewNoteButton />
              <button className='nm-hover'><img src='assets/icon-left.png' /></button>
              <span className='nm-props__span'>{datetime}</span>
              <button className='nm-hover'><img src='assets/icon-right.png' /></button>
            </div>
          </div>
          <div className='nm-folder'>
            <TabList />
            <Note />
            <div className='nm-flex nm-toolboxes nm-layer'>
              <div className='nm-slot'><Toolbox type='default' /></div>
              <div className='nm-slot'><Toolbox type='swatches' /></div>
            </div>
          </div>
        </main>
        <Copy />
        <div className={`nm-notebook nm-notebook--${noteShort}`} />
      </ModalProvider>
    </div>
  );
}

export default App;
