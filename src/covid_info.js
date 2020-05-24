import { readString } from 'react-papaparse';

const COL_START = 2;

export default class data_model {
    constructor() {
        // class vars
        this.filename = process.env.REACT_APP_COVID_DATA_FILENAME;
        this.lat = null;
        this.long = null;
        this.radius = null;
        this.minDistance = Number.MAX_VALUE;

        // load covid data
        // PARSE THIS DATA BETTTERRRRRRRRRRRRRRRRRRRRRRRR
        // (find better dataset, look at confirmed cases, etc.)
        this.load_data().then((data) => {
            // clean data
            this.cols = data.slice(0, 1);
            this.data = data.slice(1)
                .map((row) => { return row.slice(COL_START, COL_START + 2) })
                .sort((a, b) => { return a[0] - b[0] });
        });
    }

    // easier interface to check if a single lat/long point is in radius
    nearby(otherLat, otherLong) {
        return this.distance(otherLat, otherLong) <= this.radius;
    }

    numNearbyCases() {
        if (!this.hasInfo()) {
            alert("Must enter a latitude, longitude, and radius!");
            return null;
        }

        let cases = 0;;
        let row = [];

        // probably make this faster with kd-tree but ¯\_(ツ)_/¯
        for (row of this.data) {
            cases = cases + (this.nearby(row[0], row[1]) ? 1 : 0);
            const d = this.distance(row[0], row[1]);
            if (d < this.minDistance) {
                this.minDistance = d;
            }
        }
        return cases;
    }

    nearestCaseByDistance() {
        if (!this.hasInfo()) {
            alert("Must enter a latitude, longitude, and radius!");
            return null;
        }

        // probably make this faster with kd-tree but ¯\_(ツ)_/¯
        /*
        for (row of this.data) {
            minDistance = Math.min(minDistance, this.distance(row[0], row[1]));
        }*/

        return this.minDistance;
    }

    // easier interface for internal use
    distance(otherLat, otherLong) {
        return this.haversineDistance(this.lat, this.long, otherLat, otherLong);
    }

    // provided for public use great circle distance (haversine) between two points
    // assumes lat,long,radius are non-null
    haversineDistance(lat1, long1, lat2, long2) {
        const p = 0.017453292519943295;    // Math.PI / 180
        const c = Math.cos;
        const a = 0.5 - c((lat2 - lat1) * p)/2 + 
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
            alert("Bad location info provided!");
        }
        this.lat = lat;
        this.long = long;
        this.radius = radius;
    }

    hasInfo() {
        return this.lat && this.long && this.radius;
    }
}