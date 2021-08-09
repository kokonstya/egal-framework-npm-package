import CookieManager from '@react-native-cookies/cookies';

const BASE_URL = 'your_base_url';

export class GlobalVariables {
  public static socketBaseUrl: string;
  public static httpBaseUrl: string;
  public static authBaseUrl: string;
  public static tokenUST: string;
  public static tokenUMT: string;
}

export const decipherJWT = function (token:string) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  // @ts-ignore
  return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
};

export const setCookie = async function(name:string, token:string) {
  let decipheredJWT = await decipherJWT(token)
  let expirationDate = decipheredJWT.alive_until
  await CookieManager.set(BASE_URL, {
    name,
    value: token,
    expires: expirationDate,
    secure: true
  }).catch(rej => {
      console.log("setCookie Reject: ", rej)
  })
};

export const getCookie = function (cname: string) {
  CookieManager.get(BASE_URL).then((cookies) => {
    return JSON.stringify(cookies[cname])
  }).catch((rej) => {
      console.log("getCookies Reject: ", rej)
      return ""
  })
  return "";
};

export const deleteAllCookies = function () {
  CookieManager.clearAll().then(res => {
      console.log("deleteAllCookies Resolve: ", res)
  }).catch(rej => {
      console.log("deleteAllCookies Reject: ", rej)
  })
}

export const deleteCookie = function (name:string) {
    CookieManager.set(BASE_URL, {
        name,
        value: "",
        expires: "1970-01-01T00:00:01.000Z"
    }).catch(rej => {
        console.log('deleteCookie Reject: ', rej)
    })
}
