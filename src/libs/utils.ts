export function fetchOriginHost() {
    const originHost = process.env.NEXT_PUBLIC_IP_ORIGIN;
    
    if (originHost !== undefined) {
        return `https://chat-app-tan-seven.vercel.app/`
    }
}