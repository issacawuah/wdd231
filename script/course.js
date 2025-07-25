 const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: false
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: false
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: false
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
];

function renderCourses(courseList, filter = 'all') {
    const coursesList = document.getElementById('courses-list');
    const courseCountMsg = document.getElementById('course-count-message');
    coursesList.innerHTML = '';
    courseCountMsg.textContent = `The total number of course listed below is ${courseList.length}`;
    courseList.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card' + (course.completed ? ' completed' : '');
        card.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>
            <div>${course.title}</div>
        `;
        coursesList.appendChild(card);
    });
    // Update total credits
    const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('total-credits').textContent = `Total Credits: ${totalCredits}`;
    // Update filter button active state
    document.getElementById('show-all').classList.toggle('active', filter === 'all');
    document.getElementById('show-wdd').classList.toggle('active', filter === 'wdd');
    document.getElementById('show-cse').classList.toggle('active', filter === 'cse');
}

document.addEventListener('DOMContentLoaded', function() {
    // Add course count message element if not present
    if (!document.getElementById('course-count-message')) {
        const msg = document.createElement('div');
        msg.id = 'course-count-message';
        const certSection = document.getElementById('certificate-section');
        certSection.insertBefore(msg, document.getElementById('courses-list'));
    }
    renderCourses(courses, 'all');
    document.getElementById('show-all').addEventListener('click', () => renderCourses(courses, 'all'));
    document.getElementById('show-wdd').addEventListener('click', () => renderCourses(courses.filter(c => c.subject === 'WDD'), 'wdd'));
    document.getElementById('show-cse').addEventListener('click', () => renderCourses(courses.filter(c => c.subject === 'CSE'), 'cse'));
}); 