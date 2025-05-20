const backendURL = 'https://backend-trial-render.onrender.com';

function renderPosts(posts) {
  const container = document.getElementById('posts');
  if (!container) return;

  const isAdmin = document.body.classList.contains('admin');

  container.innerHTML = posts.map(post => `
    <div data-id="${post.id}" style="border:1px solid #ccc; margin-bottom:10px; padding:10px;">
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      ${post.image ? `<img src="${backendURL}${post.image}" alt="post image" style="max-width:200px; display:block; margin-top:10px;">` : ''}
      ${isAdmin ? `<button class="deleteBtn">🗑 Delete</button>` : ''}
    </div>
  `).join('');

  if (isAdmin) setupDeleteButtons();
}

function setupDeleteButtons() {
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const postEl = e.target.closest('[data-id]');
      const postId = postEl.getAttribute('data-id');

      if (confirm('Are you sure you want to delete this post?')) {
        const res = await fetch(`${backendURL}/posts/${postId}`, { method: 'DELETE' });
        if (res.ok) {
          postEl.remove();
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

    const formData = new FormData(form);
    status.textContent = 'Posting...';

    try {
      const res = await fetch(`${backendURL}/posts`, {
        method: 'POST',
        body: formData
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

function setupSSE() {
  const evtSource = new EventSource(`${backendURL}/events`);

  evtSource.onmessage = e => {
    try {
      const posts = JSON.parse(e.data);
      renderPosts(posts);
    } catch {
      console.error('Failed to parse SSE data');
    }
  };

  evtSource.onerror = () => {
    console.warn('SSE connection lost. Trying to reconnect...');
    evtSource.close();
    // Optional: you can add reconnection logic here
  };
}

// Initialize page
renderPosts([]); // Clear posts while loading
setupPostForm();
setupSSE();
