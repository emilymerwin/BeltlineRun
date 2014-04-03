#! /usr/bin/env python
#this script will open all of the files in a directory, assume they are images, and extract metadata for storymap.js

import os.path
import json
import decimal
#https://github.com/python-imaging/Pillow
from PIL import Image
from PIL.ExifTags import TAGS
import operator

directory = '../img/jill/starred/' #where to find the images

#create slides array and add Ben's run line
geoJ = {
	"type": "FeatureCollection",
	"features": []
}

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
	geoJ["features"].append({"type": "Feature", "geometry": {"type": "Point", "coordinates": [lon, lat]}, "properties": {"date": get_field(exif, "DateTimeOriginal"), "marker-symbol": "star", "marker-size": "small", "marker-color": "#FC7234", "text": get_field(exif, "ImageDescription"),"width": str(get_field(exif, "ExifImageWidth"))+"px", "height": str(get_field(exif, "ExifImageHeight"))+"px", "image": f.strip("../") }})

#dates.sort()
# for i, feature in geoJ["features"]:
# 	print i
#geoJ["features"].sort(key=operator.itemgetter("date"))
#turn tree object into JSON and pretty print it
out = json.dumps(geoJ, indent=4, separators=(',', ': '))
print "JSON parsed!"

# Save the JSON
f = open( '../data/jill.geojson', 'w')
f.write(out)
print "JSON saved!"