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

// function getDate() {
// 	const moment = require('moment');
// 	console.log(moment('2020-06-08T17:49:30.064Z').format('DD/MM/YYYY [at] H:mm:ss'));
// }

// getDate();

function findGreatestFactor(numberList) {}

// const numberList1 = [ 1, 3, 4 ];
// const numberList2 = [ 1, 1, 3 ];

// let result = [];

// // numberList1.map((x, i) => {
// // 	let index = 0;
// // 	let numberFrom = numberList1[index];
// // 	if (index > numberList1.length) {
// // 		return console.log(result.length);
// // 	}

// // 	let sum = numberFrom + numberList1[i + 1];
// // 	result.push(sum);
// // 	index++;
// // });

// for (var i = 1; i <= 4; i++) {
// 	console.log('*');
// }

var moment = require('moment-timezone');
var dx = moment('Aug 08 2020 00:00:00 GMT').tz('Asia/Jakarta').toDate();
var start = moment(dx).startOf('day').toDate();
console.log(start);
