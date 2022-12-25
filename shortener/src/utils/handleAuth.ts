import { CLIENT_ID, CLIENT_SECRET } from "$lib/variables";
import { userSt } from "../stores";

interface UserProfile {
    login: string,
    id: number,
    node_id: string,
    avatar_url: string,
    gravatar_id: string,
    url: string,
    html_url: string,
    followers_url: string,
    following_url: string,
    gists_url: string,
    starred_url: string,
    subscriptions_url: string,
    organizations_url: string,
    repos_url: string,
    events_url: string,
    received_events_url: string,
    type: string,
    site_admin: boolean,
    name: string,
    company: null,
    blog: string,
    location: string,
    email: null,
    hireable: null,
    bio: string,
    twitter_username: string,
    public_repos: number,
    public_gists: number,
    followers: number,
    following: number,
    created_at: string,
    updated_at: string
}

interface AccessTokenObject {
    access_token: string,
}

export async function handleAuth() {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (!code) return;

    // remove code from URL without reloading page
    params.delete('code');
    const newUrl = new URL(location.href);
    newUrl.search = params.toString();
    history.pushState({}, "", newUrl);

    // retrieve access token
    const workerResponse = await fetch('/api/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ code })
    });

    const accessTokenObject = await workerResponse.json() as AccessTokenObject;

    const userProfileResponse = await fetch('https://api.github.com/user', {
        headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${accessTokenObject.access_token}`
        }
    });

    const { name, login } = await userProfileResponse.json() as UserProfile;
    userSt.set({ name, login });
}