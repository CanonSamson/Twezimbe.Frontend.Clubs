export const groupBaseUrl = (groupId: string, channelId: string) => {
    // Check if running on the client (window is available)
    if (typeof window !== "undefined") {
        const screenWidth = window.innerWidth;
        console.log("Screen width:", screenWidth);

        // Example: conditional navigation based on screen width
        if (screenWidth < 768) {
            // Mobile-specific logic (optional)
            console.log("Navigating on mobile");

            return `/groups/${groupId}`
        }

        return `/groups/${groupId}/${channelId}`
    }
    return `/groups/${groupId}/${channelId}`
}