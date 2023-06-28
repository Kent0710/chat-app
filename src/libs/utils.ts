export function fetchOriginHost() {
    const originHost = process.env.NEXT_PUBLIC_IP_ORIGIN;
    
    if (originHost !== undefined) {
        return `http://${originHost}:3000/`
    } else {
        return "error"
    }
}