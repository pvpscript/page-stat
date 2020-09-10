function option(value, text) { // (html builder) used by helpers.
	const opt = document.createElement("option");

	opt.value = value;
	opt.appendChild(document.createTextNode(text));

	return opt;
}

function imgNode(classList, src) {
	const img = document.createElement("img");

	img.src = src;
	classList.forEach((c) => img.classList.add(c));

	return img;
}

function anchor(link, text, evt) { // (html builder) used by the populator
	const a = document.createElement("a");
	
	if (evt) {
		a.addEventListener("click", evt);
		a.name = link;
		a.href = "#";
	} else {
		a.target = "_blank";
		a.href = "http://" + link;
	}

	a.appendChild(document.createTextNode(text));

	return a;
}

function spanNode(classList, text) {
	const span = document.createElement("span");

	classList.forEach((c) => span.classList.add(c));
	span.textContent = text;

	return span;
}

function divNode(classList, nodeList, name, evt) {
	const div = document.createElement("div");

	if (name) {
		div.setAttribute("name", name);
	}
	if (evt) {
		div.addEventListener("click", evt);
	}

	classList.forEach((c) => div.classList.add(c));
	nodeList.forEach((n) => div.appendChild(n));

	return div;
}

function progressBar(perc, text) { // (html builder) used by the populator
	const bar = document.createElement("div");
	const valNode = document.createElement("span");
	const textNode = document.createElement("span");

	bar.classList.value = "progress";

	valNode.classList.value = "value";
	valNode.style.width = perc + "%";

	textNode.classList.value = "text";
	textNode.appendChild(document.createTextNode(text));

	bar.appendChild(valNode);
	bar.appendChild(textNode);

	return bar;
}

function svgReference(refId, elementId, evt) { // (html builder) used by the populator
	const button = document.createElement("button");
	button.id = elementId;
	button.addEventListener("click", evt);

	const svg = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"svg"
	);
	svg.setAttributeNS(
		"http://www.w3.org/2000/xmlns/",
		"xmlns:xlink",
		"http://www.w3.org/1999/xlink"
	);
	svg.classList.add("svg-trash");
	svg.id = elementId;

	const use = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"use"
	);
	use.setAttributeNS(
		"http://www.w3.org/1999/xlink",
		"xlink:href",
		"#" + refId
	);

	svg.appendChild(use);
	button.appendChild(svg);

	return button;
}

export { 
	option,
	anchor,
	imgNode,
	spanNode,
	divNode,
	progressBar,
	svgReference
};
