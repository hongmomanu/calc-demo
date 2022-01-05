
export function httpPost({url,params}){
    return fetch(url,{
        'method':'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, 
    body: JSON.stringify(params)})
}