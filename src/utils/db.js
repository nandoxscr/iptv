import { openDB } from 'idb';

const DB_NAME = 'IPTVDatabase';
const STORE_NAME = 'playlists';
const VERSION = 1;

async function initDB() {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function getPlaylistsFromDB() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function addPlaylistToDB(playlist) {
  const db = await initDB();
  await db.add(STORE_NAME, playlist);
}

export async function deletePlaylistFromDB(id) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}

export async function updatePlaylistInDB(id, updatedPlaylist) {
  const db = await initDB();
  await db.put(STORE_NAME, updatedPlaylist);
}