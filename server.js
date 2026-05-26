require("dotenv").config()
const express = require("express")
const app = express()

app.use(express.json())

app.use((req,res,next)=>{
 const start =  Date.now()
 res.on("finish", ()=>{
  const finish =  Date.now() - start
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${finish}`)
 })
 next()
})

const noteRoute = require("./routes/notes")

app.use("/notes", noteRoute)

app.use((req,res)=>{
 res.status(404).send("Route not found")
}) // 404 before Error


app.use((err,req,res,next)=>{
 console.log(err.stack)
 res.status(500).send("Error in the server")
})


const PORT = process.env.ACTIVE_PORT || 3500
app.listen(PORT,()=>{
 console.log(`Server is ACTIVE🔥🔥 on http://localhost:${PORT}`)
})