DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    user_role VARCHAR(50) CHECK (
        user_role IN ('user', 'admin')
    ),
    email VARCHAR(50),
    auth0_id VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS  band_posts;

CREATE TABLE band_posts (
    id SERIAL PRIMARY KEY,
    post_type VARCHAR(50) NOT NULL CHECK (
        post_type IN ('announcement', 'image')
    ),
    title VARCHAR(50) NOT NULL,
    body VARCHAR(500),
    image_url VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()

);

DROP TABLE IF EXISTS donations;

CREATE TABLE donations(
    id SERIAL PRIMARY KEY,
    stripe_id VARCHAR (100) UNIQUE,
    donation_message VARCHAR(500), 
    amount INT NOT NULL,
    donation_status VARCHAR(20) NOT NULL CHECK (
        donation_status IN ('pending', 'completed', 'failed')
    ),
    created_at TIMESTAMP DEFAULT NOW()

);

DROP TABLE IF EXISTS chats;

CREATE TABLE chats(
    id SERIAL PRIMARY KEY,
    auth0_id VARCHAR(50),
    username VARCHAR(50),
    chat_message TEXT,
    sent_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS music_posts;

CREATE TABLE music_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    image_url VARCHAR(100),
    links JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    reviewer VARCHAR(50),
    score INT NOT NULL,
    body VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS shows;

CREATE TABLE shows(
    id SERIAL PRIMARY KEY,
    show_date TIMESTAMP NOT NULL,
    venue VARCHAR(50) NOT NULL,
    venue_url VARCHAR(100),
    tickets_url VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);