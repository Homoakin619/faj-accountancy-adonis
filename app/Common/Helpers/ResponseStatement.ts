type ResponseBodyType = {
    body?: any[] | null,
    message?: string,
    status: number
}

export const ResponseBody = ({body,message,status}: ResponseBodyType) => {
    return {
        body: body || [],
        message: message || "",
        status: status
    }
}

export default function returnStatement({response,body,message,status}: ResponseBodyType & {response: any}) {
    return response.status(status).send(ResponseBody({
        body,message,status
    }))
}