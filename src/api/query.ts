import axios from 'axios';

export const subscribe = async () => {
    return await axios
        .get('/api/sse/subscribe')
        .then(() =>{
            console.log('sse subscribe success');
        })
        .catch(error=>{
            console.error(error);
        })
}
