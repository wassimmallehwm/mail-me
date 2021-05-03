const prod = {
    prod: true,
    apiUrl: "/api/",
    socketUrl: "/",
    publicUrl: "/public/"
};
const dev = {
    prod: false,
    apiUrl: "http://localhost:4000/api/",
    socketUrl: "ws://localhost:4000",
    publicUrl: "http://localhost:4000/public/"
};
const  config = process.env.NODE_ENV === 'development' ? dev : prod;
export default config;