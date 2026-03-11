const loginForm = document.getElementById("loginForm");
const responseLog = document.getElementById("responseLog");
const userInfo = document.getElementById("userInfo");
let socket = null;

// ================= STRIPE SETUP =================
// Replace with your actual Stripe publishable key
const stripe = Stripe('pk_test_51T6cYdEctXIaauafFjZo0KJ9yEjdvksHTP0hLOMJ4GlKgDGNwMkl5rrHd0nPXBgs6J3FsTm08OTFoEuLHyOs2Y8M00EjoMNmz0');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    try{
        const response = await fetch("http://localhost:6700/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        const data = await response.json();
        localStorage.setItem("access_token", data);
        console.log(data);
        socket = io("http://localhost:6700", {
            auth: { token: data }
        });

        socket.on("connect", () => console.log("Socket connected!", socket.id));
        socket.on("connect_error", (err) => console.log("Connection error:", err.message));

        socket.on("chat:receive", (data) => {
            console.log("chat:receive data:", data);
            const list = document.getElementById("chatMessagesList");
            const li = document.createElement("li");
            li.textContent = `${data.username}: ${data.chat_message}`;
            list.appendChild(li);
        });

        // Log formatted JSON response to page
        responseLog.textContent = JSON.stringify(data, null, 2);

        // Optional: Update user info display
        document.getElementById("userInfo").textContent = "Logged in!";

    } catch (err) {
        console.error("Login error:", err);

        responseLog.textContent = JSON.stringify({
            error: "Request failed",
            details: err.message
        }, null, 2);
    }
});


document.getElementById("signupForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("usernameInput2").value;
    const email = document.getElementById("emailInput2").value;
    const password = document.getElementById("passwordInput2").value;

    const res = await fetch("http://localhost:6700/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    });

    console.log(await res.json());
});


// ================= Chat =======================

document.getElementById("chatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("socket at submit time:", socket);

    const input = document.getElementById("chatMessageInput");
    const message = input.value;

    if (!socket) {
        console.log("Socket not connected");
        return;
    }

    socket.emit("chat:send", { message });
    input.value = "";
});


// ================= DONATIONS =================

document.getElementById("donationForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const statusEl = document.getElementById("donationStatus");
    const amountInput = document.getElementById("donationAmountInput").value;
    const message = document.getElementById("donationMessageInput").value;
    const amount = Math.round(Number(amountInput) * 100); // convert to cents for Stripe

    statusEl.textContent = "Processing...";

    try {
        // 1. Create payment intent on the server
        const response = await fetch("http://localhost:6700/donations/create_payment_intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount, message })
        });

        const { clientSecret } = await response.json();

        if (!clientSecret) {
            statusEl.textContent = "Failed to initialize payment.";
            return;
        }

        // 2. Confirm the card payment with Stripe
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement
            }
        });

        if (error) {
            document.getElementById("card-errors").textContent = error.message;
            statusEl.textContent = "Payment failed.";
            return;
        }

        if (paymentIntent.status === "succeeded") {
            statusEl.textContent = "Donation successful! Thank you!";
            document.getElementById("card-errors").textContent = "";
            document.getElementById("donationForm").reset();
            // Re-mount card element after reset
            cardElement.clear();
        }

    } catch (err) {
        console.error("Donation error:", err);
        statusEl.textContent = "Something went wrong: " + err.message;
    }
});


// ================= BAND POSTS =================

document.getElementById("bandPostForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    console.log(token);
    const title = document.getElementById("bandTitleInput").value;
    const body = document.getElementById("bandBodyInput").value;

    const response = await fetch('http://localhost:6700/bandPosts', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({title, body, postType: 'announcement' })
    });

    const data = await response.json();

    console.log(data);
});

document.getElementById("clearStorageBtn").addEventListener("click", () => {
    localStorage.clear();
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    document.getElementById("userInfo").textContent = "Not logged in";
    console.log("Local storage cleared");
});


// ================= MUSIC POSTS =================

document.getElementById("musicPostForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    const title = document.getElementById("musicTitleInput").value;
    const imageUrl = document.getElementById("musicImageUrlInput").value;

    const links = document
        .getElementById("musicLinksInput")
        .value
        .split(",")
        .map(link => link.trim());

    const response = await fetch('http://localhost:6700/musicPosts', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({title, imageUrl, links })
    });

    const data = await response.json();
    console.log(data);

});


// ================= REVIEWS =================

document.getElementById("reviewForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    const reviewer = document.getElementById("reviewer").value;
    const reviewerScore = document.getElementById("reviewScoreInput").value;
    const body = document.getElementById("reviewBodyInput").value;

    const response = await fetch("http://localhost:6700/reviews", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            reviewer,
            score: Number(reviewerScore),
            body
        })
    });

    const data = await response.json();
    console.log(data);
});


// ================= SHOWS =================

document.getElementById("showForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    const showDate = document.getElementById("showDateInput").value;
    const venue = document.getElementById("showVenueInput").value;
    const venueUrl = document.getElementById("showVenueUrlInput").value;
    const ticketsUrl = document.getElementById("showTicketsUrlInput").value;

    const response = await fetch("http://localhost:6700/shows", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            showDate,
            venue,
            venueUrl,
            ticketsUrl
        })
    });

    const data = await response.json();
    console.log(data);
});


// ================= LIST POPULATION =================

function renderList(listElementId, items, formatter) {
    const list = document.getElementById(listElementId);
    list.innerHTML = "";

    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = formatter(item);
        list.appendChild(li);
    });
}


// -------- LOAD BAND POSTS --------
async function loadBandPosts() {

    const response = await fetch('http://localhost:6700/bandPosts', {
        method: "GET",
    })

    const posts = await response.json();
    console.log(posts);
    renderList("bandPostsList", posts, post =>
        `${post.title} - ${post.body}`
    );
}


// -------- LOAD MUSIC POSTS --------
async function loadMusicPosts() {

    const response = await fetch('http://localhost:6700/musicPosts', {
        method: "GET"
    });

    const posts = await response.json();
    console.log(posts);

    renderList("musicPostsList", posts, post =>
        `${post.title} | ${post.image_url} | ${(post.links || []).join(", ")}`
    );
}


// -------- LOAD REVIEWS --------
async function loadReviews() {

    const response = await fetch('http://localhost:6700/reviews', {
        method: "GET"
    });

    const reviews = await response.json();

    renderList("reviewsList", reviews, review =>
        `Reviewer: ${review.reviewer} | Score: ${review.score} | ${review.body}`
    );
}


// -------- LOAD SHOWS --------
async function loadShows() {

    const response = await fetch('http://localhost:6700/shows', {
        method: "GET"
    });

    const shows = await response.json();

    renderList("showsList", shows, show =>
        `Date: ${show.show_date} | Venue: ${show.venue} | Venue URL: ${show.venue_url} | Tickets: ${show.tickets_url}`
    );
}


// -------- LOAD DONATIONS --------
async function loadDonations() {

    const response = await fetch('http://localhost:6700/donations', {
        method: "GET"
    });

    const donations = await response.json();

    renderList("donationsList", donations, donation =>
        `$${(donation.amount / 100).toFixed(2)} | Status: ${donation.donation_status} | Message: ${donation.donation_message || 'none'}`
    );
}


// Auto load lists on page load
window.addEventListener("DOMContentLoaded", () => {
    loadBandPosts();
    console.log("LOADED BAND POSTS");
    loadMusicPosts();
    loadReviews();
    loadShows();
    loadDonations();
});