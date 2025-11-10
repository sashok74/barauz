/**
 * Mock Service Worker (2.6.5).
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = '26357c79639bfa20d64c0efca2a87423';
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse');
const activeClientIds = new Set();

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', async function (event) {
  const clientId = event.source.id;

  if (!clientId || !event.data) {
    return;
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  });

  switch (event.data) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(clientId, {
        type: 'KEEPALIVE_RESPONSE',
      });
      break;
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(clientId, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: INTEGRITY_CHECKSUM,
      });
      break;
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId);

      sendToClient(clientId, {
        type: 'MOCKING_ENABLED',
        payload: true,
      });
      break;
    }

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId);
      break;
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId);

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId;
      });

      if (remainingClients.length === 0) {
        self.registration.unregister();
      }

      break;
    }
  }
});

self.addEventListener('fetch', function (event) {
  const { request } = event;

  if (request.mode === 'navigate') {
    return;
  }

  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return;
  }

  if (activeClientIds.size === 0) {
    return;
  }

  const requestId = crypto.randomUUID();

  event.respondWith(
    handleRequest(event, requestId).catch((error) => {
      if (request.mode === 'cors') {
        console.error(
          `\
[MSW] Failed to mock a request to "%s" (%s).
`,
          request.url,
          error.message
        );

        return passthrough(request);
      }

      throw error;
    })
  );
});

async function handleRequest(event, requestId) {
  const client = await event.target.clients.get(event.clientId);

  if (!client) {
    return passthrough(event.request);
  }

  const requestClone = event.request.clone();
  const getOriginalResponse = () => passthrough(event.request);

  sendToClient(client.id, {
    type: 'REQUEST',
    payload: {
      id: requestId,
      url: requestClone.url,
      method: requestClone.method,
      headers: Object.fromEntries(requestClone.headers.entries()),
      cache: requestClone.cache,
      mode: requestClone.mode,
      credentials: requestClone.credentials,
      destination: requestClone.destination,
      integrity: requestClone.integrity,
      redirect: requestClone.redirect,
      referrer: requestClone.referrer,
      referrerPolicy: requestClone.referrerPolicy,
      body: await requestClone.text(),
      keepalive: requestClone.keepalive,
    },
  });

  const responseMessage = await new Promise((resolve) => {
    self.addEventListener('message', function handler(event) {
      if (event.data?.type !== 'RESPONSE' || event.data.payload.id !== requestId) {
        return;
      }

      self.removeEventListener('message', handler);
      resolve(event.data);
    });
  });

  if (responseMessage.payload.type === 'MOCK_NOT_FOUND') {
    return getOriginalResponse();
  }

  return respondWithMock(responseMessage.payload);
}

function sendToClient(clientId, message) {
  return self.clients.get(clientId).then((client) => {
    if (!client) {
      return;
    }

    return client.postMessage(message);
  });
}

function passthrough(request) {
  const headers = Object.fromEntries(request.headers.entries());

  delete headers['x-msw-intention'];

  return fetch(request, { headers });
}

async function respondWithMock(response) {
  const responseConstructor = Response;

  const mockedResponse = new responseConstructor(response.body, response);

  Reflect.defineProperty(mockedResponse, IS_MOCKED_RESPONSE, {
    value: true,
    enumerable: true,
  });

  return mockedResponse;
}
