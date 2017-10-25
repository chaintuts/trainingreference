# This file contains a make script for the TrainingReference application
#
# Author: Josh McIntyre
#

# This block defines makefile variables
API_FILES=src/api/*
CLIENT_FILES=src/client/*
SH_FILES=src/storage/load.sh src/storage/user.sh
JSON_FILES=res/data/*.json

BUILD_DIR=bin/trainingreference
CLIENT_DIR=bin/trainingreference_client
DATA_DIR=bin/data
DATA_SCRIPT=database.sh

# This rule builds the application
build: $(API_FILES) $(CLIENT_FILES)
	mkdir -p $(BUILD_DIR)
	mkdir -p $(CLIENT_DIR)
	cp $(API_FILES) $(BUILD_DIR)
	cp $(CLIENT_FILES) $(CLIENT_DIR)

# This rule loads the database
load: $(SH_FILES) $(JSON_FILES)
	mkdir -p $(DATA_DIR)
	cat $(SH_FILES) > $(DATA_DIR)/$(DATA_SCRIPT)
	chmod +x $(DATA_DIR)/$(DATA_SCRIPT)
	cp $(JSON_FILES) $(DATA_DIR)
	cd $(DATA_DIR); \
		./$(DATA_SCRIPT)

# This rule cleans the build and data directories
clean: $(BUILD_DIR) $(DATA_DIR)
	rm $(BUILD_DIR)/* $(CLIENT_DIR)/* $(DATA_DIR)/*
	rmdir $(BUILD_DIR) $(CLIENT_DIR) $(DATA_DIR) 
