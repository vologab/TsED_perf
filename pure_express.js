"use strict";
const express = require("express");
const {applyBefore} = require("ts-express-decorators/lib/core/utils");
const {$log} = require("ts-log-debug");
const app = express();
let AUTO_INCREMENT_ID = 1;

/**
 *
 * @param request
 * @param propertySelector
 * @returns {function(any=)}
 */
function stringify(request, propertySelector) {
  return (scope = {}) => {
    if (typeof scope === "string") {
      scope = {message: scope};
    }

    scope = Object.assign(scope, propertySelector(request));

    if (process.env.NODE_ENV !== "production") {
      return JSON.stringify(scope, null, 2);
    }
    return JSON.stringify(scope);
  };
}

/**
 *
 * @param request
 * @returns {{reqId: string, method: *, url: *, duration: number, headers: *, body: *, query: *, params: *}}
 */
function requestToObject(request) {
  return {
    reqId: request.id,
    method: request.method,
    url: request.originalUrl || request.url,
    duration: getDuration(request),
    headers: request.headers,
    body: request.body,
    query: request.query,
    params: request.params
  };
}

/**
 * Return a filtered request from global configuration.
 * @param request
 * @returns {Object}
 */

function minimalRequestPicker(request) {
  const info = requestToObject(request);

  return [
    "reqId",
    "method",
    "url",
    "duration"
  ].reduce((acc, key) => {
    acc[key] = info[key];
    return acc;
  }, {});
}

function configureRequest(request) {
  request.id = String(request.id ? request.id : AUTO_INCREMENT_ID++);
  request.tagId = `[#${request.id}]`;
  request.tsedReqStart = new Date();

  const verbose = (req) => requestToObject(req);
  const info = (req) => minimalRequestPicker(req);
  request.log = {
    info: (obj) => setImmediate(() => console.log(stringify(request, info)(obj))),
    debug: (obj) => {
    }
  };
}

function getDuration(request) {
  return new Date().getTime() - request.tsedReqStart.getTime();
}

function headersSent(res) {
  return typeof res.headersSent !== "boolean"
    ? Boolean(res._header)
    : res.headersSent;
}


function onLogEnd(request, response) {
  /* istanbul ignore else */
  if (request.id) {
    // request.log.info({status: response.statusCode});

    if (false) {
      request.log.debug({status, data: request.getStoredData && request.getStoredData()});
    }
    cleanRequest(request);
  }
}

/**
 *
 * @param request
 */
function cleanRequest(request) {
  setImmediate(() => {
    delete request.id;
    delete request.tagId;
    delete request.tsedReqStart;
    request.log = {
      info: () => {
      },
      debug: () => {
      },
      warn: () => {
      },
      error: () => {
      },
      trace: () => {
      }
    };
  });
}

function log(request, o = {}) {
  if (request.tagId) {

  }
}

function buildNext(request, response, next) {
  return (error) => {
    // try {
    next.isCalled = true;
    if (response.headersSent) {
      return;
    }

    /* istanbul ignore else */
    log(request, {event: "invoke.end", error});
    return next(error);
    /*} catch (er) {
      er.originalError = error;
      return next(er);
    }*/
  };
}

function invoke(handler, locals) {
  const {next, request, response} = locals;
  next.isCalled = false;

  locals.next = buildNext(request, response, next);
  log(request, {event: "invoke.start"});

  const parameters = localsToParams(locals);
  Promise.resolve()
    .then(() => (handler)(...parameters))
    .then((result) => {
      if (!next.isCalled) {

        if (result !== undefined) {
          locals.request.storeData(result);
        }

        if (handler.length !== 3) {
          locals.next();
        }
      }
    })
    .catch((err) => {
      locals.next(err);
    });
}

function localsToParams(locals) {

  //if (false) {
  //return getInjectableParameters(locals);
  //}

  let parameters = [locals.request, locals.response];

  //if (false) {
  //  parameters.unshift(locals.err);
  //}

  //if (true) {
  parameters.push(locals.next);
  //}

  return parameters;
}

function wrapper(middleware) {
  return (request, response, next) => invoke(middleware, {request, response, next});
}

function onLogStart(request) {
  request.log.debug({event: "start"});
}

function xwrapper(d) {
  return d;
}

app.use(wrapper((request, response, next) => {
  configureRequest(request);
  onLogStart(request);
  applyBefore(response, "end", () => onLogEnd(request, response));
  next();
}));

app.get("/",
  wrapper((request, response, next) => {
    /* istanbul ignore else */
    request.setEndpoint({endpoint: "endpoint"});
    next();
  }),
  wrapper(() => {
    return "Hello world";
  }),

  wrapper((request, response, next) => {
    const data = request.getStoredData();
    const type = typeof data;

    if (data !== undefined) {
      if (data === null || ["number", "boolean", "string"].indexOf(type) > -1) {
        response.send(String(data));
      } else {
        // response.json(this.converterService.serialize(data));
      }
    }

  })
);

app.listen(8080);


Object.defineProperty(express.request, "setEndpoint", {
  value: function (endpoint) {
    this._endpoint = endpoint;
  }
});

Object.defineProperty(express.request, "getEndpoint", {
  value: function () {
    return this._endpoint;
  }
});
Object.defineProperty(express.request, "storeData", {
  value: function (data) {
    this._responseData = data;
    return this;
  }
});

Object.defineProperty(express.request, "getStoredData", {
  value: function () {
    return this._responseData;
  }
});
