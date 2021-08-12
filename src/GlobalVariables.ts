import EncryptedStorage from 'react-native-encrypted-storage';

export class GlobalVariables {
  public static socketBaseUrl: string;
  public static httpBaseUrl: string;
  public static authBaseUrl: string;
  public static tokenUST: string;
  public static tokenUMT: string;
}

export const decipherJWT = function (token:string | Promise<any>) {
  // @ts-ignore
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  // @ts-ignore
  return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
};

export const setCookie = async function(name:string, token:string) {
  let decipheredJWT = await decipherJWT(token)
  let expirationDate = decipheredJWT.alive_until
  if(document !== undefined) {
    document.cookie = name + "=" + token + "; expires=" + expirationDate + ";samesite=strict;secure;"
  } else {
    try {
      await EncryptedStorage.setItem(name, token);
    } catch (error) {
      console.log(error, 'error from set cookie cookie')
      return error
    }
  }
};

export const getCookie = async function (cname: string) {
  if(document !== undefined) {
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
  } else {
    try {
      const session = await EncryptedStorage.getItem(cname);
      if (session !== undefined) {
        return session
      }
    } catch (error) {
      console.log(error, 'error from get cookie cookie')
      return error
    }
  }

  return "";
};

export const deleteAllCookies = async function () {
  if(document !== undefined) {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  } else {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.log(error, 'error from delete all cookies')
      return error
    }
  }

}

export const deleteCookie = async function (name:string) {
  if (document !== undefined) {
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
  } else {
    try {
      await EncryptedStorage.removeItem(name);
    } catch (error) {
      console.log(error, 'error from delete cookie')
      return error
    }
  }

}
