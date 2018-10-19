#!/usr/bin/python
# This file contains code that defines a RESTful web service
# This service allows the searching of resistance training information
# Collections include premade training programs, program templates (for designing one's own program), 
# freeweight movement patterns, and bodyweight movement patterns
#
# Author: Josh McIntyre
#
import web
import pymongo
import json
import auth
import re

# Define important constants
web.config.debug = True

# This block defines URL handling variables
urls = (
	"/", "trainingreference",
	"/(premadeprograms|programtemplates|freeweightmovements|bodyweightmovements)", "all",
	"/(premadeprograms|programtemplates|freeweightmovements|bodyweightmovements)/suggestions/(.*)", "suggest",
	"/(premadeprograms|programtemplates|freeweightmovements|bodyweightmovements)/(.*)/(.*)", "query"
	)

# This block generates a database connection
conn_string = "mongodb://" + auth.MONGODB_USERNAME + ":" + auth.MONGODB_PASSWORD + "@localhost/TrainingDB"
connection = pymongo.MongoClient(conn_string)
db = connection.TrainingDB

# This class handles requests at the base URL of the API
class trainingreference:

	# This function handles GET requests at the base URL
	# It returns collection, url, and key information
	def GET(self):

		web.header("Content-Type", "text/html")

		premade_program_keys = []
		results = db.PremadePrograms.find({}, { "_id" : False })
		result = results[0]
		for key in result["meta"]:
			premade_program_keys.append(key)
		
		program_template_keys = []
		results = db.ProgramTemplates.find({}, { "_id" : False })
		result = results[0]
		for key in result["meta"]:
			program_template_keys.append(key)

		freeweight_movement_keys = []
		results = db.FreeweightMovements.find({}, { "_id" : False })
		result = results[0]
		for key in result["meta"]:
			freeweight_movement_keys.append(key)

		bodyweight_movement_keys = []
		results = db.BodyweightMovements.find({}, { "_id" : False })
		result = results[0]
		for key in result["meta"]:
			bodyweight_movement_keys.append(key)

		data = { "PremadePrograms" : premade_program_keys,
			 "ProgramTemplates" : program_template_keys,
			 "FreeweightMovements" : freeweight_movement_keys,
			 "BodyweightMovements" : bodyweight_movement_keys
			}

		response = json.dumps(data, indent=4)

		return response

# This class handles requests to see all items in a collection
class all:

	# This function handles GET requests for programs and movements
	def GET(self, collection):

		web.header("Content-Type", "text/html")

		results = query_database(collection, None, None)
		data = []
		for result in results:
			data.append(result)
		
		response = json.dumps(data, indent=4)

		return response

# This class handles requests to query the database
class suggest:

	# This function handles GET requests for programs and movements
	def GET(self, collection, key):

		web.header("Content-Type", "text/html")

		results = query_database_distinct(collection, key)
		data = []
		for result in results:
			data.append(result)
		
		response = json.dumps(data, indent=4)
		
		return response

# This class handles requests for suggestions
class query:

	# This function handles GET requests for programs and movements
	def GET(self, collection, key, value):

		web.header("Content-Type", "text/html")

		results = query_database(collection, key, value.title())
		data = []
		for result in results:
			data.append(result)
		
		response = json.dumps(data, indent=4)

		return response

# This is a helper function that returns the database collection object
# used to actually query the collection
def get_db_collection(collection):

	if collection == "premadeprograms":
		db_collection = db.PremadeProgram
	if collection == "programtemplates":
		db_collection = db.ProgramTemplates
	if collection == "freeweightmovements":
		db_collection = db.FreeweightMovements
	if collection == "bodyweightmovements":
		db_collection = db.BodyweightMovements

	return db_collection

# This function handles queries on the database
def query_database(collection, key, value, field=None):

	# Build the projection
	# We don't want the user to see the unique database ID
	projection = { "_id" : False }

	# Query the database on the specified collection
	# Iterate over the results and yield
	db_collection = get_db_collection(collection)

	if key and value:
		regex_string = ".*" + value + ".*";
		regex = re.compile(regex_string, re.IGNORECASE)
		query = { "meta.%s" % key : regex }
		results = db_collection.find(query, projection)
	else:
		results = db_collection.find({}, projection)

	for result in results:
		yield result

# This function handles queries for distinct values on the database
def query_database_distinct(collection, key):

	# Build the projection
	# We don't want the user to see the unique database ID
	projection = { "_id" : False }

	# Query the database on the specified collection
	# Use distinct to retrieve an array of distinct values for that key
	# Iterate over the results and yield
	db_collection = get_db_collection(collection)

	results = db_collection.distinct("meta.%s" % key)
	for result in results:
		yield result


# This is the main entry point for the web service
if __name__ == "__main__":

	app = web.application(urls, globals())
	app.run()
