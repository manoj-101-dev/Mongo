# MongoDB Sample Data and Queries

This document provides sample data inserts and queries for a MongoDB database with collections related to a hypothetical educational platform.

## Sample Data Inserts

### Users Collection
```javascript
db.users.insertOne({
  name: "vikram",
  email: "vikram@example.com",
  role: "student",
});
