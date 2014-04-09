#! /usr/bin/env python
#this script will open all of the files in a directory, assume they are images, extract metadata and generate a .geoJSON file

import os.path #for traversing system directories
import json
import decimal #for GPS conversion
from PIL import Image #for reading image EXIF data, using this fork https://github.com/python-imaging/Pillow
from PIL.ExifTags import TAGS
import operator

#where to find the images
directory = '../img/resized/'

#set up the geoJSON object
geoJ = {
	"type": "FeatureCollection",
	"features": []
}

#return value of requested key
def get_field (exif,field):
	for (k,v) in exif.iteritems():
		if TAGS.get(k) == field:
			return v

#search directory for files, exclude hidden files
files = [os.path.join(directory, f) for f in os.listdir(directory) if not f.startswith('.')
	#Get only files, not directories, join the string
	if os.path.isfile(os.path.join(directory, f))]

	#print keys, so you can see what's available and value formats
	# for (key ,val) in Image.open(files[0])._getexif().iteritems():
	# 	print '%s = %s' % (TAGS.get(key), val)

for f in files:
	exif = Image.open(f)._getexif()
	GPS = get_field(exif, 'GPSInfo')
	#convert to decimal format
	lat = float(decimal.Decimal(GPS[2][0][0]/GPS[2][0][1]) + decimal.Decimal(GPS[2][1][0]/GPS[2][1][1])/60 + decimal.Decimal(GPS[2][2][0]/GPS[2][2][1])/3600)
	#convert to decimal format, make negative for Western lons (all of ours)
	lon = -1*float(decimal.Decimal(GPS[4][0][0]/GPS[4][0][1]) + decimal.Decimal(GPS[4][1][0]/GPS[4][1][1])/60 + decimal.Decimal(GPS[4][2][0]/GPS[4][2][1])/3600)
	#store the image properties we want for the JSON
	geoJ["features"].append({"type": "Feature", "geometry": {"type": "Point", "coordinates": [lon, lat]}, "properties": {"marker-symbol": "camera", "marker-size": "small", "marker-color": "#367498", "date": get_field(exif, "DateTimeOriginal"), "caption": get_field(exif, "ImageDescription"), "width": str(get_field(exif, "ExifImageWidth"))+"px", "height": str(get_field(exif, "ExifImageHeight"))+"px", "image": f.strip("../") }})

#turn tree object into JSON and pretty print it
out = json.dumps(geoJ, indent=4, separators=(',', ': '))
print "JSON parsed!"

# Save the JSON
f = open( '../data/map.geojson', 'w')
f.write(out)
print "JSON saved!"