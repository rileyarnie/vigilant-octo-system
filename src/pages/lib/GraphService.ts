/* eslint-disable @typescript-eslint/no-explicit-any */
import * as graph from '@microsoft/microsoft-graph-client';

export const getAuthenticatedClient = (accessToken: any) => {
    const client = graph.Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        }
    });
    return client;
};

export const getUserDetails = async (accessToken: any) => {
    const client = getAuthenticatedClient(accessToken);
    const user = await client.api('/me').get();
    return user;
};
