import * as React from 'react';

import { IDirection, IPos } from '../interfaces';
import './style.css';

interface Props {
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  direction?: IDirection;
  children?: any;
}

export const Resizable = ({ minWidth, defaultWidth, maxWidth, direction, children }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const startPos = React.useRef<IPos>({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
    }

    window.addEventListener('mouseup', onWindowMouseUp);
    window.addEventListener('mousemove', onWindowMouseMove);
  }

  const onWindowMouseUp = () => {
    window.removeEventListener('mouseup', onWindowMouseUp);
    window.removeEventListener('mousemove', onWindowMouseMove);
  }

  const onWindowMouseMove = (e: MouseEvent) => {
    const width = e.clientX - startPos.current.x + defaultWidth;

    if (width < minWidth || width > maxWidth) {
      return;
    }

    ref.current.style.width = `${width}px`;
  }

  return (
    <div className='resizable' ref={ref}>
      <div className='resizable-anchor' onMouseDown={onMouseDown} style={{
        left: direction === 'left' ? 0 : 'unset',
      }} />
      {children}
    </div>
  );
}

Resizable.defaultProps = {
  defaultWidth: 256,
  maxWidth: 512,
  minWidth: 128,
}
