const backendURL = 'https://backend-trial-render.onrender.com'; // Change to your actual backend URL

function loadPosts() {
  const container = document.getElementById('posts');
  if (!container) return;

  fetch(`${backendURL}/posts`)
    .then(res => res.json())
    .then(posts => renderPosts(posts));
}

function renderPosts(posts) {
  const container = document.getElementById('posts');
  const isAdmin = document.body.classList.contains('admin');

  container.innerHTML = posts.map(post => `
    <div data-id="${post.id}" style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
      <h3>${post.title}</h3>
      ${post.image ? `<img src="${backendURL}${post.image}" style="max-width:100%; height:auto;" />` : ''}
      <p>${post.content}</p>
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
        const res = await fetch(`${backendURL}/posts/${postId}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          postEl.remove();
        } else {
          alert('❌ Failed to delete post.');
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

    try {
      const res = await fetch(`${backendURL}/posts`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        form.reset();
        status.textContent = '✅ Post submitted!';
        loadPosts();
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
