const _defaults = {
  contentType: 'application/x-www-form-urlencoded'
};

const _xhr = (httpMethod, url, callback, data, contentType) => {
  const contentTypeHeader = contentType || _defaults.contentType;
  const XHR = window.XMLHttpRequest || window.ActiveXObject;
  const request = new XHR('MSXML2.XMLHTTP.3.0');
  request.open(httpMethod, url, true);
  request.setRequestHeader('Content-Type', contentTypeHeader);
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      let result;
      try {
        result = JSON.parse(request.responseText);
      } catch (error) {
        result = request.responseText;
      }
      if (callback) callback(result, request);
    }
  };
  request.send(data);
};

const get = (url, callback) => {
  _xhr('GET', url, callback);
};

const post = (url, data, callback, contentType) => {
  _xhr('POST', url, callback, data, contentType);
};

const put = (url, callback, data, contentType) => {
  _xhr('PUT', url, callback, data, contentType);
};

const del = (url, callback) => {
  _xhr('DELETE', url, callback);
};

const convertObjectToFormDataString = (obj) => {
  let dataString = '';
  const keyArray = Object.keys(obj);
  const lastKeyIndex = keyArray.length - 1;

  keyArray.forEach((key, index) => {
    dataString += `${key}=${obj[key]}`;
    if (index < lastKeyIndex) dataString += '&';
  });

  return dataString;
};

export { get, post, put, del, convertObjectToFormDataString };
