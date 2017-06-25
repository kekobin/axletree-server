<%
	lists.forEach(function(list) {
%>
<li class="list-item clearfix">
	<img class="img-attack" src="<%=list.attack.logoUrl%>" alt="">
	<div class="attack clearfix">
		<h3><%=list.attack.name%></h3>
		<p><%=list.attack.pid%></p>
	</div>
	<img class="img-guard" src="<%=list.guard.logoUrl%>" alt="">
	<div class="guard clearfix">
		<h3><%=list.guard.name%></h3>
		<p><%=list.guard.pid%></p>
	</div>
</li>
<%})%>