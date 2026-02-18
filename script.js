const ctx = canvas.getContext('2d');
ctx.font = '18px xkcd-script';
ctx.textBaseline ='top';

document.querySelectorAll('input').forEach(input => {
	input.addEventListener('input', draw);
})

buttonSave.addEventListener('click', function saveImage() {
	let data = canvas.toDataURL('image/png');
	let dummyLink = document.createElement('a');
	dummyLink.href = data;
	dummyLink.download = 'comic.png';
	dummyLink.click();
	dummyLink.remove();
})

buttonCopy.addEventListener('click', async function copyImage() {
	const data = canvas.toBlob(async (blob) => {
		await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
	});
	window.alert('Copied the comic to your clipboard!');
})

function draw() {
	let topic = inputTopic.value || 'Silicate Chemistry';
	let plural_topic = inputPluralTopic.checked;
	let experts = inputExperts.value || 'Geochemists';
	let example = inputExample.value || 'The formulas for olivine and one or two feldspars';
	let response = inputResponse.value || 'Quartz';
	
	let topic_verb = plural_topic ? 'are' : 'is'; 

	let text1 = `${topic} ${topic_verb} second nature to us ${experts}, so it's easy to forget that the average person probably only knows ${example}.`
	let text2 = `And ${response}, of course.`
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = '#FFF';
	ctx.fillRect(26, 21, 241, 114);
	ctx.fillRect(88, 150, 181, 16);
	
	ctx.fillStyle = '#000';
	ctx.textAlign = 'left';
	textWrap(text1.toUpperCase(), 10, 10, 280, 130)
	ctx.font = '18px xkcd-script';
	ctx.textAlign = 'right';
	ctx.fillText(text2.toUpperCase(), 285, 150, 220)
}

function textWrap(text, x, y, width, height) {
	let words = text.split(/\s+/);
	let currentLine = '';
	let wrappedText = [];
	let fontSize = 18;
	for(let i = 0; i < words.length; i++) {
		let testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
		if (ctx.measureText(testLine).width > width && currentLine) {
			wrappedText.push(currentLine);
			currentLine = words[i];
		} else {
			currentLine = testLine
		}
	}
	if (currentLine) wrappedText.push(currentLine);
	
	if (wrappedText.length * fontSize > height) {
		fontSize = height / wrappedText.length;
		ctx.font = `${fontSize}px xkcd-script`;
	}
	
	let blockHeight = fontSize * wrappedText.length
	if (blockHeight < height) {
		y = 10 + height - blockHeight;
	}
	
	for (let i = 0; i < wrappedText.length; i++) {
		ctx.fillText(wrappedText[i], x, y + fontSize * i)
	}
}

function init() {
	img = new Image();
	img.crossOrigin = 'anonymous';
	img.src = 'assets/comic.png';
	img.onload = () => {draw(); document.querySelector('fieldset').removeAttribute('hidden')}
	
	let params = new URLSearchParams(document.location.search);
	inputTopic.value = params.get('topic');
	inputPluralTopic.checked = params.get('plural_topic');
	inputExperts.value = params.get('experts');
	inputExample.value = params.get('example');
	inputResponse.value = params.get('response');
}

init();
