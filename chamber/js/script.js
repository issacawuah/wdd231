document.addEventListener("DOMContentLoaded", () => {
    fetchMembers();
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("last-mod").textContent = document.lastModified;
});

async function fetchMembers() {
    const response = await fetch("data/members.json");
    const members = await response.json();
    displayMembers(members);
}

function displayMembers(members) {
    const container = document.getElementById("members-container");
    container.innerHTML = "";
    members.forEach(member => {
        const memberCard = document.createElement("div");
        memberCard.classList.add("member-card");
        memberCard.innerHTML = `
            <img src="${member.image}" alt="${member.name}" width="100">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <a href="${member.website}" target="_blank">Visit Website</a>
        `;
        container.appendChild(memberCard);
    });
}

function toggleView(viewType) {
    document.getElementById("members-container").className = viewType;
}
