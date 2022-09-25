const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const helmet = require('helmet')
const userRoutes = require('./Routes/users')
const authRoutes = require('./Routes/auth')
const postRoutes = require('./Routes/post')
const conversationRoutes = require('./Routes/conversation')
const messageRoutes = require('./Routes/messages')
const cors = require('cors');
const multer = require('multer')
const path = require('path')
const app = express()
dotenv.config()

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, }, () => {
    console.log("Connected to Database")
});

app.use("/images", express.static(path.join(__dirname, "public/images")))

app.use(morgan("dev"))
app.use(helmet())
app.use(express.json())
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({ storage })
app.post('/api/upload', upload.single("file"), (req, res) => {
    try {
        res.status(200).json("file uploaded sucessfully")
    } catch (err) {
        console.log(err)
    }
})

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/messages', messageRoutes)


const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log("Server is running...")
})