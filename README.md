# LiriBot
## Introduction
LiriBot is a node.js command line application for searching for concerts, songs, or movies.

## Features
- Works from CLI
- Search for a Concert by Artist
- Search for a Song by Track
- Search for a Movie by Title
- Search for any of the above from a text file

## Installation
Install node modules
  >npm install

Create environment file in top level folder named .env with the following:

>SPOTIFY_ID = *Your Spotify ID*
>
>SPOTIFY_SECRET = *Your Spotify Secret*

## Usage

Open terminal and type the following:

>node liri <*command*> <*parameter*>

Available commands:
- concert-this
- spotify-this-song
- movie-this
- do-what-it-says
  
Parameter Options
-  Artist Name
-  Song Track Title
-  Movie Title

## Support

Type help to see available options

## Demonstrations

### Search for Concerts

![CONCERT-THIS](https://github.com/chaosZeroFive/09-nodejs/blob/master/demo/concert-this.gif)

### Search for a Song

![SPOTIFY](https://github.com/chaosZeroFive/09-nodejs/blob/master/demo/spotify-this.gif)

### Search for a Movie

![OMDB](https://github.com/chaosZeroFive/09-nodejs/blob/master/demo/movie-this.gif)

### Search from Text file

![TEXT](https://github.com/chaosZeroFive/09-nodejs/blob/master/demo/do-what-it-says.gif)
