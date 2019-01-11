const config = _ => {
    switch (process.env.REACT_APP_ENV) {
        case 'production':
            return {
                api: "https://www.artacts.org/member-api"
            }
        default:
            return {
                api: "http://127.0.0.1:8000"
            }
    }
}

export default config;