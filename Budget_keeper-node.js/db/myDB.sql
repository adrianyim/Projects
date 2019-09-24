-- Create section
CREATE TABLE users (
    user_id serial NOT NULL,
    user_name VARCHAR(225) UNIQUE NOT NULL CONSTRAINT users_name_pk PRIMARY KEY,
    password VARCHAR(255) NOT NULL, 
    gender VARCHAR(1)
);

CREATE TABLE items (
    item_id serial NOT NULL CONSTRAINT items_id_pk PRIMARY KEY,
    item VARCHAR(45) NOT NULL, 
    item_type VARCHAR(45) NOT NULL,
    remark VARCHAR(45),
    cost_id serial NOT NULL CONSTRAINT items_fk_1 REFERENCES cost(cost_id),
    date_id serial NOT NULL CONSTRAINT items_fk_2 REFERENCES date(date_id),
    user_name VARCHAR(225) NOT NULL CONSTRAINT items_fk3 REFERENCES users(user_name)
);

CREATE TABLE cost (
    cost_id serial NOT NULL CONSTRAINT cost__id_pk PRIMARY KEY,
    cost DECIMAL NOT NULL,
    cost_type VARCHAR(45) NOT NULL
);

CREATE TABLE date (
    date_id serial NOT NULL UNIQUE CONSTRAINT date_id_pk PRIMARY KEY,
    date date NOT NULL
);


CREATE TABLE total (
    id serial NOT NULL CONSTRAINT total_pk PRIMARY KEY,
    total DECIMAL NOT NULL
);

-- Insert section
INSERT INTO users (user_id, user_name, password, gender)
    VALUES  (DEFAULT, 'admin', 'admin', 'M'),
            (DEFAULT, 'tester', 'tester', 'M');

INSERT INTO date (date_id, date)
    VALUES  (DEFAULT, '07-10-2019'),
            (DEFAULT, '07-05-2019'),
            (DEFAULT, '07-11-2019'),
            (DEFAULT, '07-11-2019'),
            (DEFAULT, '07-15-2019'),
            (DEFAULT, '07-22-2019'),
            (DEFAULT, '07-23-2019'),
            (DEFAULT, '07-29-2019');

INSERT INTO cost (cost_id, cost, cost_type)
    VALUES  (DEFAULT, 20.99, 'Expense'),
            (DEFAULT, 11.02, 'Expense'),
            (DEFAULT, 504.32, 'Income'),
            (DEFAULT, 30.51, 'Expense'),
            (DEFAULT, 53.78, 'Expense'),
            (DEFAULT, 5, 'Expense'),
            (DEFAULT, 99.99, 'Expense'),
            (DEFAULT, 12.2, 'Expense');

INSERT INTO items (item_id, item, item_type, remark, cost_id, date_id, user_name) 
    VALUES  (DEFAULT, 'Walmark', 'Food', 'shoes', DEFAULT, DEFAULT, 'admin'),
            (DEFAULT, 'BBQ', 'Food', '', DEFAULT, DEFAULT, 'tester'),
            (DEFAULT, 'Admin salary', 'Salaries and wages', 'May', DEFAULT, DEFAULT, 'admin'),
            (DEFAULT, 'Walmart', 'Food', 'ice cream', DEFAULT, DEFAULT, 'admin'),
            (DEFAULT, 'Chicken', 'Food', 'Daniel', DEFAULT, DEFAULT, 'tester'),
            (DEFAULT, 'Walmart', 'Food', 'ice cream', DEFAULT, DEFAULT, 'tester'),
            (DEFAULT, 'Walmart', 'Others', 'Is working', DEFAULT, DEFAULT, 'admin'),
            (DEFAULT, 'Gift', 'Others', 'My mom birthday!', DEFAULT, DEFAULT, 'tester');

-- insert section
INSERT INTO items (item_id, item, item_type, remark, cost_id, date_id, user_name) 
    VALUES (DEFAULT, 'Rent', 'Utility Expenses', '??', (SELECT cost_id from cost WHERE cost_id = 5), (SELECT date from date d WHERE c.date_id = 5), 'tester');

INSERT INTO items (item_id, item, item_type, remark, cost_id, date_id, user_name) 
    VALUES (DEFAULT, 'Rent', 'Utility Expenses', '??', DEFAULT, DEFAULT, 'tester');

INSERT INTO cost (cost_id, cost, cost_type)
    VALUES  (DEFAULT, 570, 'Expense');

INSERT INTO date (date_id, date)
    VALUES  (DEFAULT, current_timestamp);


INSERT INTO totals (id, total, user_id, item_id)
VALUES (DEFAULT, 10, (SELECT user_id FROM users WHERE user_name='tester'), (SELECT item_id FROM items WHERE item_type='food'));
-- ------

-- select section
SELECT i.user_name, i.item_id, i.item, i.item_type, i.remark, (SELECT c.cost FROM cost c WHERE c.cost_id = i.cost_id) AS cost, (SELECT c.cost_type FROM cost c WHERE c.cost_id = i.cost_id) AS cost_type, (SELECT d.date FROM date d WHERE d.date_id = i.date_id) AS date FROM items i WHERE i.user_name = 'admin' ORDER BY date;

SELECT i.user_name, I.item_id, i.item, i.item_type, i.remark, c.cost, c.cost_type, d.date FROM items i, INNER JOIN cost c ON i.cost_id = c.cost_id INNER JOIN date d ON i.date_id = d.date_id WHERE i.user_name = 'admin';
    
-- update section
UPDATE cost SET cost = 1, cost_type = 'Income' WHERE cost_id = 1;

UPDATE date SET date = '06-08-2019' WHERE date_id = 1;

UPDATE items SET item = 'Updated Walamark', item_type = 'Other', remark = 'I have changed the remark' WHERE item_id = 1;

-- delete section
DELETE FROM items WHERE item_id = 7;

DELETE FROM cost WHERE cost_id = 7;

DELETE FROM date WHERE date_id = 7;

-- UNION JOIN
SELECT user_name FROM users WHERE user_name='admin'
UNION ALL
SELECT item_id, item, item_type, remark FROM items WHERE user_name='admin'
UNION ALL
SELECT cost, cost_type FROM cost WHERE user_name='admin'
UNION ALL
SELECT date FROM date WHERE user_name='admin';


-- Command DB
CREATE USER adrianyim WITH PASSWORD 'adrianyim';
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO adrianyim;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO adrianyim;

CREATE USER adrian WITH password 'adrianyim';
GRANT SELECT, INSERT, UPDATE ON users TO adrian;
GRANT USAGE, SELECT ON users_id_seq TO adrian;

SELECT * FROM summary s LEFT JOIN users u ON u.user_id = s.user_id LEFT JOIN items i ON i.item_id = s.item_id;

DROP TABLE users, items;

UPDATE items 
SET item = 'Update item1', item_type='Changed item type', cost=9090, cost_type='Income', remark='Testing the updates'
WHERE item_id = 16;

ALTER TABLE items
    ALTER COLUMN cost_id SERIAL;

-- Set timezone/date style to mountain standard time
SET TIMEZONE='MST';
SET DATESTYLE TO SQL,US;
SET DATESTYLE TO "SQL, US";
SELECT NOW();
SHOW datestyle;