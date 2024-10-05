const express = require('express')
const parser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const LoginSignup = require('./routes/userRoute')

dotenv.config()

const port = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(parser.json())
app.use(cors())

app.use('/user', LoginSignup)

app.get('/test', async(req, res) => {
    try{
        res.json({message: 'API is working'})
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

try{
    const connectDb = async()=>{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Database connected')
    }
    connectDb()
} catch(err){
    console.log(err)
}