/* This script queries the TrainingReference REST API via AJAX and retrieves the results
*
* Author: Josh McIntyre
*/

function Client(config) 
{

	// Define private functions for this module */

		// This function queries the API root for collection information
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

		// This function queries the API root for key information
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

		// This function queries the API based on the desired collection and keys
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
						if (collectionSelection == "ProgramTemplates")
						{
							markupProgramTemplates(results);
						}
						else if (collectionSelection == "PremadePrograms")
						{
							markupPremadePrograms(results);
						}
						else if (collectionSelection == "FreeweightMovements")
						{
							markupFreeweightMovements(results);
						}
						else if (collectionSelection == "BodyweightMovements")
						{
							markupBodyweightMovements(results);
						}
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

		// This function retrieves suggestions
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

		// This function marks up the collection select on the page
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

		// This function marks up the key select on the page
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

		// This function marks up the results of a query on the PremadePrograms collection on the page
		markupPremadePrograms : function markupPremadePrograms(results)
		{
			markup = "";
			for (var i = 0; i < results.length; i++)
			{
				markup += "<table>";
				
				// Mark up program metadata
				markup += "<tr><td>";
				markup += "Name: " + results[i]["meta"]["name"] + "<br>";
				markup += "Author: " + results[i]["meta"]["author"] + "<br>";
				markup += "Source: " + results[i]["meta"]["source"] + "<br>";
				markup += "Level: " + results[i]["meta"]["level"] + "<br>";
				markup += "</td></tr>";

				// Mark up program data
				var info = results[i]["info"];
				
				markup += "<tr><td>";
				markup += "Overview: " + info["overview"];
				markup += "</td></tr>";

				markup += "<tr><td>";
				markup += "Scheduling: " + info["scheduling"];
				markup += "</td></tr>";

				markup += "<tr><td>";
				markup += "Progressing: " + info["progressing"];
				markup += "</td></tr>";
	
				markup += "<tr><td>";
				markup += "Workouts: <br><br>"
				for (var key in info["workouts"])
				{
					markup += key + ": <br>";
					markup += info["workouts"][key].join("<br> ");
					markup += "<br><br>";
				}
				markup += "</td></tr>";

				markup += "</table><br>";
			}

			document.getElementById("reference_results").innerHTML = markup;
		}

		// This function marks up the results of a query on the ProgramTemplates collection on the page
		markupProgramTemplates : function markupProgramTemplates(results)
		{
			markup = "";
			for (var i = 0; i < results.length; i++)
			{
				markup += "<table>";
				
				// Mark up program metadata
				markup += "<tr><td>";
				markup += "Name: " + results[i]["meta"]["name"] + "<br>";
				markup += "Level: " + results[i]["meta"]["level"] + "<br>";
				markup += "</td></tr>";

				// Mark up program template data
				var info = results[i]["info"];
				
				markup += "<tr><td>";
				markup += "Overview: " + info["overview"];
				markup += "</td></tr>";

				markup += "<tr><td>";
				markup += "Scheduling: " + info["scheduling"];
				markup += "</td></tr>";

				markup += "<tr><td>";
				markup += "Structuring: " + info["structuring"];
				markup += "</td></tr>";

				markup += "<tr><td>";
				markup += "Work: " + info["work"];
				markup += "</td></tr>";
	

				markup += "</table><br>";
			}

			document.getElementById("reference_results").innerHTML = markup;
		}

		// This function marks up the results of a query on the FreeweightMovements collection on the page
		markupFreeweightMovements : function markupFreeweightMovements(results)
		{
			markup = "";
			for (var i = 0; i < results.length; i++)
			{
				markup += "<table>";
				
				// Mark up metadata
				markup += "<tr><td>";
				markup += "Name: " + results[i]["meta"]["name"] + "<br>";
				markup += "Categories: " + results[i]["meta"]["categories"].join(", ")+ "<br>";
				markup += "</td></tr>";

				// Mark up variation data
				markup += "<tr><td>";
				markup += "Main variations: <br><br>" + results[i]["main_variations"].join("<br> ");
				markup += "</td></tr>";

				if ("other_variations" in results[i])
				{
					markup += "<tr><td>";
					markup += "Other variations: <br><br>" + results[i]["other_variations"].join("<br>");
					markup += "</td></tr>";
				}

				markup += "</table><br>";
			}

			document.getElementById("reference_results").innerHTML = markup;
		}

		// This function marks up the results of a query on the BodyweightMovements collection on the page
		markupBodyweightMovements : function markupBodyweightMovements(results)
		{
			markup = "";
			for (var i = 0; i < results.length; i++)
			{
				markup += "<table>";
				
				// Mark up metadata
				markup += "<tr><td>";
				markup += "Name: " + results[i]["meta"]["name"] + "<br>";
				markup += "Categories: " + results[i]["meta"]["categories"].join(", ")+ "<br>";
				markup += "</td></tr>";

				// Mark up progression data
				markup += "<tr><td>";
				markup += "Progressions: <br><br>" + results[i]["progressions"].join("<br>");
				markup += "</td></tr>";

				markup += "</table><br>";
			}

			document.getElementById("reference_results").innerHTML = markup;
		}

		// This function marks up a datalist for suggestions
		markupSuggestions : function markupSuggestions(results)
		{
			markup = "<datalist id=\"suggestions\">";
			for (var i = 0; i < results.length; i++)
			{
				// Mark up suggestions
				markup += "<option value=\"";
				markup += results[i];
				markup += "\">";
			}
			markup += "</datalist>";

			document.getElementById("suggestions_holder").innerHTML = markup;
			document.getElementById("query_textbox").setAttribute("list", "suggestions");
		}

	// Return a public interface to this module
	return {

		// This function generates the collection select
		buildCollectionSelect : function buildCollectionSelect()
		{
			queryCollections();
		},

		// This function generates the key select
		buildKeySelect : function buildKeySelect()
		{
			queryKeys();
		},

		// This function generates the key select
		buildResults : function buildResults()
		{
			query();
		},

		// This function generates suggestions for the query string input
		buildSuggestions : function buildSuggestions()
		{
			querySuggestions();
		}

	};
	
};
