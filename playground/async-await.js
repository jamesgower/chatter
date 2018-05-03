const users = [
	{
		id: 1,
		name: 'James',
		schoolId: 123,
	},
	{
		id: 2,
		name: 'John',
		schoolId: 321,
	},
];
const grades = [
	{
		id: 1,
		schoolId: 123,
		grade: 86,
	},
	{
		id: 2,
		schoolId: 321,
		grade: 100,
	},
	{
		id: 3,
		schoolId: 123,
		grade: 80,
	},
];

const getUser = id => {
	return new Promise((resolve, reject) => {
		const user = users.find(user => user.id === id);

		if (user) {
			resolve(user);
		} else {
			reject(`Unable to find user with id of ${id}`);
		}
	});
};

const getGrades = schoolId => {
	return new Promise((resolve, reject) => {
		resolve(grades.filter(grade => grade.schoolId === schoolId));
	});
};

const getStatus = userId => {
	let user;
	return getUser(userId)
		.then(tempUser => {
			user = tempUser;
			return getGrades(user.schoolId);
		})
		.then(grades => {
			let average = 0;
			if (grades.length > 0) {
				average = grades.map(grade => grade.grade).reduce((a, b) => a + b) / grades.length;
			}
			return `${user.name} has a ${average}% in the class.`;
		});
};

const getStatusAlt = async userId => {
	const user = await getUser(userId);
	const grades = await getGrades(user.schoolId);
	let average = 0;
	if (grades.length > 0) {
		average = grades.map(grade => grade.grade).reduce((a, b) => a + b) / grades.length;
	}
	return `${user.name} has a ${average}% in the class.`;
	// throw new Error('This is an error'); //like reject('This is an error);
	// return 'Mike' //like resolve('Mike')
};

// getUser(21)
// 	.then(user => {
// 		console.log(user);
// 	})
// 	.catch(e => console.log(e));

// getGrades(123).then((grades) => {
// 	console.log(grades);
// }).catch(e => console.log(e));

getStatusAlt(1)
	.then(status => console.log(status))
	.catch(e => console.log(e));
