import React, { useEffect, useState } from 'react';

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
          const response = await fetch(`/api/match/${prediction.matchid}`); // Replace with your API endpoint
          const data = await response.json();
          newResponses[prediction.matchid] = data; // Store data using matchid as the key
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
          <h3>Match ID: {p.matchid}</h3>
          <p>
            {responses[p.matchid]
              ? JSON.stringify(responses[p.matchid]) // Render fetched data
              : "No data available for this match."}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PredictionsDisplay;
