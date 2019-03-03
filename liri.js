require("dotenv").config();

const fs = require("fs");
const keys = require("./keys.js");
const moment = require("moment");
const request = require("request");
const chalk = require("chalk");
const log = console.log;

var Spotify = require("node-spotify-api");
var command = process.argv[2]; //first cl input 
var opt = process.argv[3]; //second cl input


const spotifyKey = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

const omdbKey = new OMDB({
    apikey: keys.omdb.apikey
});

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
//returned if no command is passed
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
        log(artist);
    let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryUrl, function(error, response, body){
        if (error) return log(error);
        if (!error && response.statusCode === 200){
            if (body.length < 20){
                return log("No Results Found");
            };
            let data = JSON.parse(body);
            for (let i = 0; i < 3; i++){
                //log(data[i]);
                log(`
                ${chalk.blue("=====================================================")}
                ${chalk.blue("#" + (i+1))}
                ${chalk.blue.bold("Venue:      ") + data[i].venue.name}
                ${chalk.blue.bold("Location:   ") + data[i].venue.city + ", " + data[i].venue.region + " " + data[i].venue.country}
                ${chalk.blue.bold("Date:       ") + data[i].venue.datetime}
                ${chalk.blue("=====================================================")}
                `);
            }
        }
    });
}
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

        let queryUrl = "http://www.omdbapi.com/?&t=" + movie +  "&apikey=" + omdbKey;

        request(queryUrl, function(err, response, body){
            let data = JSON.parse(body);
        });
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
    } );
}
