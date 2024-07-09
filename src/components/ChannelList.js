import React from 'react';
import { usePlaylistContext } from '../context/PlaylistContext';
import { Box, List, ListItem, ListItemText } from '@mui/material';

const ChannelList = ({ category }) => {
  const { playlists } = usePlaylistContext();

  const filteredChannels = playlists.flatMap(playlist =>
    (playlist.items || []).filter(item => item.groupTitle === category)
  );

  return (
    <Box>
      <List>
        {filteredChannels.map((channel, index) => (
          <ListItem key={index}>
            <ListItemText primary={channel.name} secondary={channel.url} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChannelList;