import axios from 'axios'; 

export const clientURL = 'http://localhost:3000'

export default axios.create({
    baseURL: 'http://localhost:8080'
}); 