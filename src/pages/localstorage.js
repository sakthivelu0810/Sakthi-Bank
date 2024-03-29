// LocalStorageUtils.js
export const saveDataToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  export const getDataFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : '';
  };

  export const clearLocalStorage = () => {
    localStorage.clear();
  };

  // cookieUtils.js
export function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // Set expiration time
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}
export function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

  
  
  