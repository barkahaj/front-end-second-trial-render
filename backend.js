const backendURL = 'https://backend-trial-render.onrender.com';

function loadPosts() {
  const container = document.getElementById('posts');
  if (!container) return; // Only run if on index.html
  fetch(`${backendURL}/posts`)
    .then(res => res.json())
    .then(posts => {
      container.innerHTML = posts.map(post => `
        <div>
          <h3>${post.title}</h3>
          <p>${post.content}</p>
        </div>
      `).join('');
    });
}

function setupPostForm() {
  const form = document.getElementById('postForm');
  if (!form) return; // Only run if on admin.html
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = form.title.value;
    const content = form.content.value;
    await fetch(`${backendURL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    form.reset();
    alert('Post submitted!');
  });
}

loadPosts();
setupPostForm();
