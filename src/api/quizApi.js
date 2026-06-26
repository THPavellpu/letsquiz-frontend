import api from "./axios";

export const createQuiz = (data) => {

    return api.post(
        "/quizzes/",
        data
    );

};

export const generateAiQuiz = (data) => {

    return api.post(
        "/quizzes/generate-ai/",
        data
    );

};



export const createQuestionWithOptions = (data) => {

    return api.post(
        "/quizzes/create-question-with-options/",
        data
    );

};


export const createQuestion = (data) => {

    return api.post(
        "/quizzes/questions/",
        data
    );

};


export const createOption = (data) => {

    return api.post(
        "/quizzes/options/",
        data
    );

};


export const joinQuiz = (data) => {

    return api.post(
        "/quizzes/join/",
        data
    );

};


export const getCurrentQuestion = (attemptId) => {

    return api.get(
        `/quizzes/attempt/${attemptId}/current-question/`
    );

};


export const submitAnswer = (data) => {

    return api.post(
        "/quizzes/submit-answer/",
        data
    );

};


export const nextQuestion = (data) => {

    return api.post(
        "/quizzes/attempt/next-question/",
        data
    );

};


export const skipQuestion = (data) => {

    return api.post(
        "/quizzes/attempt/skip-question/",
        data
    );

};


export const finishQuiz = (data) => {

    return api.post(
        "/quizzes/finish/",
        data
    );

};


export const getAttemptStatus = (attemptId) => {

    return api.get(
        `/quizzes/attempt/${attemptId}/status/`
    );

};

export const getAttemptResult = (attemptId) => {

    return api.get(`/quizzes/attempt-result/${attemptId}/`);

};


export const getLeaderboard = (quizId) => {

    return api.get(
        `/quizzes/${quizId}/leaderboard/`
    );

};
export const getDashboard = (quizId) => {

    return api.get(
        `/quizzes/${quizId}/dashboard/`
    );

};

export const getAnalytics = (quizId) => {

    return api.get(
        `/quizzes/${quizId}/analytics/`
    );

};

export const getQuizSummary = (quizId) => {

    return api.get(
        `/quizzes/${quizId}/summary/`
    );

};


export const getCreatorDashboard = () => {

    return api.get(
        "/quizzes/my-dashboard/"
    );

};

export const getMyPerformance = () => {

    return api.get(
        "/quizzes/my-performance/"
    );

};

export const getMyLeaderboards = () => {

    return api.get(
        "/quizzes/my-leaderboards/"
    );

};




