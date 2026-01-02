export const setMeetingParams = (
    rootToken: string,
    roomName: string,
    jitsiServerUrl?: string,
) => {
    if (rootToken && roomName) {
            const credentials: Record<string, any> = {
                    updRootToken: rootToken,
                    updRoomName: roomName
            };

            if (jitsiServerUrl) {
                credentials.jitsiServerUrl = jitsiServerUrl;
            }

            // Convert the credentials object to a JSON string
            const credentialsString = JSON.stringify(credentials);

            // Store the JSON string in session storage
            sessionStorage.setItem('updRoomCredentials', credentialsString);

            console.log('Credentials stored in session storage.');

    } else {
            console.error('Invalid rootToken or roomName provided.');
    }
}