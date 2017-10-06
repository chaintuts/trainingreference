/* This script queries the TrainingReference REST API via AJAX and retrieves the results
*
* Author: Josh McIntyre
*/

function Client(config) 
{

	/* Define private functions for this module */

		/* This function queries the API root for collection information
		*
		* Return: results
		*/
		queryCollections : function queryCollections()
		{
			var ajax = new XMLHttpRequest();

			ajax.onreadystatechange = function()
			{
				if (ajax.readyState == 4 && ajax.status == 200)
				{
					var rawResults = ajax.responseText;
					var results = JSON.parse(rawResults);
					markupCollections(results);
				}
			}

			ajax.open("GET", config.apiUrl, true);
		
			ajax.send();
		}

		/* This function queries the API root for key information
		*
		* Return: results
		*/
		queryKeys : function queryKeys()
		{
			var ajax = new XMLHttpRequest();

			ajax.onreadystatechange = function()
			{
				if (ajax.readyState == 4 && ajax.status == 200)
				{
					var rawResults = ajax.responseText;
					var results = JSON.parse(rawResults);
					var collectionSelection = document.getElementById("collection_select").value;

					if (collectionSelection == "")
					{
						markupKeys([]);
					}
					else
					{
						results = results[collectionSelection];
						markupKeys(results);
					}
				}
			}

			ajax.open("GET", config.apiUrl, true);
		
			ajax.send();
		}

		/* This function queries the API based on the desired collection and keys
		*
		* Return: results
		*/
		query : function query()
		{
			var ajax = new XMLHttpRequest();

			ajax.onreadystatechange = function()
			{
				if (ajax.readyState == 4 && ajax.status == 200)
				{
					var rawResults = ajax.responseText;
					var results = JSON.parse(rawResults);
					var collectionSelection = document.getElementById("collection_select").value;
					var keySelection = document.getElementById("key_select").value;
					var queryString = document.getElementById("query_textbox").value;

					if (! (keySelection == ""))
					{
						if (collectionSelection == "Programs")
							markupPrograms(results);
						else
							markupExercises(results);
					}
	
				}
			}

			var collectionSelection = document.getElementById("collection_select").value;
			var keySelection = document.getElementById("key_select").value;
			var queryString = document.getElementById("query_textbox").value;
			var url = config.apiUrl + collectionSelection.toLowerCase() + "/" + keySelection + "/" + queryString;
			ajax.open("GET", url, true);
		
			ajax.send();
		}

		/* This function retrieves suggestions */
		querySuggestions : function querySuggestions()
		{
			var ajax = new XMLHttpRequest();

			ajax.onreadystatechange = function()
			{
				if (ajax.readyState == 4 && ajax.status == 200)
				{
					var rawResults = ajax.responseText;
					var results = JSON.parse(rawResults);
					var keySelection = document.getElementById("key_select").value;

					if (! (keySelection == ""))
					{
						markupSuggestions(results);
					}
				}
			}

			var collectionSelection = document.getElementById("collection_select").value;
			var keySelection = document.getElementById("key_select").value;
			var url = config.apiUrl + collectionSelection.toLowerCase() + "/suggestions/" + keySelection;
			ajax.open("GET", url, true);

			ajax.send();
		}

		/* This function marks up the collection select on the page */
		markupCollections : function markupCollections(results)
		{
			markup = "Reference: ";
			markup += "<select id=\"collection_select\" onchange=\"client.buildKeySelect()\">";
			markup += "<option value=\"\"></option>";
			for (var collection in results)
			{
				markup += "<option value=\"" + collection + "\">";
				markup += collection + "</option>";
			}
			markup += "</select>";

			document.getElementById("collection").innerHTML = markup;
		}

		/* This function marks up the key select on the page */
		markupKeys : function markupKeys(results)
		{
			markup = "Search by: ";
			markup += "<select id=\"key_select\" onchange=\"client.buildSuggestions()\">";
			markup += "<option value=\"\"></option>";
			for (var i = 0; i < results.length; i++)
			{
				markup += "<option value=\"" + results[i] + "\">";
				markup += results[i].charAt(0).toUpperCase() + results[i].slice(1) + "</option>";
			}
			markup += "</select>";

			markup += "<input type=\"text\" id=\"query_textbox\"><br>";
			markup += "<button onclick=\"client.buildResults()\">Search</button><br><br>";

			document.getElementById("keys").innerHTML = markup;
		}

		/* This function marks up the results of a query on the Programs collection on the page */
		markupPrograms : function markupPrograms(results)
		{
			markup = "";
			for (var i = 0; i < results.length; i++)
			{
				markup += "<table>";
				
				/* Mark up program metadata */
				markup += "<tr><td>";
				markup += "Name: " + results[i]["name"] + "<br>";
				markup += "Author: " + results[i]["author"] + "<br>";
				markup += "Source: " + results[i]["source"] + "<br>";
				markup += "Customization: " + results[i]["customization"] + "<br>";
				markup += "Level: " + results[i]["level"] + "<br>";
				markup += "Days: " + results[i]["days"].join(", ")+ "<br>";
				markup += "Schedules: " + results[i]["schedules"].join(", ") + "<br>";
				markup += "</td></tr>";

				/* Mark up program data */
				var workouts = results[i]["workouts"];
				for (var c = 0; c < workouts.length; c++)
				{
					markup += "<tr><td>";
					markup += "Workout Name: " + workouts[c]["name"] + "<br>";
					markup += "Work: " + workouts[c]["work"].join(", ") + "<br>";
					markup += "Exercises: " + workouts[c]["exercises"].join(", ") + "<br>";
					markup += "</td></tr>";
				}

				markup += "</table><br>";
			}

			document.getElementById("reference_results").innerHTML = markup;
		}

		/* This function marks up the results of a query on the Exercises collection on the page */
		markupExercises : function markupExercises(results)
		{
			markup = "";
			for (var i = 0; i < results.length; i++)
			{
				markup += "<table>";
				
				/* Mark up exercise metadata */
				markup += "<tr><td>";
				markup += "Name: " + results[i]["name"] + "<br>";
				markup += "Categories: " + results[i]["categories"].join(", ")+ "<br>";
				markup += "Equipment: " + results[i]["equipment"].join(", ") + "<br>";
				markup += "</td></tr>";

				/* Mark up exercise data */
				if (results[i]["variations"] instanceof Array)
				{
					markup += "<tr><td>";
					markup += "Variations: " + results[i]["variations"].join(", ");
					markup += "</td></tr>";
				}
				else
				{
					markup += "<tr><td>";
					markup += "Variations: None";
					markup += "</td></tr>";
				}

				if (results[i]["progressions"] instanceof Array)
				{
					markup += "<tr><td>";
					markup += "Progressions: " + results[i]["progressions"].join(", ");
					markup += "</td></tr>";
				}
				else
				{
					markup += "<tr><td>";
					markup += "Progressions: None";
					markup += "</td></tr>";
				}

				markup += "</table><br>";
			}

			document.getElementById("reference_results").innerHTML = markup;
		}

		/* This function marks up a datalist for suggestions */
		markupSuggestions : function markupSuggestions(results)
		{
			markup = "<datalist id=\"suggestions\">";
			for (var i = 0; i < results.length; i++)
			{
				/* Mark up suggestions */
				markup += "<option value=\"";
				markup += results[i];
				markup += "\">";
			}
			markup += "</datalist>";

			document.getElementById("suggestions_holder").innerHTML = markup;
			document.getElementById("query_textbox").setAttribute("list", "suggestions");
		}

	/* Return a public interface to this module */
	return {

		/* This function generates the collection select */
		buildCollectionSelect : function buildCollectionSelect()
		{
			queryCollections();
		},

		/* This function generates the key select */
		buildKeySelect : function buildKeySelect()
		{
			queryKeys();
		},

		/* This function generates the key select */
		buildResults : function buildResults()
		{
			query();
		},

		/* This function generates suggestions for the query string input */
		buildSuggestions : function buildSuggestions()
		{
			querySuggestions();
		}

	};
	
};
