"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCookie = exports.deleteAllCookies = exports.getCookie = exports.setCookie = exports.decipherJWT = exports.GlobalVariables = void 0;
const MMKVStorage_1 = __importDefault(require("./MMKVStorage"));
class GlobalVariables {
}
exports.GlobalVariables = GlobalVariables;
const decipherJWT = function (token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    // @ts-ignore
    return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
};
exports.decipherJWT = decipherJWT;
const setCookie = async function (name, token, environment) {
    if (environment === 'vue') {
        let decipheredJWT = await (0, exports.decipherJWT)(token);
        let expirationDate = decipheredJWT.alive_until;
        document.cookie = name + "=" + token + "; expires=" + expirationDate + ";samesite=strict;secure;";
    }
    else if (environment === 'react-native') {
        try {
            MMKVStorage_1.default.set(name, token);
        }
        catch (error) {
            console.log(error, 'error from setCookie');
        }
    }
};
exports.setCookie = setCookie;
const getCookie = function (cname, environment) {
    console.log(cname, environment, 'props from getCookie');
    if (environment == ' vue') {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieParts = decodedCookie.split(';');
        for (let i = 0; i < cookieParts.length; i++) {
            let part = cookieParts[i];
            while (part.charAt(0) == ' ') {
                part = part.substring(1);
            }
            if (part.indexOf(name) == 0) {
                return part.substring(name.length, part.length);
            }
        }
    }
    else if (environment === 'react-native') {
        if (cname !== undefined) {
            try {
                console.log(MMKVStorage_1.default.getString(cname));
            }
            catch (error) {
                console.log(error, 'error from getCookie');
                console.log(cname, 'cname from getCookie');
            }
        }
    }
    return "";
};
exports.getCookie = getCookie;
const deleteAllCookies = function () {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
};
exports.deleteAllCookies = deleteAllCookies;
const deleteCookie = function (name, environment) {
    if (environment === 'vue') {
        document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    }
    else if (environment === 'react-native') {
        try {
            MMKVStorage_1.default.delete(name);
        }
        catch (error) {
            console.log(error, 'error from deleteCookie');
        }
    }
};
exports.deleteCookie = deleteCookie;
