import React, { useEffect, useState } from 'react';
import MatchItem from './MatchItem';

const PredictionsDisplay = ({ predictions }) => {
  const [responses, setResponses] = useState({}); // To store responses for each matchid
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllMatchData = async () => {
      try {
        setLoading(true);
        const newResponses = {};

        // Fetch data for each matchid sequentially or concurrently
        for (const prediction of predictions) {
            //console.log(prediction)
            const options = {
                method: 'GET',
                headers: {
                      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
                        "x-rapidapi-key": "6c4362965bmshc7357b4fd26115cp136a72jsnbea643c8c40d"
                }
            };
          const response = await fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${prediction.matchId}`, options); // Replace with your API endpoint
          const data = await response.json();
          
          //console.log(data.response)
          newResponses[prediction.matchid] = data.response; // Store data using matchid as the key
        }

        setResponses(newResponses);
      } catch (error) {
        console.error("Error fetching match data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (predictions?.length) {
      fetchAllMatchData();
    }
  }, [predictions]);

  if (loading) {
    return <div>Loading match data...</div>;
  }

  return (
    <div>
      {predictions.map((p) => (
        <div key={p.matchid}>
          
            <MatchItem match={responses[p.matchid][0]} />
            <p>
                Your predictions {p.data.predictedScore.teamA} :{p.data.predictedScore.teamB}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PredictionsDisplay;
