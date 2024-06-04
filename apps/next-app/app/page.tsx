'use client';

import { ReactNode, startTransition, useEffect, useState } from 'react';
import interactionResponse from 'await-interaction-response';
import s from './page.module.css';

function blockMainThread(time: number) {
  const delay = Date.now() + time;
  while (Date.now() < delay) {}
}

function Label({ children }: { children: ReactNode }) {
  return <label className={s.label}>{children}</label>;
}

export default function Home() {
  const [value, setValue] = useState('');
  const [val, setSlowValue] = useState('');

  useEffect(() => {
    if (val) {
      blockMainThread(200);
    }
  }, [val]);

  return (
    <main>
      <h2>Interact with the inputs below to compare INP scores</h2>
      <p>Open the devtools console to see logs in how the INP score changes.</p>
      <div className="parent">
        <Label>
          Block main thread for 200ms on change using
          <a
            href="https://github.com/vercel-labs/await-interaction-response"
            target="_blank"
            rel="noopener noreferrer"
          >
            await-interaction-response:
          </a>
          <input
            type="text"
            value={value}
            onChange={async (e) => {
              setValue(e.target.value);
              await interactionResponse();
              blockMainThread(200);
            }}
          />
        </Label>
        <Label>
          Block main thread for 200ms on change with useEffect and
          startTransition:
          <input
            type="text"
            value={val}
            onChange={async (e) => {
              startTransition(() => {
                setSlowValue(e.target.value);
              });
            }}
          />
        </Label>
        <Label>
          Block main thread for 200ms on change:
          <input
            type="text"
            onChange={async (e) => {
              blockMainThread(200);
            }}
          />
        </Label>
        <p>
          For this particular use case, where the main thread is blocked by JS
          execution during the interaction, await-interaction-response is more
          responsive.
        </p>
        <p>
          For more complex UI updates, startTransition is likely the way to go
          (or a combination of the two).
        </p>
      </div>
    </main>
  );
}
