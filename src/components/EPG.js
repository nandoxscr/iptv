import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EPG = () => {
  const [epgData, setEpgData] = useState([]);

  useEffect(() => {
    const fetchEpgData = async () => {
      const response = await axios.get('YOUR_EPG_API_URL');
      setEpgData(response.data);
    };
    
    fetchEpgData();
  }, []);

  return (
    <div className="epg">
      {epgData.map((program) => (
        <div key={program.id} className="epg-item">
          {program.title} - {program.startTime}
        </div>
      ))}
    </div>
  );
};

export default EPG;