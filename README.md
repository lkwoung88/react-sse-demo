# Server-Sent Events
* 서버로부터 이벤트 수신
* 단방향 통신
* 끊기기 전까지 `handshake`가 `1`번 일어난다. (지속적인 이벤트 메시지에 대해 추가적인 `handshake` 불필요)
* 연결 끊기면 재연결 시도한다.
* `HTTP/1` 에서는 브라우저 당 6개의 연결로 설정되어 있다. (도메인 별로 적용)
* `HTTP/2` 에서는 서버와 클라이언트 간에 설정으로 연결 수를 조절할 수 있고, 기본값은 `100`이다.
* 이벤트 스트림은 `UTF-8` 형식을 사용한 텍스트 데이터이다.

``` http
-- Request Headers

GET /api/sse/subscribe HTTP/1.1
Accept: text/event-stream
... 생략 ...
Connection: keep-alive
Host: localhost:9000 
Referer: http://localhost:9000/
... 생략 ...

-- Response Headers

HTTP/1.1 200 OK
... 생략 ...
content-type: text/event-stream 
transfer-encoding: chunked
```
* `content-type`을 `text/event-stream`으로 설정.
``` HTTP
event:open
id:open-1
data:SSE connected
retry:1000

event:event
id:event-1
retry:1000
data:{"id":15623,"content":"msg = 15623","registerDate":"2024-07-30T22:50:06"}
```
* 첫번째 문자가 `:` 인 경우 주석으로 무시한다.
* 수신된 메시지는 `event`, `data`, `id`, `retry`와 같은 필드를 포함한다.
* `event` : 이벤트의 유형을 식별.
* `data` : 메시지의 데이터 필드.
* `id` : 객체의 마지막 이벤트 ID 값을 설정하는 이벤트 ID.
* `retry` : 재연결 시간, 서버와의 연결이 끊어지면 브라우저는 재연결을 시도하기 전에 지정된 시간을 기다린다. (밀리초, 정수값)
---
# EventSource 인스턴스

1. 서버와 연결하여 이벤트를 수신하기 위해서 `EventSource` 객체를 생성한다.
``` ts
const eventSource = new EventSource(requestUrl + '/sse/subscribe');
```

2. `message` 이벤트를 수신한다. 이벤트 필드를 통해서 여러종류의 이벤트 메시지를 처리할 수 있으며, 이벤트 필드가 없는 메시지는 `message` 이벤트 핸들러를 통해서 처리할 수 있다.
``` ts
eventSource.addEventListener("event", async function (event) {
	const res = JSON.parse(event.data);
	console.log('Receive Msg =', res);
	setMessages((prevMessages) => [...prevMessages, res.content]);
});

eventSource.onmessage = (event) => {  
    const res = event.data;  
    console.log('Received message:', res);  
};
```

3. 네트워크 타임아웃 , CORS 등의 문제가 발생했을 때에는 에러 이벤트 콜백함수를 사용해서 처리할 수 있다.
``` ts
eventSource.onerror = (error) => {
	console.error('EventSource failed:', error);
};
```

4. 서버 간의 연결을 닫기위해서 `.close()` 메서드를 사용한다.
``` ts
eventSource.close();
```
---
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json', './tsconfig.app.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
