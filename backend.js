const backendURL = 'https://backend-trial-render.onrender.com';

function renderPosts(posts) {
  const container = document.getElementById('posts');
  const isAdmin = document.body.classList.contains('admin');

  container.innerHTML = posts.map(post => `
    <div data-id="${post.id}">
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      ${isAdmin ? `<button class="deleteBtn">🗑 Delete</button>` : ''}
    </div>
  `).join('');

  if (isAdmin) setupDeleteButtons();
}

function loadPosts() {
  const container = document.getElementById('posts');
  if (!container) return;

  fetch(`${backendURL}/posts`)
    .then(res => res.json())
    .then(renderPosts);
}

function setupLiveUpdates() {
  if (document.body.classList.contains('admin')) return; // Admin doesn't need live updates

  const eventSource = new EventSource(`${backendURL}/stream`);
  eventSource.onmessage = (event) => {
    const posts = JSON.parse(event.data);
    renderPosts(posts);
  };

  eventSource.onerror = (err) => {
    console.error('SSE connection error:', err);
    eventSource.close(); // optional: reconnect logic
  };
}

function setupDeleteButtons() {
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const postEl = e.target.closest('[data-id]');
      const postId = postEl.getAttribute('data-id');

      if (confirm('Are you sure you want to delete this post?')) {
        const res = await fetch(`${backendURL}/posts/${postId}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          postEl.remove(); // Admin sees immediate removal
        } else {
          alert('Failed to delete post.');
        }
      }
    });
  });
}

function setupPostForm() {
  const form = document.getElementById('postForm');
  const status = document.getElementById('status');
  if (!form) return;

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
        // No need to call loadPosts() — live updates will handle it
      } else {
        status.textContent = '❌ Failed to submit post.';
      }
    } catch (err) {
      status.textContent = '❌ Network error.';
    }
  });
}

// Initial setup
loadPosts();
setupLiveUpdates();
setupPostForm();
