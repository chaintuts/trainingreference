#!/bin/bash
# This file loads JSON data into the MongoDB database
#
# Author: Josh McIntyre
#

# This block drops the old database
# The data will not change much so removing the old database allows for an easy batch update
mongo --eval "db.getSiblingDB(\"TrainingDB\").dropDatabase()"

# This block loads the data from .json files
mongoimport --db TrainingDB --collection FreeweightMovements --type json --file freeweight_movements.json --jsonArray
mongoimport --db TrainingDB --collection BodyweightMovements --type json --file bodyweight_movements.json --jsonArray
mongoimport --db TrainingDB --collection PremadePrograms --type json --file premade_programs.json --jsonArray 
mongoimport --db TrainingDB --collection ProgramTemplates --type json --file program_templates.json --jsonArray 

