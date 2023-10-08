const redirectURI = "/v/auth/google";

const getGoogleAuthUrl = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `${process.env.SERVER_ROOT_URL}${redirectURI}`,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };
    const queryString = new URLSearchParams(options).toString();

    return `${rootUrl}?${queryString}`;
};

export default getGoogleAuthUrl;
