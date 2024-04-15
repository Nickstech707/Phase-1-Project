// Function to fetch remote jobs based on user input
async function getRemoteJobs() {
  const searchQuery = document.getElementById("searchInput").value;

  const apiUrl = "https://remotive.io/api/remote-jobs";

  try {
    // Fetch data from the API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const matchingJobs = data.jobs.filter((job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Clear previous results
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    // Create job cards for each matching job
    matchingJobs.forEach((job) => {
      const jobCard = document.createElement("div");
      jobCard.classList.add("job-card"); // Apply styling as needed
      // Populate job card content
      jobCard.innerHTML = `
                      <h1>${job.company_name}</h1>
                      <img src="${job.company_logo}" alt="${job.company_name} logo" />
                      <h2>${job.title}</h2>
                      <h3>${job.category}</h3>
                      <p>${job.salary}</p>
                      <button class="copy-link-btn" data-link="${job.url}">Copy Link for more Info</button>
                      <div class="additional-info" style="display: none;">
                        <p>Candidate Required Location: ${job.candidate_required_location}</p>
                        <p>Publication Date: ${job.publication_date}</p>
                      </div>
                    `;
      resultsDiv.appendChild(jobCard);
      // Add event listener to the "Copy Link" button
      const copyLinkBtn = jobCard.querySelector(".copy-link-btn");
      copyLinkBtn.addEventListener("click", () => {
        const linkToCopy = copyLinkBtn.getAttribute("data-link");
        navigator.clipboard
          .writeText(linkToCopy)
          .then(() => {
            console.log("Link copied to clipboard:", linkToCopy);
            copyLinkBtn.textContent = "Link Copied to Clipboard";
            setTimeout(() => {
              copyLinkBtn.textContent = "Copy Link for more Info";
            }, 3000);
          })
          .catch((error) => {
            console.error("Error copying link to clipboard:", error);
          });
      });

      jobCard.addEventListener("mouseover", () => {
        jobCard.querySelector(".additional-info").style.display = "block";
      });

      jobCard.addEventListener("mouseout", () => {
        jobCard.querySelector(".additional-info").style.display = "none";
      });
    });
  } catch (error) {
    console.error("Error fetching remote jobs:", error);
  }
  // Show the overlay and results
  document.getElementById("overlay").style.display = "block";
  document.getElementById("results").style.display = "block";
}
// Event listener for the "Cancel" button
document.getElementById("cancelButton").addEventListener("click", function () {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("results").style.display = "none";
});
// Track whether the notification is displayed to prevent duplicates
let notificationDisplayed = false;
// Function to save user email
function saveUserEmail() {
  const emailInput = document.getElementById("emailInput");
  const userEmail = emailInput.value;

  if (userEmail && !notificationDisplayed) {
    notificationDisplayed = true;
    fetch("http://localhost:3000/saveEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail }),
    })
      .then((response) => {
        if (response.ok) {
          showNotification("Email saved successfully");
          emailInput.value = "";
          emailInput.disabled = true;
          document.getElementById("subscribeButton").disabled = true;
        } else {
          console.error("Failed to save email");
        }
      })
      .catch((error) => console.error("Error saving email:", error))
      .finally(() => {
        notificationDisplayed = false;
      });
  }
}
// Function to display a notification message
function showNotification(message) {
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    // If a notification already exists, update its content
    existingNotification.textContent = message;
  } else {
    // Otherwise, create a new notification element
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = message;
    document.body.appendChild(notification);
  }
  // Remove the notification after 2 seconds
  setTimeout(function () {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }
  }, 2000);
}
// Event listener for the "Subscribe" button
document
  .getElementById("subscribeButton")
  .addEventListener("click", function () {
    saveUserEmail();
  });
// Function to send an email notification
function sendEmailNotification(jobTitle, recipientEmail) {
  const emailSubject = `New Job Alert: ${jobTitle}`;
  const emailBody = `A new job titled "${jobTitle}" has been added. Check it out now!`;

  fetch("http://localhost:3000/sendEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: recipientEmail,
      subject: emailSubject,
      body: emailBody,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Email notification sent successfully");
      } else {
        console.error("Failed to send email notification");
      }
    })
    .catch((error) =>
      console.error("Error sending email notification:", error)
    );
}
