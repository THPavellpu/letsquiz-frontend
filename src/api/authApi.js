import api from "./axios";


export const loginUser = (data) => {

    return api.post(
        "/auth/login/",
        data
    );

};


export const registerUser = (data) => {

    return api.post(
        "/auth/register/",
        data
    );

};


export const getProfile = () => {

    return api.get(
        "/auth/profile/"
    );

};

export const getProfileStats = () => {

    return api.get(
        "/auth/profile-stats/"
    );

};



export const logoutUser = () => {

    const refresh = localStorage.getItem(
        "refresh"
    );

    return api.post(
        "/quizzes/logout/",
        {
            refresh
        }
    );

};

export const forgotPassword = (data) => {

    return api.post(
        "/auth/forgot-password/",
        data
    );

};

export const resetPassword = (uid, token, data) => {

    return api.post(
        `/auth/reset-password/${uid}/${token}/`,
        data
    );

};

export const resendVerification = (data) => {

    return api.post(
        "/auth/resend-verification/",
        data
    );

};