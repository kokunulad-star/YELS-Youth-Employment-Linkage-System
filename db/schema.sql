-- ============================================================
-- YELS - Youth Investment, Entrepreneurship and Employment
--        Linkage System
-- Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS yels_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE yels_db;

-- ============================================================
-- USERS & AUTH
-- ============================================================

CREATE TABLE users (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('youth', 'investor', 'organization', 'admin') NOT NULL,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- YOUTH PROFILES
-- ============================================================

CREATE TABLE youth_profiles (
    id                INT PRIMARY KEY AUTO_INCREMENT,
    user_id           INT UNIQUE NOT NULL,
    first_name        VARCHAR(100) NOT NULL,
    last_name         VARCHAR(100) NOT NULL,
    date_of_birth     DATE,
    gender            ENUM('male', 'female', 'other'),
    phone             VARCHAR(20),
    location          VARCHAR(255),
    bio               TEXT,
    cv_url            VARCHAR(500),           -- uploaded CV file path/URL
    linkedin_url      VARCHAR(500),
    github_url        VARCHAR(500),
    portfolio_url     VARCHAR(500),
    profile_photo_url VARCHAR(500),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE youth_education (
    id             INT PRIMARY KEY AUTO_INCREMENT,
    youth_id       INT NOT NULL,              -- references youth_profiles.id
    institution    VARCHAR(255) NOT NULL,
    degree         VARCHAR(100),              -- e.g. Bachelor's, Diploma, Certificate
    field_of_study VARCHAR(255),
    start_year     YEAR,
    end_year       YEAR,
    is_current     BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (youth_id) REFERENCES youth_profiles(id) ON DELETE CASCADE
);

CREATE TABLE skills (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL        -- e.g. "Python", "Graphic Design"
);

CREATE TABLE youth_skills (
    youth_id INT NOT NULL,
    skill_id INT NOT NULL,
    level    ENUM('beginner', 'intermediate', 'advanced'),
    PRIMARY KEY (youth_id, skill_id),
    FOREIGN KEY (youth_id) REFERENCES youth_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- ============================================================
-- INVESTOR PROFILES
-- ============================================================

CREATE TABLE investor_profiles (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    user_id       INT UNIQUE NOT NULL,
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    focus_area    VARCHAR(255),              -- e.g. "AgriTech", "FinTech"
    website_url   VARCHAR(500),
    location      VARCHAR(255),
    logo_url      VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- ORGANIZATION PROFILES
-- ============================================================

CREATE TABLE organization_profiles (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    user_id       INT UNIQUE NOT NULL,
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    industry      VARCHAR(100),
    website_url   VARCHAR(500),
    location      VARCHAR(255),
    logo_url      VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- OPPORTUNITIES
-- ============================================================

CREATE TABLE opportunities (
    id             INT PRIMARY KEY AUTO_INCREMENT,
    posted_by      INT NOT NULL,             -- references users.id (investor or org)
    title          VARCHAR(255) NOT NULL,
    description    TEXT NOT NULL,
    type           ENUM('job', 'funding', 'training') NOT NULL,
    industry       VARCHAR(100),
    location       VARCHAR(255),
    is_remote      BOOLEAN DEFAULT FALSE,
    deadline       DATE,
    status         ENUM('open', 'closed', 'draft') DEFAULT 'open',

    -- Job-specific fields
    salary_range   VARCHAR(100),
    job_type       ENUM('full_time', 'part_time', 'internship', 'contract'),

    -- Funding-specific fields
    funding_amount DECIMAL(15, 2),
    funding_type   ENUM('grant', 'loan', 'equity', 'other'),

    -- Training-specific fields
    duration       VARCHAR(100),             -- e.g. "3 months", "2 weeks"
    mode           ENUM('online', 'in_person', 'hybrid'),

    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Skills required for an opportunity
CREATE TABLE opportunity_skills (
    opportunity_id INT NOT NULL,
    skill_id       INT NOT NULL,
    PRIMARY KEY (opportunity_id, skill_id),
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- ============================================================
-- APPLICATIONS
-- ============================================================

CREATE TABLE applications (
    id             INT PRIMARY KEY AUTO_INCREMENT,
    youth_id       INT NOT NULL,             -- references youth_profiles.id
    opportunity_id INT NOT NULL,
    cover_letter   TEXT,
    status         ENUM('pending', 'shortlisted', 'interviewed', 'accepted', 'rejected')
                   DEFAULT 'pending',
    applied_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_application (youth_id, opportunity_id),  -- one application per opportunity
    FOREIGN KEY (youth_id) REFERENCES youth_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
);

-- Tracks full status change history per application
CREATE TABLE application_status_history (
    id             INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL,
    old_status     ENUM('pending', 'shortlisted', 'interviewed', 'accepted', 'rejected'),
    new_status     ENUM('pending', 'shortlisted', 'interviewed', 'accepted', 'rejected'),
    changed_by     INT NOT NULL,             -- references users.id (poster or admin)
    note           TEXT,                     -- optional reviewer note
    changed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id         INT PRIMARY KEY AUTO_INCREMENT,
    user_id    INT NOT NULL,                 -- recipient
    title      VARCHAR(255) NOT NULL,
    message    TEXT NOT NULL,
    type       ENUM('application_update', 'new_opportunity', 'message', 'system') NOT NULL,
    is_read    BOOLEAN DEFAULT FALSE,
    related_id INT,                          -- e.g. application_id or opportunity_id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- MESSAGING
-- ============================================================

CREATE TABLE conversations (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    participant_1 INT NOT NULL,              -- references users.id
    participant_2 INT NOT NULL,              -- references users.id
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_conversation (participant_1, participant_2),
    FOREIGN KEY (participant_1) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_2) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT NOT NULL,
    sender_id       INT NOT NULL,            -- references users.id
    body            TEXT NOT NULL,
    is_read         BOOLEAN DEFAULT FALSE,
    sent_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
