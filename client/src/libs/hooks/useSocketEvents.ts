'use client'

import socket from "@/app/socket";
import { useEffect } from "react";

export interface Event {
    name: string;
    handler(...args: any[]): any;
}

export function useSocketEvents(events: Event[]) {
    useEffect(() => {
        if (!socket) return
        for (const event of events) {
            socket.on(event.name, event.handler);
        }

        return function () {
            for (const event of events) {
                socket!.off(event.name);
            }
        };
    }, []);
}