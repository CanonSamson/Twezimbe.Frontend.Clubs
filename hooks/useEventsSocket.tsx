import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

//TO HANDLE SOCKET EVENTS

export interface Event {
  event: string;
  callback(...args: any[]): any;
}

export function useSocketEvents(socket: Socket | null, events: Event[], isConnected: boolean) {
  useEffect(() => {
    if (isConnected && socket) {
      for (const event of events) {
        socket.on(event.event, event.callback);
      }

      return function () {
        for (const event of events) {
          socket.off(event.event);
        }
      };
    }
  }, [isConnected, events, socket]);
}
