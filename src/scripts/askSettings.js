export class SettingsPoput {
    constructor({ defaultUrl, onSettingsDone, element }) {
        this._defaultUrl = defaultUrl || "";
        this._onSettingsDone = onSettingsDone;
        this._element = element;

        this._renderPoput();
        document.getElementById('welcomePoputButton').addEventListener('click', e => {
            document.getElementById('settingsModal').classList.remove('open');
            this._onSettingsDone({
                url: document.getElementById('serverInput').value,
                nickname: document.getElementById('nicknameInput').value
            });
        });
    }
    
    _renderPoput() {
        this._element.innerHTML = `
                                    <div id="settingsModal" class="modal open">
                                        <div class="modal-content">
                                            <h4>Settings</h4>
                                            <div class="row">
                                                <form class="col s12">
                                                    <div class="input-field col s4">
                                                        <input id="serverInput" id="server" type="text" value="${this._defaultUrl}">
                                                        <label for="serverInput">Server</label>
                                                    </div>
                                                    <div class="input-field col s4">
                                                        <input id="nicknameInput" type="text">
                                                        <label for="nicknameInput">Nickname</label>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <a id="welcomePoputButton" class="modal-close waves-effect waves-teal btn-flat">Set</a>
                                            </div>
                                        </div>
                                    </div>                      
                                    `;
    }
}