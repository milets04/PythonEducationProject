-- Correcciones principales:
-- 1. Se agrega createdAt, updatedAt para auditoría
-- 2. Se añade isActive para soft deletes
-- 3. Se corrigen nombres a camelCase
-- 4. Se mejoran las restricciones de integridad

-- Drop existing tables (Order is crucial for foreign keys)
DROP TABLE IF EXISTS "answers" CASCADE;
DROP TABLE IF EXISTS "labStudents" CASCADE;
DROP TABLE IF EXISTS "questStudents" CASCADE;
DROP TABLE IF EXISTS "questions" CASCADE;
DROP TABLE IF EXISTS "hints" CASCADE;
DROP TABLE IF EXISTS "labs" CASCADE;
DROP TABLE IF EXISTS "contents" CASCADE;
DROP TABLE IF EXISTS "questionnaires" CASCADE;
DROP TABLE IF EXISTS "transcriptTopics" CASCADE;
DROP TABLE IF EXISTS "texts" CASCADE;
DROP TABLE IF EXISTS "topicMultimedia" CASCADE;
DROP TABLE IF EXISTS "multimedia" CASCADE;
DROP TABLE IF EXISTS "topics" CASCADE;
DROP TABLE IF EXISTS "units" CASCADE;
DROP TABLE IF EXISTS "userCourses" CASCADE;
DROP TABLE IF EXISTS "students" CASCADE;
DROP TABLE IF EXISTS "teachers" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "roles" CASCADE;

-- CORE USER AND ROLE TABLES

-- Table: roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert roles data
INSERT INTO roles (name, description) VALUES 
    ('student', 'Estudiante que consume contenido'),
    ('editorTeacher', 'Profesor que puede editar contenidos del curso'),
    ('executorTeacher', 'Profesor que imparte la materia y hace seguimiento'),
    ('administrator', 'Administrador del sistema');

-- Table: courses
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: users (Central table for all users)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(45) NOT NULL,
    lastName VARCHAR(45) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    roleId INTEGER NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    isApproved BOOLEAN DEFAULT FALSE,
    approvedAt TIMESTAMP WITH TIME ZONE,
    approvedBy INTEGER,
    rejectedAt TIMESTAMP WITH TIME ZONE,
    rejectedBy INTEGER,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_userRole
        FOREIGN KEY (roleId) 
        REFERENCES roles(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_userApprovedBy
        FOREIGN KEY (approvedBy)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_userRejectedBy
        FOREIGN KEY (rejectedBy)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Table: userCourses (Many-to-Many relationship)
CREATE TABLE userCourses (
    userId INT NOT NULL,
    courseId INT NOT NULL,
    enrollmentDate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, courseId),
    
    CONSTRAINT fk_userCourseUser
        FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_userCourseCourse
        FOREIGN KEY (courseId) REFERENCES courses(id)
        ON DELETE CASCADE
);

-- Table: teachers (Profile extension for Teacher types)
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL UNIQUE,
    specialization VARCHAR(100),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_teacherUser
        FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Table: students (Profile extension for Student type)
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL UNIQUE,
    checkpoint VARCHAR(45),
    history TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_studentUser
        FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- CONTENT STRUCTURE TABLES

-- Table: units
CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    courseId INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    position INT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_unitCourse
        FOREIGN KEY (courseId)
        REFERENCES courses (id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Table: topics
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    contentExternalId VARCHAR(45),
    name VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE topicVersions (
    id SERIAL PRIMARY KEY,
    topicId INTEGER NOT NULL,
    versionNumber INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    templateName VARCHAR(100) NOT NULL,
    contentData JSONB NOT NULL,
    changeType VARCHAR(50) NOT NULL,
    changeDescription TEXT,
    modifiedBy INTEGER NOT NULL,
    modifiedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_topicVersion_topic
        FOREIGN KEY (topicId)
        REFERENCES topics(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_topicVersion_user
        FOREIGN KEY (modifiedBy)
        REFERENCES users(id)
        ON DELETE RESTRICT,
    CONSTRAINT unique_topic_version
        UNIQUE (topicId, versionNumber)
)

ALTER TABLE topics ADD COLUMN currentVersion INTEGER DEFAULT 1

-- Table: multimedia
CREATE TABLE multimedia (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    type VARCHAR(45),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: topicMultimedia
CREATE TABLE topicMultimedia (
    topicId INT NOT NULL,
    multimediaId INT NOT NULL,
    PRIMARY KEY (topicId, multimediaId),
    CONSTRAINT fk_tmTopic
        FOREIGN KEY (topicId) REFERENCES topics (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tmMultimedia
        FOREIGN KEY (multimediaId) REFERENCES multimedia (id)
        ON DELETE CASCADE
);

-- Table: texts
CREATE TABLE texts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL, 
    type VARCHAR(45),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: transcriptTopics
CREATE TABLE transcriptTopics (
    textId INT NOT NULL,
    topicId INT NOT NULL,
    PRIMARY KEY (textId, topicId),
    CONSTRAINT fk_ttText
        FOREIGN KEY (textId) REFERENCES texts (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ttTopic
        FOREIGN KEY (topicId) REFERENCES topics (id)
        ON DELETE CASCADE
);

-- Table: questionnaires
CREATE TABLE questionnaires (
    id SERIAL PRIMARY KEY,
    contentExternalId VARCHAR(45),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: contents
CREATE TABLE contents (
    id SERIAL PRIMARY KEY,
    unitId INT NOT NULL,
    questionnaireId INT,
    topicId INT,
    position INT,
    score DECIMAL(5, 2),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_contentUnit
        FOREIGN KEY (unitId) REFERENCES units (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_contentQuestionnaire
        FOREIGN KEY (questionnaireId) REFERENCES questionnaires (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_contentTopic
        FOREIGN KEY (topicId) REFERENCES topics (id)
        ON DELETE SET NULL 
);

-- Table: labs
CREATE TABLE labs (
    id SERIAL PRIMARY KEY,
    contentId INT NOT NULL,
    contentExternalId VARCHAR(45),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_labContent
        FOREIGN KEY (contentId) REFERENCES contents (id)
        ON DELETE CASCADE
);

-- Table: hints
CREATE TABLE hints (
    id SERIAL PRIMARY KEY,
    labId INT NOT NULL,
    name VARCHAR(45),
    text TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_hintLab
        FOREIGN KEY (labId)
        REFERENCES labs (id)
        ON DELETE CASCADE
);

-- Table: questions
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    questionnaireId INT NOT NULL,
    text TEXT NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_questionQuestionnaire
        FOREIGN KEY (questionnaireId)
        REFERENCES questionnaires (id)
        ON DELETE CASCADE
);

-- Table: answers
CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    questionId INT NOT NULL,
    text TEXT,
    isCorrect BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_answerQuestion
        FOREIGN KEY (questionId)
        REFERENCES questions (id)
        ON DELETE CASCADE
);

-- STUDENT PROGRESS AND ACTIVITY TABLES

-- Table: labStudents
CREATE TABLE labStudents (
    id SERIAL PRIMARY KEY,
    labId INT NOT NULL,
    studentId INT NOT NULL,
    name VARCHAR(45),
    comment TEXT,
    submissionDate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_lsLab
        FOREIGN KEY (labId) REFERENCES labs (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_lsStudent
        FOREIGN KEY (studentId) REFERENCES students (id)
        ON DELETE CASCADE
);

-- Table: questStudents
CREATE TABLE questStudents (
    id SERIAL PRIMARY KEY,
    questionnaireId INT NOT NULL,
    studentId INT NOT NULL,
    completionDate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    score DECIMAL(5, 2),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_qsQuestionnaire
        FOREIGN KEY (questionnaireId) REFERENCES questionnaires (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_qsStudent
        FOREIGN KEY (studentId) REFERENCES students (id)
        ON DELETE CASCADE
);