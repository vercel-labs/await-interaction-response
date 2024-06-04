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
      <h2>Input events</h2>
      <div className="parent">
        <Label>
          Block main thread for 200ms on change using
          await-interaction-response:
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
          Block main thread for 200ms on change:
          <input
            type="text"
            onChange={async (e) => {
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
      </div>
    </main>
  );
}
