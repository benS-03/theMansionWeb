CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    auth0_id VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


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

CREATE TABLE donations(
    id SERIAL PRIMARY KEY,
    donation_message VARCHAR(500), 
    amount INT NOT NULL,
    donation_status VARCHAR(20) NOT NULL CHECK (
        donation_status IN ('pending', 'completed', 'failed')
    ),
    created_at TIMESTAMP DEFAULT NOW()

);

CREATE TABLE music_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    image_url VARCHAR(100),
    links JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    reviewer VARCHAR(50),
    score INT NOT NULL,
    body VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shows(
    id SERIAL PRIMARY KEY,
    show_date TIMESTAMPZ NOT NULL,
    venue VARCHAR(50) NOT NULL,
    venue_url VARCHAR(100),
    tickets_url VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);