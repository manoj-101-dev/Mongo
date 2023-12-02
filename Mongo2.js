// Sample data for Users collection
db.users.insertOne({
  name: "vikram",
  email: "vikram@example.com",
  role: "student",
});

// Sample data for Codekata collection
db.codekata.insertOne({
  user_id: ObjectId(),
  problems_solved: 10,
  date_completed: ISODate("2023-11-20"),
});

// Sample data for Attendance collection
db.attendance.insertOne({
  user_id: ObjectId(),
  date: ISODate("2023-11-20"),
  status: "present",
  drive_id: ObjectId(),
});

// Sample data for Topics collection
db.topics.insertOne({
  name: "Topic A",
  description: "Description for Topic A",
});

// Sample data for Tasks collection
db.tasks.insertOne({
  user_id: ObjectId(),
  topic_id: ObjectId(),
  date: ISODate("2023-11-25"),
  description: "Task for Topic A",
});

// Sample data for Company Drives collection
db.company_drives.insertOne({
  name: "Company Y Drive",
  date: ISODate("2020-10-25"),
  date: ISODate("2020-10-18"),
});

// Sample data for Mentors collection
db.mentors.insertOne({
  name: "Mentor B",
  mentee_count: 18,
});

// Queries

// 1. Find all the topics and tasks taught in the month of October
db.tasks.aggregate([
  {
    $lookup: {
      from: "topics",
      localField: "topic_id",
      foreignField: "_id",
      as: "topic",
    },
  },
  {
    $match: {
      date: {
        $gte: ISODate("2023-10-01"),
        $lte: ISODate("2023-10-31"),
      },
    },
  },
]);

// 2. Find all the company drives which appeared between 15 Oct 2020 and 31 Oct 2020
db.company_drives.find({
  date: {
    $gte: ISODate("2020-10-15"),
    $lte: ISODate("2020-10-31"),
  },
});

// 3. Find all the company drives and students who appeared for the placement
db.company_drives.aggregate([
  {
    $lookup: {
      from: "attendance",
      localField: "_id",
      foreignField: "drive_id",
      as: "attendees",
    },
  },
]);

// 4. Find the number of problems solved by the user in codekata
db.codekata.aggregate([
  {
    $group: {
      _id: "$user_id",
      totalProblemsSolved: { $sum: "$problems_solved" },
    },
  },
]);

// 5. Find all the mentors with a mentee count more than 15
db.mentors.find({
  mentee_count: { $gt: 15 },
});

// 6. Find the number of users who were absent and the task was not submitted between 15 Oct 2020 and 31 Oct 2020
db.attendance.aggregate([
  {
    $match: {
      date: {
        $gte: ISODate("2020-10-15"),
        $lte: ISODate("2020-10-31"),
      },
      status: "absent",
    },
  },
  {
    $lookup: {
      from: "tasks",
      localField: "user_id",
      foreignField: "user_id",
      as: "task",
    },
  },
  {
    $match: {
      task: { $exists: false },
    },
  },
  {
    $count: "absentUsersWithNoTask",
  },
]);
