$(document).ready(function() {
	
	console.log("Document Ready...");

	var graph;

	$("#graph1").on("click", function() {
		$("tbody.visited").empty();
		$("tbody.queue").empty();
		$(".path").empty();
		this.blur();
		graph = new Graph(0);
		graph.renderGraph();
	})

	$("#graph2").on("click", function() {
		$("tbody.visited").empty();
		$("tbody.queue").empty();
		$(".path").empty();
		this.blur();
		graph = new Graph(1);
		graph.renderGraph();
	})

	$("#start").on("click", function() {
		this.blur();
		graph.setStartNode($("select.startSelect").find(":selected").val());
		graph.setEndNode($("select.endSelect").find(":selected").val());
		graph.startBFS();
	})

})