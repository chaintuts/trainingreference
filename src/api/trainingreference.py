#!/usr/bin/python
# This file contains code that defines a RESTful web service
# This service allows the searching of resistance training programs
#
# Author: Josh McIntyre
#

import web
import pymongo
import json
import auth

web.config.debug = True

# This block defines URL handling variables
#
#
urls = (
	"/", "trainingreference",
	"/(programs|exercises)", "all",
	"/(programs|exercises)/(.*)/(.*)", "query"
	)

# This block generates a database connection
#
#
conn_string = "mongodb://" + auth.MONGODB_USERNAME + ":" + auth.MONGODB_PASSWORD + "@localhost/TrainingDB"
connection = pymongo.MongoClient(conn_string)
db = connection.TrainingDB

# This class handles requests at the base URL of the API
#
#
class trainingreference:

	# This function handles GET requests at the base URL
	# It returns collection, url, and key information
	#
	# Return: response
	#
	#
	def GET(self):

		web.header("Content-Type", "text/html")

		program_keys = []
		results = db.Programs.find({}, { "_id" : False })
		result = results[0]
		for key in result:
			program_keys.append(key)
		
		exercise_keys = []
		results = db.Exercises.find({}, { "_id" : False })
		result = results[0]
		for key in result:
			exercise_keys.append(key)

		data = { "Programs" : program_keys,
			"Exercises" : exercise_keys
			}

		response = json.dumps(data)

		return response

# This class handles requests to see all items in a collection
#
#
class all:

	# This function handles GET requests for programs
	#
	# Argument: collection
	# Return: response
	#
	#
	def GET(self, collection):

		web.header("Content-Type", "text/html")

		results = query_database(collection.title(), None, None)
		data = []
		for result in results:
			data.append(result)
		
		response = json.dumps(data)

		return response

# This class handles requests to query the database
#
#
class query:

	# This function handles GET requests for programs
	#
	# Argument: collection
	# Argument: key
	# Argument: value
	# Return: response
	#
	#
	def GET(self, collection, key, value):

		web.header("Content-Type", "text/html")

		results = query_database(collection.title(), key, value.title())
		data = []
		for result in results:
			data.append(result)
		
		response = json.dumps(data)

		return response

# This function handles queries on the database
#
# Argument: collection
# Argument: key
# Argument: value
# Yield: result
#
#
def query_database(collection, key, value):

	if collection == "Programs":
		if key and value:
			query = { key : value }
			results = db.Programs.find(query, { "_id" : False })
		else:
			results = db.Programs.find({}, { "_id" : False })

		for result in results:
			yield result

	if collection == "Exercises":
		if key and value:
			query = { key : value }
			results = db.Exercises.find(query, { "_id" : False })
		else:
			results = db.Exercises.find({}, { "_id" : False })

		for result in results:
			yield result

# This is the main entry point for the web service
#
#
if __name__ == "__main__":

	app = web.application(urls, globals())
	app.run()
