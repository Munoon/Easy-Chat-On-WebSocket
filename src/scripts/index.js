'use strict';

import "../style.css";
import { Chat } from "./chat/chat.js";
import { SettingsPoput } from "./askSettings.js";

function settings({ nickname, url }) {
    new Chat({
        element: document.getElementById('chatApp'),
        url,
        nickname
    });
}

new SettingsPoput({
    defaultUrl: 'localhost:8081',
    onSettingsDone: settings,
    element: document.getElementById('welcomePoput')
});
