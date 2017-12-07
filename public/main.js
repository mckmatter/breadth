/*
main.js

This contains the button listeners and functions
referenced by JQuery and index.html

Dylan McKenna
Fawaz Albetar
ENGR4450-A
Fall 2017
*/

$(document).ready(function() {
	
	console.log("Document Ready...");

	var graph = null;

	//Graph 1 Button Listener
	$("#graph1").on("click", function() {
		$("tbody.visited").empty();
		$("tbody.queue").empty();
		$(".path").empty();
		this.blur();
		graph = new Graph();

		//AJAX Request for Graph 1
		$.ajax({
			'type': 'GET',
			'contentType': 'application/json',
			'url': '/graph/0',
			statusCode: {
				200: function(data) {
					console.log("STATUS 200: Recieved Graph 1 From Server");
					graph.renderGraph(data);
				}
			}
		})//End ajax
	})//End Graph 1 Button Listener

	//Graph 2 Button Listener
	$("#graph2").on("click", function() {
		$("tbody.visited").empty();
		$("tbody.queue").empty();
		$(".path").empty();
		this.blur();
		graph = new Graph();

		$.ajax({
			'type': 'GET',
			'contentType': 'application/json',
			'url': '/graph/1',
			statusCode: {
				200: function(data) {
					console.log("STATUS 200: Recieved Graph 2 From Server");
					graph.renderGraph(data);
				}
			}
		})//End ajax
	})//End Graph 2 Button Listener

	//Start Button Listener
	$("#start").on("click", function() {
		this.blur();

		if(graph==null){
			$(".path").empty();
			$(".path").append("<p class=\"warn\">Select a Graph!</p>");
		}
		else if(graph.found){
			$(".path").empty();
			$(".path").append("<p class=\"warn\">Select a Graph to Reset!</p>");
		}
		else {
			graph.setStartNode($("select.startSelect").find(":selected").val());
			graph.setEndNode($("select.endSelect").find(":selected").val());
			graph.startBFS();
		}
	})//End Start Button Listener

})