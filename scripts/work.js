document.addEventListener('DOMContentLoaded', function () {
    let courses = [
        { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true, 
          description: "This course introduces programming concepts including variables, loops, and functions." },
        { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: false, 
          description: "This course covers the basics of web development, including HTML and CSS." },
        { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true, 
          description: "Students learn to write and use functions to create efficient programs." },
        { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: false, 
          description: "Introduction to object-oriented programming with classes and inheritance." },
        { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: true, 
          description: "Covers JavaScript and how to create interactive and dynamic web pages." },
        { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2, completed: false, 
          description: "Focuses on user experience, performance optimization, and basic API usage." }
    ];

    function displayCompletedCourses() {
        const courseWorkList = document.getElementById('courseWorkList');
        if (!courseWorkList) return; // Ensure the element exists

        courseWorkList.innerHTML = ''; // Clear previous content

        const completedCourses = courses.filter(course => course.completed);

        if (completedCourses.length === 0) {
            courseWorkList.innerHTML = "<p>No completed courses yet.</p>";
        } else {
            completedCourses.forEach(course => {
                const div = document.createElement('div');
                div.classList.add('course-card'); // Apply styling

                div.innerHTML = `
                    <h3>${course.title} (${course.subject} ${course.number})</h3>
                    <p><strong>Credits:</strong> ${course.credits}</p>
                    <p><strong>Description:</strong> ${course.description}</p>
                `;

                courseWorkList.appendChild(div);
            });
        }
    }

    // Run the function when the page loads
    displayCompletedCourses();
});
