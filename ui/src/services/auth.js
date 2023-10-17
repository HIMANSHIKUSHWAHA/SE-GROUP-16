
var isAuthenticated = false;

export function setAuthenticationStat (val) {
    isAuthenticated = val;
}

export function authencationStat () {
    if (localStorage.getItem("token") === null){
        return false;
    }else{
        return true;
    }
    // return isAuthenticated;
}