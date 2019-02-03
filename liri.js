require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var search = process.argv[2].toLowerCase();
var term = process.argv.splice(3).join("+").toLowerCase();


function bandsInTown(artist) {
    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    console.log(URL);
    axios.get(URL).then(function(response) {
        for (var i = 0; i < response.data.length; i++) {
            var data = response.data[i];
            var bandData = [
                "Venue: " + data.venue.name,
                "Location: " + data.venue.city + ", " + data.venue.region + ", " + data.venue.country,
                "date: " + moment(data.datetime).format('MMMM Do YYYY, h:mm:ss a'),
                "-----------------------------"
            ].join("\n\n");
            fs.appendFile("log.txt", "\nSearch Terms: \n" + search + "\n" + artist + "\n\nresults: \n" + bandData, function(err) {
                if (err) throw err;
                console.log(bandData);
            });
        }
    })
}

function spotifyFunction(track) {

    if (!track) {
        track = "track:the+sign%20artist:ace+of+base%20year:2008";
    }
    spotify
        .search({ type: 'track', query: track })
        .then(function(response) {
            for (var i = 0; i < response.tracks.items.length; i++) {
                var jsonData = response.tracks.items[i];
                var songData = [
                    "Song Title: " + jsonData.name,
                    "Preview Link: " + jsonData.preview_url,
                    "Song Album: " + jsonData.album.name,
                    "-------------------------------"
                ].join("\n");
                fs.appendFile("log.txt", "\nSearch Terms: \n" + search + "\n" + track + "\n\nresults: \n" + songData, function(err) {
                    if (err) throw err;
                    console.log(songData);
                });
            }
        })
        .catch(function(err) {
            console.log(err);
        });

}

function movie(movie) {
    var URL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    console.log(URL);
    axios.get(URL).then(function(response) {
        var jsonDataMovie = response.data;
        var movieData = [
            "Title: " + jsonDataMovie.Title,
            "Year: " + jsonDataMovie.Year,
            "IMDB Rating: " + jsonDataMovie.imdbRating,
            "Rotten Tomatoes Rating: " + jsonDataMovie.Ratings[1].Value,
            "Production Country: " + jsonDataMovie.Country,
            "Language: " + jsonDataMovie.Language,
            "Plot: " + jsonDataMovie.Plot,
            "Actors: " + jsonDataMovie.Actors
        ].join("\n");
        fs.appendFile("log.txt", "\nSearch Terms: \n" + search + "\n" + movie + "\n\nresults: \n" + movieData, function(err) {
            if (err) throw err;
            console.log(movieData);
        });
    })
}

function whatISay() {
    fs.readFile("random.txt", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var dataArr = data.split(",");
        var type = dataArr[0];
        var localTerm = dataArr[1];
        //localTerm = localTerm.join("+");
        console.log(type);
        console.log(localTerm);
        switch (type) {
            case "concert-this":
                bandsInTown(localTerm);
                break;
            case "spotify-this-song":
                spotifyFunction(localTerm);
                break;
            case "movie-this":
                movie(localTerm);
                break;
            default:
                console.log("you did not enter an approptiate request!");
                break;
        }
        spotifyFunction(localTerm);
    })
}

switch (search) {
    case "concert-this":
        console.log("called");
        bandsInTown(term);
        break;
    case "spotify-this-song":
        spotifyFunction(term);
        break;
    case "movie-this":
        movie(term);
        break;
    case "do-what-i-say":
        whatISay();
        break;
    default:
        console.log("you did not enter an approptiate request!");
        break;
}