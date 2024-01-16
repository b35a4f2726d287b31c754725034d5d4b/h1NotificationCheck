let originalPageTitle = document.title; // Store the original page title

function fetchDataAndCheckMail() {
  console.log('check'); 
  const csrf_token = document.getElementsByName("csrf-token")[0].getAttribute("content")
  const url = 'https://hackerone.com/graphql';
  const query = '{"query":"query x {me { unreadNotificationCount: unread_notification_count } }"}';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Csrf-Token': csrf_token
    },
    credentials: 'include', 
    body: query,
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Extract unreadNotificationCount from the response
    const unreadNotificationCount = data?.data?.me?.unreadNotificationCount || 0;

    if (unreadNotificationCount > 0) {
      // Update the page title
      document.title = "("+unreadNotificationCount+")"+'You got mail';
    } else {
      // Reset the page title to the original title
      document.title = originalPageTitle;
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

// Call the function initially
fetchDataAndCheckMail();

// Set up a recurring check every 20 seconds
setInterval(fetchDataAndCheckMail, 20000);
