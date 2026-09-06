-- =====================================
-- FARMSOS DATABASE SCHEMA
-- =====================================


-- =====================================
-- USERS TABLE
-- =====================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'farmer'
        CHECK (role IN ('farmer', 'buyer', 'admin')),

    phone VARCHAR(20) NOT NULL,

    location VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =====================================
-- HARVESTS TABLE
-- =====================================

CREATE TABLE IF NOT EXISTS harvests (

    id SERIAL PRIMARY KEY,

    farmer_id INTEGER NOT NULL,

    crop_name VARCHAR(100) NOT NULL,

    quantity DECIMAL(10,2) NOT NULL,

    unit VARCHAR(20) NOT NULL DEFAULT 'kg',

    price DECIMAL(10,2) NOT NULL,

    location VARCHAR(255) NOT NULL,

    description TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'available'
        CHECK (
            status IN (
                'available',
                'sold',
                'reserved'
            )
        ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_farmer
        FOREIGN KEY (farmer_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =====================================
-- INTERESTS TABLE
-- =====================================

CREATE TABLE IF NOT EXISTS interests (

    id SERIAL PRIMARY KEY,

    harvest_id INTEGER NOT NULL,

    buyer_id INTEGER NOT NULL,

    message TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'accepted',
                'rejected'
            )
        ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_harvest
        FOREIGN KEY (harvest_id)
        REFERENCES harvests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_buyer
        FOREIGN KEY (buyer_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
