const backendURL = 'https://backend-trial-render.onrender.com';

 async function loadPosts() {
      const res = await fetch(`${backendURL}/posts`);
      const posts = await res.json();
      const container = document.getElementById('posts');
      container.innerHTML = posts.map(post => `<h3>${post.title}</h3><p>${post.content}</p>`).join('');
    }

document.getElementById('postForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const title = form.title.value;
      const content = form.content.value;
      await fetch(`${backendURL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      form.reset();
      loadPosts();
    });

    loadPosts();
