require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");
var spotify = require("node-spotify-api");
var moment = require("moment");
var request = require("request");
var chalk = require("chalk");
var command = process.argv[2]; //first cl input 
var opt = process.argv[3]; //second cl input
var spotifyKey = new Spotify(keys.spotify);
var omdbKey = new omdbKey(keys.omdb);
var log = console.log;

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
        showInfo(opt);
        break;

        default:  //calls help function
        help();
        break;
    }

function help(){
    log(`
    ${chalk.yellow("=====================================================")}
    ${chalk.yellow.underline("USAGE:  node liri.js <command> [parameter]")}
        ${chalk.yellow.underline("Available Commands:")}
            ${chalk.yellow("concert-this")}
            ${chalk.yellow("spotify-this-song")}
            ${chalk.yellow("movie-this")}
            ${chalk.yellow("do-what-it-says")}
    ${chalk.yellow("=====================================================")}
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
        let artist = opt.trim();
    }
    let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryUrl, function(error, response, body){
        if (error) return log(error);
        if (!error && response.statusCode === 200){
            if (body.length < 20){
                return log("No Results Found");
            };
            let data = JSON.parse(body);
            for (let i = 0; i < 3; i++){
                log(`
                ${chalk.blue("=====================================================")}
                ${chalk.blue("#" + (i+1))}
                ${chalk.blue("Artist:          ") + data[i].}
                ${chalk.blue.bold("Venue:      ") + data[i].venue.name}
                ${chalk.blue.bold("Location:   ") + data[i].venue.city + ", " + data[i].venue.region + " " + data[i].venue.country}
                ${chalk.blue.bold("Date:       ") + data[i].venue.datetime}
                ${chalk.blue()}
                ${chalk.blue("=====================================================")}
                `);
            }
        }
    })
}
//use command spotify-this-song
//get the artist, song name, preview link and album song is from
//default return is thw sign by ace of base
function showSong(){
    if (!opt){
        opt = "The Sign";  //default song that is returned
    }
    else {
        let song = opt.trim();
    }
}
//use command movie-this using movie name
//get the title, year, IMDB rating, rotton tomatoes rating, language, plot, and actors
//default is mr.nobody
function showMovie(){
    if (!opt) {
        log(`
        ${chalk.yellow("=====================================================")}
           ${chalk.red.underline("You didn't provide a movie name")}
           ${chalk.yellow("May I suggest Mr. Nobody")}
        ${chalk.yellow("=====================================================")}
        `);
        opt = "Mr Nobody"; //default movie that is returned
    }
    else {
        let movie = opt.trim();
    }
}
//use command do-what-it-says
//read the text from random.txt and return a band, song, or movie the same as above
function showInfo(){
    //var queryUrl = "";
    if (!opt) {
        log(`
        ${chalk.yellow("=====================================================")}
            ${chalk.red.underline("The source file doesn't have anything to search for")}
        ${chalk.yellow("=====================================================")}
        `);
    }
}
//output a txt file with the returned data
//check if a file exists...and name it in sequence

function writeResults(){
    fs.writeFile("search-results.txt", resultData, function(err){
        if (err) return console.log(err);
    } )
}
