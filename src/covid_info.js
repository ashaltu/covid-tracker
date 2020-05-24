import {readString} from 'react-papaparse';

export default class data_model {
    constructor() {
        // class vars
        this.filename = process.env.REACT_APP_COVID_DATA_FILENAME;
        this.lat = null;
        this.long = null;
        this.radius = null;

        // load covid data
        // PARSE THIS DATA BETTTERRRRRRRRRRRRRRRRRRRRRRRR
        // (find better dataset, look at confirmed cases, etc.)
        this.load_data().then((data) => {
            // clean data
            this.cols = data.slice(0,1);
            this.data = data.slice(1)
            .map((row) => {return row.slice(3,5)})
            .sort((a,b) => {return a[0] - b[0]});
        });
    }

    numNearbyCases() {
        if (!this.lat || !this.long || !this.radius) {
            alert("Must enter a latitude, longitude, and radius!");
            return null;
        }

        let cases = 0;
        // probably make this faster with kd-tree but ¯\_(ツ)_/¯
        for(let row of this.data) {
            cases = cases + (this.nearby(row[0], row[1]) ? 1 : 0);
        }
        return cases;
    }

    // easier interface to check if a single lat/long point is in radius
    nearby(otherLat, otherLong) {
        const dist = this.distance(this.lat, this.long, otherLat, otherLong);
        return dist <= this.radius;
    }

    // great circle distance (haversine) between two points
    distance(lat1, long1, lat2, long2) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((long2 - long1) * p))/2;
      
        return (12742 * Math.asin(Math.sqrt(a))) / 1.609344; // 1.609344 converts km->miles
    }
    
    // fetch data from csv
    async load_data() {
        const request = async () => {
            const response = await fetch(this.filename);
            const content = await response.text();
            return readString(content).data;
        }
        return request();
    }

    setLocationInfo(lat, long, radius) {
        if (!lat || !long || !radius) {
            alert("Bad location info!");
        }
        this.lat = lat;
        this.long = long;
        this.radius = radius;
    }

    hasInfo() {
        return this.lat && this.long && this.radius;
    }
}