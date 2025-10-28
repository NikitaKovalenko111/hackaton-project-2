"use client";

import { io } from "socket.io-client";

const URL = "http://176.119.147.135:3001/"

export const socket = io(URL);