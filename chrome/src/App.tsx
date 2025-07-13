// packages
import { useEffect, useState } from 'react';
// css
import './index.css';
// contexts
import { useTodoList } from './contexts/todo.context';
// components
import { Header, Note, TabList, Toolbox } from './components';

function App() {
  const [datetime, setDatetime] = useState<string>('');
  const { setTodoList, isLoading, error } = useTodoList();

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
    chrome.storage.sync.get(['todoList'], function(result) {
      let todoList = result.todoList;
      if(!todoList || Object.keys(todoList).length === 0) {
        todoList = {
          '1': {
            name: 'First Tab',
            color: 'o',
            lists: {
              '1': {
                name: 'Untitled note #1',
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
    if(isLoading) { console.log('loading...') }
    else if(error) { console.log('error', error); }
  }, [isLoading, error]);

  return (
    <>
      <div className='nm-container nm-frame'>
        <Header />
        <main className='nm-body'>
          <div className='nm-props'>
            <textarea className='nm-props__title'></textarea>
            <div className='nm-props__nav'>
              <button className='nm-hover'><img src='assets/icon-left.png' /></button>
              <span className='nm-props__span'>{datetime}</span>
              <button className='nm-hover'><img src='assets/icon-right.png' /></button>
            </div>
          </div>
          <div className='nm-folder'>
            <TabList />
            <Note />
            <div className='nm-flex nm-toolboxes'>
              <div className='nm-slot'><Toolbox type='default' /></div>
              <div className='nm-slot'><Toolbox type='swatches' /></div>
            </div>
          </div>
        </main>
        <footer className='nm-footer'>
          <div className='nm-footnote'>© 2025 YiJio</div>
        </footer>
      </div>
    </>
  );
}

export default App;
