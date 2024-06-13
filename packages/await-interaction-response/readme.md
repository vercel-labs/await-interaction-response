# await-interaction-response

Improve [INP (Interaction to Next Paint)](https://web.dev/articles/inp) by allowing the browser to paint before blocking the main thread. You can test how it works in the [live demo](https://await-interaction-response.vercel.app/).

You can learn more about INP and this package in our blog: [Demystifying INP: New tools and actionable insights](https://vercel.com/blog/demystifying-inp-new-tools-and-actionable-insights).

## How to use

Install the package:

```bash
pnpm add await-interaction-response
```

```bash
npm install await-interaction-response
```

```bash
yarn add await-interaction-response
```

Next, add `awat interactionResponse()` to interactions that have a bad INP:

```tsx
import interactionResponse from 'await-interaction-response';

<input
  type="text"
  value={value}
  onChange={async (e) => {
    setValue(e.target.value);
    await interactionResponse();
    expensiveMainThreadWork();
  }}
/>;
```

## Q&A

### When should I use or not use this?

Generally, add `await interactionResponse()` in places where you're having INP issues and when your UI library solutions (like React's [`startTransition`](https://react.dev/reference/react/useTransition#starttransition)) aren't enough for your use case.

So a first step is to monitor for INP issues in development with tools like the [Vercel Toolbar](https://vercel.com/changelog/interaction-timing-tool) or the [chrome web-vitals extension](https://chromewebstore.google.com/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en) and
in production with services like [Vercel Speed Insights](https://github.com/vercel/speed-insights) that do [RUM](https://en.wikipedia.org/wiki/Real_user_monitoring).

### How is this useful for INP?

Your INP score is affected when the browser does not have time to update the UI after an user interaction. A common cause is executing JavaScript in the main thread for longer periods of time. To prevent this, you'll want to delay executing JavaScript code unrelated to the UI change until the main thread is free to handle it.

Therefore, `await-interaction-response` simply forces you to wait and gives the browser time to commit the UI change. This helps improve INP in situations where JavaScript is the culprit.

### How does it work?

`interactionResponse` is a function with [8 lines of code](./src/interaction-response.ts) that waits until the [next animation frame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) to start a `0` time out, which delays resolving its promise to the end of the queue in the event loop. Once called the promise resolves and execution continues to the rest of your JS code.
