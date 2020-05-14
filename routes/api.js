/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
require("dotenv").config();

const CONNECTION_STRING = process.env.MONGO_URI;

module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING, function(err, client) {
        let db = client.db("apitest");
        db.collection("issueFiles").find({}).toArray(function(err,docs){res.json(docs)});
      });
    })

    .post(function(req, res) {
      var project = req.params.project;
      let issueFile = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        open: true,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      };

      if (
        issueFile["issue_title"] &&
        issueFile["issue_text"] &&
        issueFile["created_by"]
      ) {
        MongoClient.connect(CONNECTION_STRING, function(err, client) {
          if (!err) {
            console.log("Connection with Database Established.");
            let db = client.db("apitest");
            db.collection("issueFiles")
              .insertOne(issueFile)
              .then(result => {
                console.log("Successfully Uploaded!!");
              });
          } else {
            console.log("Error in Connecting to Database!!");
          }
        });
      }
    })

    .put(function(req, res) {
      var project = req.params.project;
      let issueStatus = true;
      if (req.body.open == "false") {
        issueStatus = false;
      }

      MongoClient.connect(CONNECTION_STRING, function(err, client) {
        if (err) {
          throw err;
        }
        let db = client.db("apitest");
        db.collection("issueFiles")
          .updateOne(
            { _id: ObjectId(req.body._id) },
            {
              $set: {
                issue_title: req.body.issue_title,
                issue_text: req.body.issue_text,
                updated_on: new Date(),
                created_by: req.body.created_by,
                assigned_to: req.body.assigned_to,
                status_text: req.body.status_text,
                open: issueStatus
              }
            }
          )
          .then(function(result) {
            console.log(
              "user's document updated successfully!!"
            );
          });
      });
    })

    .delete(function(req, res) {
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING, function(err, client) {
        let db = client.db("apitest");
        db.collection("issueFiles")
          .deleteOne({ _id: ObjectId(req.body._id) })
          .then(result => {
            console.log("user's documnet deleted successfully");
          });
      });
    });
};
