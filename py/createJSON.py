#! /usr/bin/env python
#this script will open all of the files in a directory, assume they are images, and extract metadata for storymap.js

import os.path
import json
#https://github.com/python-imaging/Pillow
from PIL import Image
from PIL.ExifTags import TAGS
import operator

directory = '../img/' #where to find the images

#create slides array and add the overview slide
slides = [{
	"type": "overview",
	"date": "2014:02:28 07:00:00",
	"text": {
		"headline": "Big headline <small>And a subhead if you want</small>",
		"text": "<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nulla vitae elit libero, a pharetra augue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p> <span class='vco-note'>This is an overview or title slide to show all the points in your story routed on your map.</span>"
	},
	"media": {
		"url": "http://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/US_Mean_Center_of_Population_1790-2010.PNG/800px-US_Mean_Center_of_Population_1790-2010.PNG",
		"credit": "Ben Gray/AJC",
		"caption": "Caption Nullam id dolor id nibh ultricies vehicula ut id elit."
	}
}]

def get_field (exif,field) :
  for (k,v) in exif.iteritems():
     if TAGS.get(k) == field:
        return v

files = [os.path.join(directory, f) for f in os.listdir(directory) if not f.startswith('.') #search directory for files, exclude hidden files
     if os.path.isfile(os.path.join(directory, f))] #Get only files, not directories, join the string

for f in files:
	#parse keys
	# for (key ,val) in Image.open(f)._getexif().iteritems():
	# 	print '%s = %s' % (TAGS.get(key), val)

	exif = Image.open(f)._getexif()
	GPS = get_field(exif, 'GPSInfo')
	lat = float(str(GPS[2][0][0])+"."+str(GPS[2][1][0])+str(GPS[2][2][0]))
	lon = float("-"+str(GPS[4][0][0])+"."+str(GPS[4][1][0])+str(GPS[4][2][0]))

	#store the image properties we want for the JSON
	slides.append({"media": {"url": f.strip("../"), "credit": "Ben Gray/AJC", "caption": get_field(exif, 'ImageDescription')}, "date": get_field(exif, "DateTimeOriginal"), "location": {"lat": lat, "lon": lon}, "text": {"text": get_field(exif, 'DateTimeOriginal')}})

#put the images in chronological order
slides.sort(key=operator.itemgetter("date"))

#create an object with the properties we need
tree = { "storymap": { "language": "en", "slides": slides } }

#turn tree object into JSON and pretty print it
out = json.dumps(tree, indent=4, separators=(',', ': '))
print "JSON parsed!"

# Save the JSON
f = open( '../data/map.json', 'w')
f.write(out)
print "JSON saved!"