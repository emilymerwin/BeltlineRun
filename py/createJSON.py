#! /usr/bin/env python
#this script will open all of the files in a directory, assume they are images, and extract metadata for storymap.js

import os.path
import json
import decimal
#https://github.com/python-imaging/Pillow
from PIL import Image
from PIL.ExifTags import TAGS
import operator

directory = '../img/resized/' #where to find the images

#create slides array and add the overview slide
slides = [{
	"type": "overview",
	"date": "2014:02:28 07:00:00",
	"text": {
		"headline": "Big headline <small>And a subhead if you want</small>",
		"text": "<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nulla vitae elit libero, a pharetra augue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p> <span class='vco-note'>This is an overview or title slide to show all the points in your story routed on your map.</span>"
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
	lat = float(decimal.Decimal(GPS[2][0][0]/GPS[2][0][1]) + decimal.Decimal(GPS[2][1][0]/GPS[2][1][1])/60 + decimal.Decimal(GPS[2][2][0]/GPS[2][2][1])/3600) #convert to decimal format
	lon = -1*float(decimal.Decimal(GPS[4][0][0]/GPS[4][0][1]) + decimal.Decimal(GPS[4][1][0]/GPS[4][1][1])/60 + decimal.Decimal(GPS[4][2][0]/GPS[4][2][1])/3600) #convert to decimal format, make negative for Western lons (all of ours)

	#store the image properties we want for the JSON
	slides.append({"media": {"url": f.strip("../"), "credit": "Ben Gray/AJC", "caption": get_field(exif, 'ImageDescription')}, "date": get_field(exif, "DateTimeOriginal"), "location": {"lat": lat, "lon": lon, "zoom": 15}, "text": {"headline": "Headline (optional)", "text": "This is where you would put a caption. Timestamp: "+get_field(exif, 'DateTimeOriginal')}})

#put the images in chronological order
slides.sort(key=operator.itemgetter("date"))

#create an object with the properties we need
tree = { "storymap": { "language": "en", "slides": slides } } #supposedly you can also use , "height": 500, "width": 400, "layout": "portrait", you would specify those outside the storymap object, I think

#turn tree object into JSON and pretty print it
out = json.dumps(tree, indent=4, separators=(',', ': '))
print "JSON parsed!"

# Save the JSON
f = open( '../data/map.json', 'w')
f.write(out)
print "JSON saved!"