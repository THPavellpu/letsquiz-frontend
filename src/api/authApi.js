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