require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var moment = require("moment");
var lineReader = require("line-reader");
var axios = require("axios");
var chalk = require("chalk");
var log = console.log;
var Spotify = require("node-spotify-api");
var command = process.argv[2]; //first cl input 
var opt = process.argv[3]; //second cl input
var spotify = new Spotify(keys.spotify);
var appRun = false;
var runCount = 0;
var gotObject;
const hr = "=========================================================";

    switch (command){
        case "concert-this":
            showConcert(opt);
            break;

        case "spotify-this-song":
            showSong(opt);
            break;

        case "movie-this":
            showMovie(opt);
            break;

        case "do-what-it-says":
            doThis(opt);
            break;
        
        case "":
            help();
            break;

        default:
            help();
            break;
    }
//returned if no command is passed
function help(){
log(`
${chalk.yellow(hr)}

${chalk.yellow("USAGE:  node liri.js <COMMAND> [parameter]")}

${chalk.yellow("Available Commands:")}
    ${chalk.yellow("concert-this [parameter]")}
    ${chalk.yellow("spotify-this-song [parameter]")}
    ${chalk.yellow("movie-this [parameter]")}

    ${chalk.yellow("ALTERNATE USAGE:  node liri.js ") + chalk.yellow.underline("do-what-it-says") + chalk.yellow(" [NO PARAMETER]")}
    ${chalk.yellow("Reads command and parameter from random.txt")}

${chalk.yellow(hr)}
`);
}

//use command concert-this
//get the name of venue, location, and date from bands in town
function showConcert(){
    if (!opt){
        log(`
        ${chalk.yellow("=====================================================")}
           ${chalk.red.underline("You didn't provide an artist")}
        ${chalk.yellow("=====================================================")}
        `);
        return;
    }
    else {
        var artist = opt.trim();
        log(artist);
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        appRun = true;
        runCount++;
        axios.get(queryUrl)
            .then(function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    let name = response.data[i].venue.name;
                    let loc = response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country;
                    let dateT = moment(response.data[i].datetime).format("DD MMMM YYYY h:mm");
log(`
${chalk.yellow.bold(hr)}
${chalk.yellow.bold("#" + (i + 1))}
${chalk.yellow.bold("Venue: ") + name}
${chalk.yellow.bold("Location: ") + loc}
${chalk.yellow.bold("Date: ") + dateT}
${chalk.yellow.bold(hr)}
`);
                }
            })
            .catch(function (error) {
                log(error);
            });
    }
}
    
//use command spotify-this-song
//get the artist, song name, preview link and album song is from
//default return is thw sign by ace of base

function showSong(song){
    if (!opt){
        song = "The Sign Ace of Bass";
    }
    else {
        song = opt.trim();
        appRun = true;
        runCount++;
    }
        spotify.search({
            type: 'track',
            query: song,
            limit: 5
        }).then(function(response){
            var obj = response.tracks.items;
            var item = 0;
            for (var i = 0; i < obj.length; i++){
                item++;
                var a = JSON.stringify(obj[i].album.artists);
                var a_obj = JSON.parse(a);
                var artists = a_obj.map(a_obj => a_obj.name);
log(`
${chalk.yellow.bold("Song: " + item)}
${chalk.yellow(hr)}
${chalk.yellow.bold("Artist(s):   ") + chalk.whiteBright(artists)}
${chalk.yellow.bold("Song Name:   ") + chalk.whiteBright(obj[i].name)}
${chalk.yellow.bold("Album:       ") + chalk.whiteBright(obj[i].album.name)}
${chalk.yellow.bold("Preview:     ") + chalk.whiteBright(obj[i].preview_url)}
${chalk.yellow(hr)}
`);
            }
        }).catch(function(err){
            log(err);
        });
    }
//use command movie-this using movie name
//get the title, year, IMDB rating, rotton tomatoes rating, language, plot, and actors
//default is mr.nobody

function showMovie() {
    if (!opt) {
        opt = "Mr Nobody"; //default movie that is returned
log(`
    ${chalk.yellow("You didn't provide a movie name")}
    ${chalk.yellow("May I suggest Mr. Nobody")}
`);
    }
    appRun = true;
    runCount++;
    axios.get("http://www.omdbapi.com/?t=" + opt.trim() + "&plot=short&apikey=trilogy")
        .then(function (response) {
log(`
${chalk.yellow(hr)}
${chalk.yellow("Title: ") + response.data.Title}
${chalk.yellow("Released: ") + response.data.Year}
${chalk.yellow("IMDB Rating: ") + response.data.imdbRating}
${chalk.yellow("Rotten Tomatos Rating: ") + response.data.rottenTomatos}
${chalk.yellow("Country Produced: ") + response.data.Country}
${chalk.yellow("Language: ") + response.data.Language}
${chalk.yellow("Plot: ") + response.data.Plot}
${chalk.yellow("Actors: ") + response.data.Actors}
${chalk.yellow(hr)}
`);
        })
        .catch(function (error) {
            log(error);
        });
}

//use command do-what-it-says
//read the text from random.txt and return a band, song, or movie the same as above
function doThis() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        var text = data.split(",");
        
    });
}

//output a txt file with the returned data
//check if a file exists...and name it in sequence
function appendRandom() {
    fs.appendFile("./random.txt", gotObject, function (err) {
        if (err) throw err;
    });
}