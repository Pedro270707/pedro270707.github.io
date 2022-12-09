document.addEventListener("DOMContentLoaded", function(e) {
	
const dataTable = document.getElementById("orbit-data-table");
const totalVotes = document.getElementById("total");
var cooperativeVotes = ["acee", "pr_ib"];
var competitiveVotes = ["NewJumper", "neat"];

if (cooperativeVotes.length >= competitiveVotes.length) {
	for (i = 0; i < cooperativeVotes.length; i++) {
		var row = document.createElement("tr").classList.add("votes");
		var largestChild = document.createElement("td");
		largestChild.innerHTML = cooperativeVotes[i];
		row.appendChild(largestChild);
		totalVotes.parentNode.insertBefore(row, totalVotes);
	}
}

});