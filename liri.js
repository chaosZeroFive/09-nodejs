require("dotenv").config();

var keys = require("./keys.js");
var spotify = require("node-spotify-api");
var moment = require("moment");
var request = require("request");
var fs = require("fs");
var spotifyKey = new Spotify(keys.spotify);
var option = process.argv[2]; 
var parameter = process.argv[3];

function userInput(){
    switch (){
        case "concert-this":
        showConcert(parameter);
        break;

        case "spotify-this-song":
        showSong(parameter);
        break;

        case "movie-this":
        showMovie(parameter);
        break;

        case "do-what-it-says":
        showInfo(parameter);
        break;

        default:
        //need a way to show different response for each command
    }
}

//use command concert-this
//get the name of venue, location, and date from bands in town
function showConcert(){
    var queryUrl = "";
}
//use command spotify-this-song
//get the artist, song name, preview link and album song is from
//default return is thw sign by ace of base
function showSong(){

}
//use command movie-this using movie name
//get the title, year, IMDB rating, rotton tomatoes rating, language, plot, and actors
//default is mr.nobody
function showMovie(){

}
//use command do-what-it-says
//read the text from random.txt and return a band, song, or movie the same as above
function showInfo(){
    var queryUrl = "";
}
//output a txt file with the returned data
//check if a file exists...and name it in sequence
