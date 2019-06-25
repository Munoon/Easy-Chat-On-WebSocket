'use strict';

import { Chat } from "./chat/chat.js";

new Chat({
    element: document.getElementById('chatApp'),
    url: 'localhost:8081'
});