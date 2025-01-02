import React, { useState } from 'react';
import "../styles/MatchItem.css"
import { Form, Button, Row, Col } from 'react-bootstrap';
import "../styles/MatchDetail.css"
const MatchDetail = ({match, isLoggedin}) => 
{
    
    const { fixture, teams, league, goals, score} = match;
    const [formData, setFormData] = useState({ field1: '', field2: '' });
    const date = new Date(fixture.date);
    const options = { 
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', timeZone: 'UTC' 
    };
    const  handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
        const user = JSON.parse(localStorage.getItem("user"));
        const bodyJson = {
                userId :  user && user.id ? user.id : "",
                matchId : fixture.id,
                type : "score",
                data : {
                    predictedScore :{
                        "teamA" : formData.field1,
                        "teamB" :formData.field2
                    }
                }
            }
            console.log(JSON.stringify(bodyJson))
            const response = await fetch('http://localhost:8000/predictions/predict', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',  // Set the content type to JSON
              },
              body: JSON.stringify(bodyJson),  // Convert the object to a JSON string
            });
        
            if (!response.ok) {
              // Handle non-200 responses
              const errorData = await response.json();
              console.log(errorData)
            }
        
            const data = await response.json();  // Parse the JSON response
            console.log('predict successful', data); 
          } catch (error) {
            console.error('Error during predictions:', error);
        
            // Handle error (e.g., show error message to user)
          }
      };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const [matchDate, matchTime] = formattedDate.split(', ');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    return  (
        
    <div 
    //onClick={console.log(fixture)} 
    key={fixture.id} className="match-card-detail">

{
    (isLoggedin()) ?
    <Form onSubmit={handleSubmit} className="form-group">
      <Row>
        <Col md={5}>
          <Form.Group controlId="formField1">
            <Form.Label>Home team score</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your prediction"
              name="field1"
              value={formData.field1}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group controlId="formField2">
            <Form.Label>Away team score</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your prediction"
              name="field2"
              value={formData.field2}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Button variant="primary" type="submit" className="submit-button">
        Submit
      </Button>
    </Form> : ""}

        <div className="match-info">
            <div className="date-time">
                <p>{matchDate}</p>
                <p>{matchTime}</p>
            </div>
            <div className="teams">
                <div className="team-block">
                    <img src={teams.home.logo} alt={`${teams.home.name} logo`} />
                    <p>{teams.home.name}</p>
                </div>
                <div className="vs-text">VS</div>
                <div className="team-block">
                    <img src={teams.away.logo} alt={`${teams.away.name} logo`} />
                    <p>{teams.away.name}</p>
                </div>
            </div>
            <div className="venue">
                <p>{fixture.venue?.name || 'Unknown Venue'}</p>
            </div>
            <div className="league-name">
                <p>{league.name} - {league.country}</p>
            </div>
            <div>
                <p>Referee - {fixture.referee ? fixture.referee : "Unknown yet"}</p>
            </div>
            <div>
                <p>
                    <strong>Status</strong> - {fixture.status.long}
                </p>
            </div>
            {
                (goals.home !== null) ? 
                (
                <div> 
                    <h3>Full time</h3>
                    <p>{goals.home} - {goals.away}</p>
                </div>)
                : ""
            }
            {
                (score.halftime.home !== null) ? (
                    <div>
                        <h3>Half time</h3>
                        <p> 
                        {score.halftime.home} - {score.halftime.away}
                        </p>    
                     </div>
                ) : ""
            }
            {
                (score.extratime.home !== null) ? (
                    <div>
                        <h3>Extra time</h3>
                        <p> 
                        {score.extratime.home} - {score.extratime.away}
                        </p>    
                     </div>
                ) : ""
            }
            {
                (score.penalty.home !== null) ? (
                    <div>
                        <h3>Penalty</h3>
                        <p> 
                        {score.penalty.home} - {score.penalty.away}
                        </p>    
                     </div>
                ) : ""
            }
        </div>
    </div>)
}
export default MatchDetail;