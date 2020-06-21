// let answer = [ 'a', 'b', 'c' ];
// let answerKey = [ 'a', 'b', 'c' ];

// function getResult(answ, answKey) {
// 	let score = 0;
// 	answ.map((x, i) => {
// 		if (x === answKey[i]) {
// 			console.log(true);
// 			score += 10;
// 		} else {
// 			console.log(false);
// 		}
// 	});
// 	console.log(score);
// }

// getResult(answer, answerKey);

function getDate() {
	const moment = require('moment');
	console.log(moment('2020-06-08T17:49:30.064Z').format('DD/MM/YYYY [at] H:mm:ss'));
}

getDate();
