// packages
import { createClient } from '@supabase/supabase-js';

// important
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function initUser(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['userId'], async result => {
      if (result.userId) return resolve(result.userId);
      // create anonymous session and generate userId
      const { data, error } = await supabase.auth.signInAnonymously();
      const userId = data?.user?.id;
      if (userId) {
        chrome.storage.sync.set({ userId });
        resolve(userId);
      } else {
        console.error('Error creating anonymous user:', error);
      }
    });
  });
}

export async function fetchLang(userId: string) {
  const { data, error } = await supabase.from('users').select('lang').eq('user_id', userId).single();
  if (error && error.code !== 'PGRST116') { console.error(error); }
  return data?.lang ?? 'en';
}

export async function saveLang(userId: string, lang: string) {
	const { error } = await supabase.from('users').update({ lang: lang }).eq('user_id', userId);
	if (error) console.error('Save error:', error);
}

export async function fetchTodos(userId: string) {
  const { data, error } = await supabase.from('users').select('data').eq('user_id', userId).single();
  if (error && error.code !== 'PGRST116') { console.error(error); }
  return data?.data ?? {}; // return {} if no data found
}

export async function saveTodos(userId: string, todoList: any) {
	const { error } = await supabase.from('users').upsert({ user_id: userId, data: todoList, updated_at: new Date().toISOString(), }).select();
	if (error) console.error('Save error:', error);
}