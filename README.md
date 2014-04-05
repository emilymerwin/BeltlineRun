##Beltline Run
- Ben gave me his photos directly, Jill put hers into SCC and attached to budget item so she could caption them. iPhone GPS data worked great. Used Picasa to edit GPS coods visually.
- Create a photoshop batch to resize images
- createGeoJSON.py opens folder of images and creates GeoJSON formatted using metadata GPS coords and captions. Note: conversion is required to tranform the iPhone's GPS degree system to the decimal system
- The .GPX file generated by Ben's Garmin watch had way more points than we needed, simplified it using [mapshaper.org](http://www.mapshaper.org/) - I only ended up needing 5% of the original points. [Simplify.js](http://mourner.github.io/simplify-js/) also looks interesting and is built on Leaflet.
- I went about attempting to convert the iPhone exif timestamps in YYYY:mm:dd HH:MM:SS format into a JS readable date (so they could be sorted and displayed in order) in the wee hours of the morning on deadline so I cheated and just did a Find/Replace regex in Textmate for `"date": "2014:02:28 (..):(..):(..)",` to `"date": "2014-02-28T$1:$2:$3",`
- The Storymap branch attempted to use that library but I couldn't figure out how to access the leaflet methods from the storymap so I scrapped it

###Dependencies
 - [Python Image Library (PIL) Pillow](https://github.com/python-imaging/Pillow) for accessing photo metadata
 - [MapBox.js](https://www.mapbox.com/mapbox.js/api/v1.6.2/)
 
##ToDo
 - [X] create line with Ben's Garmin data
 - [X] Add image display
 - [X] Add Jill's points
 - [X] remove line that leads to Ben's house
 - [X] Open first popup on load
 - [X] Create navigation along the path
 - [X] make sure markers are sorted by timestamp
 - [X] Need a way to stop/pause/start tour, or change where you are in the tour
 - [X] popups aren't responsive
 - [ ] Clicking on map or popup "x" should pause tour
 - [X] clicking on the polyline creates a broken popup because it doesn't have the right properties.
 - [ ] Add layer toggle
 - [X] Needs a legend
 - [X] Different colors for different stages of beltline
 - [ ] Change marker color when active
 - [ ] Timestamps displaying in wrong timezone on mobile, but correct on desktop
 - [ ] retina versions of images?
