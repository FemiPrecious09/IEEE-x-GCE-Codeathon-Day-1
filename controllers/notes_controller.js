const { notes } = require("../db/database")
const crypto = require("crypto")


const addNote = (req,res)=>{
 const {title,body} = req.body
 const newnote = {
  "id": crypto.randomUUID(),
  "title": title,
  "body": body,
  "createdAt": new Date(),
  "updatedAt": new Date()
 }
 notes.push(newnote)
 res.status(201).json(newnote) // Every Endpoint that returns a body should have a json
}

const getNoteId = (req,res)=>{
 const id = req.params.id
 const checkId = notes.find(note => note.id === id)
 if(!checkId){
  return res.status(404).send("Note Id not found")
 }
 res.status(200).json(checkId)
}

const getNote = (req,res)=>{
 const page = parseInt(req.query.page,10) || 1
 const limit = parseInt(req.query.limit,10) || 10
 const sort = req.query.sort
 let newNotes = [...notes]
 if(sort){
  const howSort = ["title","newest","lastupdated"]
  if(!howSort.includes(sort)){
   return res.status(400).send("Sort not found")
  }else if(sort === "title"){
   newNotes.sort((a,b) => b.title.localeCompare(a.title))
  }else if(sort === "newest"){
   newNotes.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  }else{
   newNotes.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }
 }
 const startIndex = (page -1) * limit
 const endIndex = page * limit

 const note = newNotes.slice(startIndex,endIndex)
 res.status(200).json(note)
}

const replaceNote = (req,res)=>{
 const id = req.params.id
 const idIndex = notes.findIndex(note => note.id === id)
 if(idIndex === -1){
  return res.status(404).send("Note not found. Create a new Note")
 }
 const {title,body} = req.body
 notes[idIndex] = {
  "id": id,
  "title": title,
  "body": body,
  "createdAt":notes[idIndex].createdAt,
  "updatedAt": new Date()
 }
 res.status(200).json(notes[idIndex])
}

const updateNote = (req,res)=>{
 const id = req.params.id
 const idIndex = notes.findIndex(note => note.id === id) //findIndex returns -1 if there is no matching index
 if(idIndex === -1){
  return res.status(404).send("Note not found. Create a new Note")
 }
 const {title,body} = req.body
 if (title !==undefined) notes[idIndex].title = title
 if (body !== undefined) notes[idIndex].body = body
 notes[idIndex].updatedAt = new Date()

 res.status(200).json(notes[idIndex])
}

const delNote = (req,res)=>{
 const id = req.params.id
 const idIndex = notes.findIndex(note => note.id === id)
 if(idIndex === -1){
  return res.status(404).send("Note Id not found")
 }

 notes.splice(idIndex,1)
 res.status(204).end()
}


module.exports = {getNote,addNote,getNoteId,replaceNote, updateNote, delNote}