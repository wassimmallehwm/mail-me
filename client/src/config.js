const prod = {
    apiUrl: "/api/",
    publicUrl: "/public/"
};
const dev = {
    apiUrl: "http://localhost:4000/api/",
    publicUrl: "http://localhost:4000/public/"
};
const  config = process.env.NODE_ENV === 'development' ? dev : prod;
export default config;