##Beltline Run
- Ben gave me his photos directly, Jill put hers into SCC and attached to budget item so she could caption them. iPhone GPS data worked great. Used Picasa to edit GPS coods visually.
- Create a photoshop batch to resize images
- createJSON.py opens folder of images and creates JSON formatted for storyMap.js using metadata GPS coords and captions. Note: conversion is required to tranform the iPhone's GPS degree system to the decimal system expected by storyMap
- storyMap.js API not well documented at all, pretty sure the docs are from a previous version and no longer relevant

##API weirdness
- setting `layout: "portrait"` doesn't actually change the layout but does add a "Hide/show map" button, that doesn't seem to do anything. Setting layout to portrait requires you to set "map_center_offset" for some reason.
- to actually move the image viewer under the map, set `map_skinny:` to at least the size of your map
- minimap isn't working for some reason
- set `calculate_zoom: false` if you want to set the zoom level yourself via JSON
- set "show_lines: false" to prevent StoryMap from automatically connecting all of your points with a line, set `show_history_line: false` to prevent drawing line from last point to current

###Dependencies
 - <a href="https://github.com/python-imaging/Pillow" target="_blank">Python Image Library (PIL) Pillow </a> for accessing photo metadata
 - <a href="http://cdn.knightlab.com/libs/storymapjs/latest/js/storymap-min.js" target="_blank">StoryMap js</a>
 