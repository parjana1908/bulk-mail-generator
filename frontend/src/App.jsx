import { useState } from 'react'
import './index.css'
import axios from 'axios'
import * as XLSX from "xlsx"

function App() {

  const [subject, setSubject] = useState("")
  const [msg, setMsg] = useState("")
  const [status, setStatus] = useState(false)
  const [emailList, setEmailList] = useState([])
  const [historyData, setHistoryData] = useState([])

  // Subject
  function sub(evt) {

    setSubject(evt.target.value)

  }

  // Message
  function msgbody(evt) {

    setMsg(evt.target.value)

  }

  // Send Mail
  function send() {

    if (subject === "" || msg === "" || emailList.length === 0) {

      alert("Please fill all fields")

      return

    }

    setStatus(true)

   axios.post("https://bulk-mail-generator-1.onrender.com", {
      msg: msg,
      subject: subject,
      emailList: emailList

    })

      .then(function (data) {

        if (data.data === true) {

          alert("Email Sent Successfully")

          setStatus(false)

          setSubject("")
          setMsg("")
          setEmailList([])

        }
        else {

          alert("Failed To Send")

          setStatus(false)

        }

      })

      .catch(function (error) {

        console.log(error)

        alert("Server Error")

        setStatus(false)

      })

  }

  // View History
  function history() {

axios.post("https://bulk-mail-generator-1.onrender.com")

      .then(function (data) {

        setHistoryData(data.data)

      })

      .catch(function (error) {

        console.log(error)

        alert("Failed To Fetch History")

      })

  }

  // File Upload
  function file(evt) {

    const file = evt.target.files[0]

    const reader = new FileReader()

    reader.onload = function (evt) {

      const data = evt.target.result

      const workbook = XLSX.read(data, {
        type: 'binary'
      })

      const SheetName = workbook.SheetNames[0]

      const worksheet = workbook.Sheets[SheetName]

      const emailList = XLSX.utils.sheet_to_json(
        worksheet,
        { header: 'A' }
      )

      const totalEmail = emailList.map(function (item) {

        return item.A

      })

      setEmailList(totalEmail)

    }

    reader.readAsBinaryString(file)

  }

  return (

    <>

      {/* Header */}
      <div className="bg-blue-600 shadow-2xl">

        <h1 className="text-white text-4xl font-extrabold text-center py-5 tracking-wide">

          Bulk Mail Sending App

        </h1>

      </div>

      {/* Banner */}
      <div className="bg-blue-500 p-6 tracking-wide shadow-lg">

        <h1 className="text-white text-3xl font-bold mb-2">

          Send Bulk Email

        </h1>

        <p className="text-white text-lg">

          Compose your email and send it to multiple recipients at once.

        </p>

      </div>

      {/* Main */}
      <div className="bg-gray-100 min-h-screen p-8">

        <div className="bg-white max-w-3xl mx-auto p-8 rounded-2xl shadow-2xl flex flex-col gap-5">

          {/* Subject */}
          <div>

            <h1 className="text-xl font-semibold mb-2 tracking-wide">

              Subject

            </h1>

            <input
              type="text"
              value={subject}
              onChange={sub}
              placeholder="Enter email subject"
              className="border border-gray-300 rounded-lg outline-none p-3 w-full focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Message */}
          <div>

            <h1 className="text-xl font-semibold mb-2 tracking-wide">

              Message Body

            </h1>

            <textarea
              rows="6"
              value={msg}
              onChange={msgbody}
              placeholder="Write your message..."
              className="border border-gray-300 rounded-lg outline-none p-3 w-full focus:ring-2 focus:ring-blue-500"
            ></textarea>

          </div>

          {/* File Upload */}
          <div>

            <h1 className="text-xl font-semibold mb-2 tracking-wide">

              Upload Email List

            </h1>

            <input
              type="file"
              onChange={file}
              className="border-2 border-dotted border-gray-300 rounded-lg p-6 w-full text-center"
            />

          </div>

          {/* Total Emails */}
          <div className="font-medium text-center text-lg">

            Total Emails In File: {emailList.length}

          </div>

          {/* Buttons */}
          <div className="flex justify-center items-center gap-4 mt-4">

            <button
              onClick={send}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 cursor-pointer"
            >

              {status ? "Sending..." : "Send Email"}

            </button>

            <button
              onClick={history}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3
               rounded-lg shadow-lg transition duration-300 cursor-pointer"
            >

              View History

            </button>

          </div>

        </div>

        {/* History Section */}
        {

          historyData.length > 0 && (

            <div className="max-w-4xl mx-auto mt-10">

              <h1 className="text-3xl font-bold text-center mb-6">

                Email History

              </h1>

              <div className="flex flex-col gap-5">

                {

                  historyData.map(function (item, index) {

                    return (

                      <div
                        key={index}
                        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
                      >

                        <h1 className="text-2xl font-bold mb-3 text-blue-700">

                          {item.subject}

                        </h1>

                        <p className="mb-2">

                          <span className="font-semibold">

                            Message:

                          </span>

                          {" "}
                          {item.message}

                        </p>

                        <p className="mb-2">

                          <span className="font-semibold">

                            Total Emails:

                          </span>

                          {" "}
                          {item.totalEmails}

                        </p>

                        <p className="mb-2">

                          <span className="font-semibold">

                            Date:

                          </span>

                          {" "}
                          {item.date}

                        </p>

                      </div>

                    )

                  })

                }

              </div>

            </div>

          )

        }

      </div>

    </>

  )

}

export default App