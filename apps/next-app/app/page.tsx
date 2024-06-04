'use client';

import { ReactNode, useState } from 'react';
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
          Block main thread for 200ms on key down and then remove the input:
          <input
            type="text"
            onKeyDown={(e) => {
              blockMainThread(200);
              (e.target as any).remove();
            }}
          />
        </Label>
        <div id="fill"></div>
      </div>
    </main>
  );
}
