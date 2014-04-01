##Beltline Run
- Ben gave me his photos directly, Jill put hers into SCC and attached to budget item so she could caption them. iPhone GPS data worked great. Used Picasa to edit GPS coods visually.
- createJSON.py opens folder of images and creates JSON formatted for storyMap.js using metadata GPS coords and captions. Note: conversion is required to tranform the iPhone's GPS degree system to the decimal system expected by storyMap
- storyMap.js API not well documented at all, pretty sure the docs are from a previous version and no longer relevant


###Dependencies
 - <a href="https://github.com/python-imaging/Pillow" target="_blank">Python Image Library (PIL) Pillow </a> for accessing photo metadata
 - <a href="http://cdn.knightlab.com/libs/storymapjs/latest/js/storymap-min.js" target="_blank">StoryMap js</a>
 