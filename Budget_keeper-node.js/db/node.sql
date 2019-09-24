CREATE TABLE person (
    person_id SERIAL NOT NULL PRIMARY KEY,
    first_name VARCHAR(225) NOT NULL,
    last_name VARCHAR(225) NOT NULL,
    date_of_birth date NOT NULL
);

INSERT INTO person(first_name, last_name, date_of_birth)
    VALUES  ('Eva', 'Peterson', '1990-01-05'), 
            ('Winnie', 'Wan', '1995-03-24'), 
            ('Tom', 'Brown', '1981-05-11'), 
            ('David', 'Wilson', '2000-10-30');

CREATE USER adrianyim WITH PASSWORD 'adrianyim';
GRANT SELECT, INSERT, UPDATE, DELETE ON person TO adrianyim;
GRANT USAGE, SELECT ON SEQUENCE person_id_seq TO adrianyim;