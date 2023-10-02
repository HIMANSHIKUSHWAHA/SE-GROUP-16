
var isAuthenticated = false;

export function setAuthenticationStat (val) {
    isAuthenticated = val;
}

export function authencationStat () {
    return isAuthenticated;
}