
let courses = [
    { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: false },
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: false },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: false },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: false },
    { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: false },
    { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2, completed: false }
];

function updateCourses() {
    const container = document.getElementById('courseList');
    container.innerHTML = '';
    let totalCredits = 0;
    courses.forEach(course => {
        totalCredits += course.credits;
        const div = document.createElement('div');
        div.className = 'course' + (course.completed ? ' completed' : '');
        div.innerHTML = `<strong>${course.title}</strong><br>Credits: ${course.credits}`;
        container.appendChild(div);
    });
    document.getElementById('totalCredits').textContent = totalCredits;
}

function filterCourses(subject) {
    if (subject === 'all') {
        updateCourses();
    } else {
        const filteredCourses = courses.filter(course => course.subject === subject);
        document.getElementById('courseList').innerHTML = '';
        let totalCredits = 0;
        filteredCourses.forEach(course => {
            totalCredits += course.credits;
            const div = document.createElement('div');
            div.className = 'course' + (course.completed ? ' completed' : '');
            div.innerHTML = `<strong>${course.title}</strong><br>Credits: ${course.credits}`;
            document.getElementById('courseList').appendChild(div);
        });
        document.getElementById('totalCredits').textContent = totalCredits;
    }
}

updateCourses();
