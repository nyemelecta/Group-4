// ---------------------- PASSWORD TOGGLE ----------------------
function togglePw(id, btn) {
    const input = document.getElementById(id);
    const i = btn.querySelector('i');
    const isPw = input.type === 'password';
    input.type = isPw ? 'text' : 'password';
    i.classList.toggle('fa-eye');
    i.classList.toggle('fa-eye-slash');
}

// ---------------------- SHOW/HIDE FORMS ----------------------
function showLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('smsg').style.display = 'none';
}
function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('smsg').style.display = 'none';
}

// ---------------------- SIGNUP ----------------------
document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const password = this.password.value;
    const confirm = this.confirm.value;
    const msg = document.getElementById('smsg');

    if (password !== confirm) {
        msg.style.display = 'block';
        msg.style.color = 'red';
        msg.textContent = 'Passwords do not match.';
        return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        msg.style.display = 'block';
        msg.style.color = 'red';
        msg.textContent = 'Email already registered.';
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    msg.style.display = 'block';
    msg.style.color = 'green';
    msg.textContent = '✅ Account created! Please login.';
    this.reset();
    showLogin();
});

// ---------------------- LOGIN ----------------------
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('lpw').value;
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        document.querySelector('.auth-card').style.display = 'none';
        document.getElementById('portfolioSection').style.display = 'block';
    } else {
        alert('Invalid email or password');
    }
});

// ---------------------- PORTFOLIO GENERATION ----------------------
function generatePortfolio() {
    const name = document.getElementById('fullName').value.trim();
    const aboutMe = document.getElementById('aboutMe').value.trim();
    const experience = document.getElementById('experience').value.trim().split('\n');
    const projects = document.getElementById('projects').value.trim().split('\n');
    const links = document.getElementById('links').value.trim().split('\n');
    const contact = document.getElementById('contact').value.trim();

    if (!name) { alert('Please enter your name'); return; }

    let html = `<div class="portfolio-heading">My Portfolio</div>`;
    html += `<div class="name">${name}</div>`;

    // About Me Section
    if (aboutMe) {
        html += `<section id="about">
                    <h2>About Me</h2>
                    <p>${aboutMe}</p>
                 </section>`;
    }

    // Experience Section
    if (experience.length && experience[0] !== "") {
        html += `<section id="experience">
                    <h2>Experience</h2>
                    <ul class="experience">`;
        experience.forEach(exp => { html += `<li>${exp}</li>`; });
        html += `</ul></section>`;
    }

    // Projects Section
    if (projects.length && projects[0] !== "") {
        html += `<section id="projects">
                    <h2>Projects</h2>
                    <ul class="projects">`;
        projects.forEach(p => html += `<li>${p}</li>`);
        html += `</ul></section>`;
    }

    // Social Links
    if (links.length && links[0] !== "") {
        html += `<section id="social">
                    <h2>Social Links</h2>
                    <ul class="links">`;
        links.forEach(link => html += `<li><a href="${link}" target="_blank">${link}</a></li>`);
        html += `</ul></section>`;
    }

    // Contact Section
    if (contact) {
        html += `<section id="contact">
                    <h2>Contact</h2>
                    <p>${contact}</p>
                 </section>`;
    }

    const preview = document.getElementById('preview');
    preview.innerHTML = html;
    preview.style.display = 'block';
}

// ---------------------- DOWNLOAD PDF ----------------------
function downloadPDF() {
    const preview = document.getElementById('preview');
    if (!preview.innerHTML.trim()) { alert('Generate portfolio first!'); return; }
    html2pdf().from(preview).set({
        margin: 10,
        filename: 'MyPortfolio.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }).save();
}

// ---------------------- DOWNLOAD WORD ----------------------
function downloadWord() {
    const preview = document.getElementById('preview');
    if (!preview.innerHTML.trim()) { alert('Generate portfolio first!'); return; }
    let htmlContent = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
        'xmlns:w="urn:schemas-microsoft-com:office:word" ' +
        'xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head><meta charset="utf-8"><title>My Portfolio</title></head>' +
        '<body>' + preview.innerHTML + '</body></html>';
    let blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    saveAs(blob, 'MyPortfolio.doc');
}
