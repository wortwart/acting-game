'use strict';
const proxyURL = '../proxy/proxy.php';
const proxykey = 'ct1718';
const $ = query => document.querySelector(query);
const videoSize = {w: 400, h: 300};
const emotions = [
	'anger',
	'contempt',
	'disgust',
	'fear',
	'happiness',
	'neutral',
	'sadness',
	'surprise'
];

const video = $('video');
const canvas = $('canvas');
const results = [];
let currentEmotion;

captureBtn.addEventListener('click', ev => {
	console.info('Taking photo, detecting emotion ...');
	canvas.width = videoSize.w;
	canvas.height = videoSize.h;
	canvas.getContext('2d').drawImage(video, 0, 0, videoSize.w, videoSize.h);
	const hr = new XMLHttpRequest();
	hr.onreadystatechange = () => {
		if (hr.readyState !== 4) return;
		if (hr.status !== 200) {
			console.error(hr);
			return;
		}
		const result = JSON.parse(hr.responseText);
		let output = '';
		resultEl.style.display = 'block';
		resultEl.innerHTML = '<h2>Do you feel ' + currentEmotion + '?</h2>';
		if (!result.length) {
			output = 'Yikes! Seems you don\'t have any emotion at all.';
		} else {
			const emotionResult = result[0].scores;
			const emotionsSorted = Object.keys(emotionResult).sort((a, b) => emotionResult[b] - emotionResult[a]);
			emotionsSorted.forEach(key => console.log(key + ': ' + emotionResult[key]));
			const toPercent = val => Math.round(val * 100) + '% ';
			output = (emotionsSorted[0] === currentEmotion)?
				'Whoa, you made it! You showed ' + toPercent(emotionResult[currentEmotion]) + currentEmotion + '!' :
				'Well, no. Your ' + currentEmotion + ' is only ' + toPercent(emotionResult[currentEmotion]) + '(rank ' + (emotionsSorted.indexOf(currentEmotion) + 1) + ' of ' + emotions.length + ') while your face actually displayed ' + toPercent(emotionResult[emotionsSorted[0]]) + emotionsSorted[0] + '!';
			results.push([currentEmotion, emotionsSorted.indexOf(currentEmotion) + 1]);
		}
		resultEl.innerHTML += '<p>' + output + '</p><ul>';
		results.forEach(el => {
			resultEl.innerHTML += '<li>' + el[0] + ': ' + el[1] + '</li>';
		});
		resultEl.innerHTML += '</ul>';
		pickEmotion();
	};
	hr.open('POST', proxyURL + '?proxykey=' + proxykey + '&action=emotion');
	hr.setRequestHeader('Content-Type', 'application/octet-stream');
	fetch(canvas.toDataURL('image/png'))
	.then(res => res.blob())
	.then(blob => hr.send(blob));
});

changeEmotionBtn.addEventListener('click', ev => pickEmotion());

const pickEmotion = () => {
	currentEmotion = emotions[Math.floor(Math.random() * emotions.length)];
	$('h3').innerText = 'Show ' + currentEmotion + ' on your face!';
	captureBtn.textContent = 'I feel ' + currentEmotion + '!';
};

pickEmotion();
console.info('Starting webcam ...');
navigator.mediaDevices.getUserMedia({video: {width: videoSize.w, height: videoSize.h}})
.then(stream => {
	video.srcObject = stream;
}, err => console.error(err));
