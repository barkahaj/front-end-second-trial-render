const backendURL = 'https://backend-trial-render.onrender.com';

function loadPosts() {
  const container = document.getElementById('posts');
  if (!container) return; // Only run on index.html

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
  const status = document.getElementById('status');
  if (!form) return; // Only run on admin.html

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = form.title.value.trim();
    const content = form.content.value.trim();

    if (!title || !content) {
      status.textContent = 'Both fields are required.';
      return;
    }

    try {
      const res = await fetch(`${backendURL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });

      if (res.ok) {
        form.reset();
        status.textContent = '✅ Post submitted!';
      } else {
        status.textContent = '❌ Failed to submit post.';
      }
    } catch (err) {
      status.textContent = '❌ Network error.';
    }
  });
}

loadPosts();
setupPostForm();
