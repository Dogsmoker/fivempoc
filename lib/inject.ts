import WebSocket from 'ws';
import fs, { read } from 'fs';
import path from 'path';

const DEVTOOLS_JSON_URL = 'http://localhost:13172/json';

class Injector {
    private payloadPath: string;
    private targetTitle: string;

    constructor(payloadPath: string, early: boolean = false) {
        this.payloadPath = payloadPath;
        this.targetTitle = early ? 'CFX UI' : 'CitizenFX root UI';

        console.log(`Injector Instance Setup`);
    }

    private async fetchWebSocketUrl(): Promise<string | null> {
        try {
            const response = await fetch(DEVTOOLS_JSON_URL);
            const pages = await response.json();

            const targetPage = pages.find((page: { title: string; }) => page.title === this.targetTitle);

            if (!targetPage) {
                console.error(`${this.targetTitle} not found.`);
                return null;
            }

            return targetPage.webSocketDebuggerUrl;
        } catch (error) {
            console.log('Cannot find websocket url.')
            return null;
        }
    }

    private async waitForWebSocketUrl(): Promise<string | null> {
        let wsUrl = null;
        while (!wsUrl) {
            wsUrl = await this.fetchWebSocketUrl();
            if (!wsUrl) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Retry every 5 seconds
            }
        }
        return wsUrl;
    }

    private readPayload(): string {
        try {
            const payload = fs.readFileSync(path.resolve(this.payloadPath), 'utf-8');
            return payload;
        } catch (error) {
            console.error('Error reading payload file:', error);
            return '';
        }
    }
    

    private async injectPayload(ws: WebSocket) {
        const payload = this.readPayload();
        if (!payload) {
            console.error('Payload is empty. Injection aborted.');
            return;
        }


        ws.send(JSON.stringify({
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": payload,
            }
        }));
    }

    public async start() {
        try {
            const wsUrl = await this.waitForWebSocketUrl();

            if (!wsUrl) {
                console.error('No WebSocket found.');
                return;
            }

            const ws = new WebSocket(wsUrl);

            ws.on('open', async () => {
                await this.injectPayload(ws);
                ws.close();
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });

            ws.on('close', () => {
                console.log('WebSocket connection closed.');
            });
        } catch (error) {
            console.error('Error during injection:', error);
        }
    }
}

export default Injector;
