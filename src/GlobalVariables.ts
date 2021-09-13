import storage from './MMKVStorage';
import jwtDecode from "jwt-decode";

export class GlobalVariables {
  public static socketBaseUrl: string;
  public static httpBaseUrl: string;
  public static authBaseUrl: string;
  public static tokenUST: string;
  public static tokenUMT: string;
  public static environment: string;
}

export const decipherJWT = function (token: string) {
  if (GlobalVariables.environment === 'vue') {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    // @ts-ignore
    return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
  } else if (GlobalVariables.environment === 'react-native') {
    return jwtDecode(token);
  }
};

export const setCookie = async function (name: string, token: string) {
  if (GlobalVariables.environment === 'vue') {
    let decipheredJWT = await decipherJWT(token)
    let expirationDate = decipheredJWT.alive_until
    document.cookie = name + "=" + token + "; expires=" + expirationDate + ";samesite=strict;secure;"
  } else if (GlobalVariables.environment === 'react-native') {
    try {
      storage.set(name, token);
    } catch (error) {
      console.log(error, 'error from setCookie');
    }
  }
};

export const getCookie = function (cname: string) {
  if (GlobalVariables.environment === ' vue') {
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
  } else if (GlobalVariables.environment === 'react-native') {
    if (cname !== undefined) {
      try {
        return storage.getString(cname);
      } catch (error) {
        console.log(error, 'error from getCookie');
        console.log(cname, 'cname from getCookie');
      }
    }
  }
  return "";
};

export const deleteAllCookies = function () {
  if (GlobalVariables.environment === 'vue') {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  } else if (GlobalVariables.environment === 'react-native'){
    let data = storage.getAllKeys();
    for (let i of data){
      storage.delete(i);
    }
  }
}

export const deleteCookie = function (name: string) {
  if (GlobalVariables.environment === 'vue') {
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
  } else if (GlobalVariables.environment === 'react-native') {
    try {
      storage.delete(name);
    } catch (error) {
      console.log(error, 'error from deleteCookie')
    }
  }
}
