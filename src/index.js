import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import data_model from './covid_info.js';

require('dotenv').config();

class CasesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.lat = null;
    this.long = null;
    this.radius = null;
    this.state = {
      cases: null,
      minDistance: null
    }
    /*
    this.state = {
      lat: null,
      long: null,
      radius: null
    };
    */

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(event) {
    const target = event.target;
    this[target.name] = target.value;
    /*
    this.setState({
      [target.name]: target.value
    });*/
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.containsInfo()) {
      this.props.info.setLocationInfo(this.lat, this.long, this.radius);
      this.setState({
        cases: this.props.info.numNearbyCases(),
        minDistance: this.props.info.nearestCaseByDistance()
      });
    }
  }

  containsInfo() {
    return this.lat && this.long && this.radius;
    // return this.state.lat && this.state.long && this.state.radius;
  }

  render() {
    const infoProvided = this.props.info.hasInfo();
    const cases = infoProvided ? this.state.cases : "No user info found";
    const radius = infoProvided ? this.radius : 0;
    const minDistance = infoProvided ? " " + this.state.minDistance : 0;
    return (

      <div className="requiredInfo">
        <form className="submissionForm" onSubmit={this.handleSubmit}>
          <label>
            Latitude: <input type="text" name="lat" onChange={this.handleChange} />
          </label>
          <label>
            Longitude: <input type="text" name="long" onChange={this.handleChange} />
          </label>
          <label>
            Radius in Miles: <input type="text" name="radius" onChange={this.handleChange} />
          </label>
          <input type="submit" value="Find Cases" />
        </form>
        <div className="resultsInfo" >
          <h3>Number of COVID-19 cases in {radius} mile radius: {cases}</h3>
          <h3>The nearest confirmed case is {minDistance} miles away</h3>
        </div>

      </div>
    );
  }

}




// =====================DOM===================

ReactDOM.render(<CasesComponent info={new data_model()} />, document.getElementById('root'));