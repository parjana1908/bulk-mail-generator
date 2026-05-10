const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json())

// mongodb connection
mongoose.connect("mongodb+srv://parjana:12345@cluster0.pufae47.mongodb.net/bulkmail?appName=Cluster0")
    .then(function () {
        console.log("Connected to db")
    })
    .catch(function (error) {
        console.log("Fail to connect")
        console.log(error)
    })

// model creation
const mail = mongoose.model("mail", new mongoose.Schema({
    user: String,
    pass: String
}), "mail")

const historyModel = mongoose.model("history", new mongoose.Schema({
    subject: String,
    message: String,
    totalEmails: Number,
    date: String
}), "history")

// Send Mail API
app.post("/sendmail", function (req, res) {

    var msg = req.body.msg
    var subject = req.body.subject
    var emailList = req.body.emailList

    mail.find()
        .then(function (data) {

            const transporter = nodemailer.createTransport({

                service: "gmail",

                auth: {

                    user: data[0].toJSON().user,
                    pass: data[0].toJSON().pass,

                },

            })

            return new Promise(async function (resolve, reject) {

                try {

                    for (var i = 0; i < emailList.length; i++) {

                        await transporter.sendMail({

                            from: "parjanabegam2003@gmail.com",

                            to: emailList[i],

                            subject: subject,

                            text: msg

                        })

                    }

                    resolve("Success")

                }

                catch (error) {

                    console.log(error)

                    reject("Failed")

                }

            })

        })

        .then(function () {

            var date = new Date()

            var historyEntry = new historyModel({
                subject: subject,
                message: msg,
                totalEmails: emailList.length,
                date: date.toLocaleDateString() + " " + date.toLocaleTimeString()
            })

            return historyEntry.save()

        })

        .then(function () {

            res.send(true)

        })

        .catch(function (error) {

            console.log(error)

            res.send(false)

        })

})

// History API
app.post("/history", function (req, res) {

    historyModel.find()
        .then(function (data) {

            res.send(data)

        })
        .catch(function (error) {

            console.log(error)

            res.send([])

        })

})

app.listen(3000, function () {

    console.log("Server Started...")

})