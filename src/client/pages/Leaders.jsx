import React, { useState, useEffect } from 'react';
import axios from 'axios';
function Leaders() {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    axios
      .get(`/users/gethighscore/`)
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => b.highscore - a.highscore
        );
        setLeaderboardData(sortedData);
      })
      .catch((e) => console.log(e));
  }, []);
  return (
    <div className='leaderboard'>
      <div className='leaderBox'>
        <h1>Leaderboard</h1>
        <div className='table'>
          <div className='table-row table-header'>
            <div className='table-cell'>Rank</div>
            <div className='table-cell'>Name</div>
            <div className='table-cell'>Score</div>
          </div>
          {leaderboardData.map((player, index) => (
            <div className='table-row' key={index}>
              <div className='table-cell'>{index + 1}</div>
              <div className='table-cell'>{player.name}</div>
              <div className='table-cell'>{player.highscore}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leaders;
