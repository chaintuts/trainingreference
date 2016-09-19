#!/bin/bash
# This file loads JSON data into the MongoDB database
#
# Author: Josh McIntyre
#
#

# This block drops the old database
# The data will not change much so removing the old database allows for an easy batch update
#
#
mongo --eval "db.getSiblingDB(\"TrainingDB\").dropDatabase()"

# This block loads the data from .json files
#
#
mongoimport --db TrainingDB --collection Exercises --type json --file exercises.json --jsonArray
mongoimport --db TrainingDB --collection Programs --type json --file programs.json --jsonArray 

