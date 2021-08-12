"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCookie = exports.deleteAllCookies = exports.getCookie = exports.setCookie = exports.decipherJWT = exports.GlobalVariables = void 0;
const react_native_encrypted_storage_1 = __importDefault(require("react-native-encrypted-storage"));
class GlobalVariables {
}
exports.GlobalVariables = GlobalVariables;
const decipherJWT = function (token) {
    // @ts-ignore
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    // @ts-ignore
    return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
};
exports.decipherJWT = decipherJWT;
const setCookie = async function (name, token) {
    let decipheredJWT = await exports.decipherJWT(token);
    let expirationDate = decipheredJWT.alive_until;
    if (document !== undefined) {
        document.cookie = name + "=" + token + "; expires=" + expirationDate + ";samesite=strict;secure;";
    }
    else {
        try {
            await react_native_encrypted_storage_1.default.setItem(name, token);
        }
        catch (error) {
            console.log(error, 'error from set cookie cookie');
            return error;
        }
    }
};
exports.setCookie = setCookie;
const getCookie = async function (cname) {
    if (document !== undefined) {
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
    else {
        try {
            const session = await react_native_encrypted_storage_1.default.getItem(cname);
            if (session !== undefined) {
                return session;
            }
        }
        catch (error) {
            console.log(error, 'error from get cookie cookie');
            return error;
        }
    }
    return "";
};
exports.getCookie = getCookie;
const deleteAllCookies = async function () {
    if (document !== undefined) {
        let cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            let eqPos = cookie.indexOf("=");
            let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
    else {
        try {
            await react_native_encrypted_storage_1.default.clear();
        }
        catch (error) {
            console.log(error, 'error from delete all cookies');
            return error;
        }
    }
};
exports.deleteAllCookies = deleteAllCookies;
const deleteCookie = async function (name) {
    if (document !== undefined) {
        document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    }
    else {
        try {
            await react_native_encrypted_storage_1.default.removeItem(name);
        }
        catch (error) {
            console.log(error, 'error from delete cookie');
            return error;
        }
    }
};
exports.deleteCookie = deleteCookie;
