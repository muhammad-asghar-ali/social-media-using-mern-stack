export const LoginSart = (userCredentials) => ({
    type: "LOGIN_START",
})

export const LoginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user,
})

export const LoginFailure = () => ({
    type: "LOGIN_FAILURE",
})

export const follow = (userId) => ({
    type: "FOLLOW",
    payload: userId
})

export const unfollow = (userId) => ({
    type: "UNFOLLOW",
    payload: userId
})