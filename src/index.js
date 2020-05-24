import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import data_model from './covid_info.js';

require('dotenv').config();

class CasesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      long: null,
      radius: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  handleSubmit(event) {
    if (this.stateContainsInfo()){
      this.props.info.setLocationInfo(this.state.lat, this.state.long, this.state.radius);
    }
    event.preventDefault();
    this.forceUpdate();
  }

  stateContainsInfo() {
    return this.state.lat && this.state.long && this.state.radius;
  }

  render() {
    const infoProvided = this.props.info.hasInfo();
    const cases =  infoProvided ? (this.props.info.numNearbyCases()) : 0;
    return (
      
      <div className="casesInfo">
        <form onSubmit={this.handleSubmit}>
          <label>
            Latitude: <input type="text" name="lat" onChange={this.handleChange}/>
          </label>
          <label>
            Longitude: <input type="text" name="long" onChange={this.handleChange}/>
          </label>
          <label>
            Radius in Miles: <input type="text" name="radius" onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Find Cases"/>
        </form>
        <h3>Number of COVID-19 cases nearby: {infoProvided ? " " + cases : " No user info found"}</h3>
        {infoProvided && !cases ? (
          <h4>
            The nearest confirmed case is {" " + this.props.info.nearestCaseByDistance() + " "} miles away
          </h4>
        ) : ""}
      </div>
    );
  }

}




// =====================DOM===================

ReactDOM.render(<CasesComponent info={new data_model()} />, document.getElementById('root'));