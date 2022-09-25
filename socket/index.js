const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost/3000",
    },
})

let users = []

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
        users.push({ userId, socketId })
    io.emit("getUsers", users)
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.filter(user => user.userId === userId)
}

io.on("connection", (socket) => {
    console.log("a user connected")
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id)
    })

    // set and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId)
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text
        })
    })


    // disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected")
        removeUser(socket.id)
        addUser(userId, socket.id)
    })
})