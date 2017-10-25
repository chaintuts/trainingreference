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
import re

web.config.debug = True

# This block defines URL handling variables
urls = (
	"/", "trainingreference",
	"/(programs|exercises)", "all",
	"/(programs|exercises)/suggestions/(.*)", "suggest",
	"/(programs|exercises)/(.*)/(.*)", "query"
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

		program_keys = []
		results = db.Programs.find({}, { "_id" : False })
		result = results[0]
		for key in result:
			program_keys.append(key)
		if "workouts" in program_keys: 	# Remove the extraneous workouts key from the programs
			program_keys.remove("workouts")
		
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
class all:

	# This function handles GET requests for programs and exercises
	def GET(self, collection):

		web.header("Content-Type", "text/html")

		results = query_database(collection.title(), None, None)
		data = []
		for result in results:
			data.append(result)
		
		response = json.dumps(data)

		return response

# This class handles requests to query the database
class suggest:

	# This function handles GET requests for programs and exercises
	def GET(self, collection, key):

		web.header("Content-Type", "text/html")

		results = query_database_distinct(collection.title(), key)
		data = []
		for result in results:
			data.append(result)
		
		response = json.dumps(data)
		
		return response

# This class handles requests for suggestions
class query:

	# This function handles GET requests for programs and exercises
	def GET(self, collection, key, value):

		web.header("Content-Type", "text/html")

		results = query_database(collection.title(), key, value.title())
		data = []
		for result in results:
			data.append(result)
		
		response = json.dumps(data)

		return response

# This function handles queries on the database
def query_database(collection, key, value, field=None):

	# Build the projection
	# We don't want the user to see the unique database ID
	projection = { "_id" : False }

	# Query the database on the specified collection
	# Iterate over the results and yield
	if collection == "Programs":
		if key and value:
			regex_string = ".*" + value + ".*";
			regex = re.compile(regex_string, re.IGNORECASE)
			query = { key : regex }
			results = db.Programs.find(query, projection)
		else:
			results = db.Programs.find({}, projection)

		for result in results:
			yield result

	if collection == "Exercises":
		if key and value:
			regex_string = ".*" + value + ".*";
			regex = re.compile(regex_string, re.IGNORECASE)
			query = { key : regex }
			results = db.Exercises.find(query, projection)
		else:
			results = db.Exercises.find({}, projection)

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
	if collection == "Programs":
		results = db.Programs.distinct(key)
		for result in results:
			yield result

	if collection == "Exercises":
		results = db.Exercises.distinct(key)
		for result in results:
			yield result

# This is the main entry point for the web service
if __name__ == "__main__":

	app = web.application(urls, globals())
	app.run()
