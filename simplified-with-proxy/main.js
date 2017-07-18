'use strict';
const proxyURL = '../proxy/proxy.php';
const proxykey = 'ct1718';
const $ = query => document.querySelector(query);
const size = {w: 400, h: 300};
const video = $('video');

const emo = [
	'anger',
	'contempt',
	'disgust',
	'fear',
	'happiness',
	'neutral',
	'sadness',
	'surprise'
];
let currentEmo;

navigator.mediaDevices.getUserMedia({video: {width: size.w, height: size.h}})
.then(
	stream => video.srcObject = stream,
	err => console.error(err)
);

const pickEmo = () => {
	currentEmo = emo[Math.floor(Math.random() * emo.length)];
	capture.textContent = 'I feel ' + currentEmo + '!';
};
pickEmo();

const canvas = $('canvas');

capture.addEventListener('click', ev => {
	canvas.width = size.w;
	canvas.height = size.h;
	canvas.getContext('2d').drawImage(video, 0, 0, size.w, size.h);
	const hr = new XMLHttpRequest();
	hr.onreadystatechange = () => {
		if (hr.readyState !== 4) return;
		if (hr.status !== 200) {
			console.error(hr);
			return;
		}
		console.log(hr.responseText);
		const json = JSON.parse(hr.responseText);
		let output = '';
		if (!json.length) {
			output = 'No emotion detected';
		} else {
			console.log(json);
			const scores = json[0].scores;
			const emosSorted = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
			const toPercent = val => Math.round(val * 100) + '% ';
			output = toPercent(scores[currentEmo]) + currentEmo;
			output += (emosSorted[0] === currentEmo)?
				' Success!' :
				' Fail! ' + toPercent(scores[emosSorted[0]]) + emosSorted[0];
		}
		result.innerHTML += '<p>' + output + '</p>';
		pickEmo();
	};
	hr.open('POST', proxyURL + '?proxykey=' + proxykey + '&action=emotion');
	hr.setRequestHeader('Content-Type', 'application/octet-stream');
	fetch(canvas.toDataURL('image/png'))
	.then(res => res.blob())
	.then(blob => hr.send(blob));
});
