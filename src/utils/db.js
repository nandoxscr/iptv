import { openDB } from 'idb';

const DB_NAME = 'IPTV';
const DB_VERSION = 1;
const PLAYLIST_STORE = 'playlists';

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(PLAYLIST_STORE)) {
        db.createObjectStore(PLAYLIST_STORE, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const addPlaylistToDB = async (playlist) => {
  const db = await initDB();
  const tx = db.transaction(PLAYLIST_STORE, 'readwrite');
  await tx.store.add(playlist);
  await tx.done;
};

export const getPlaylistsFromDB = async () => {
  const db = await initDB();
  const tx = db.transaction(PLAYLIST_STORE, 'readonly');
  const store = tx.store;
  const playlists = await store.getAll();
  await tx.done;
  return playlists;
};

export const updatePlaylistInDB = async (id, updatedPlaylist) => {
  const db = await initDB();
  const tx = db.transaction(PLAYLIST_STORE, 'readwrite');
  await tx.store.put({ ...updatedPlaylist, id });
  await tx.done;
};

export const deletePlaylistFromDB = async (id) => {
  const db = await initDB();
  const tx = db.transaction(PLAYLIST_STORE, 'readwrite');
  await tx.store.delete(id);
  await tx.done;
};