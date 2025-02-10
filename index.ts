import Injector from './lib/inject';
import {CONFIG} from './config';

class Main {
    public async start() {
        const injector = new Injector(CONFIG.PAYLOADS.INIT);
        //await injector.start();
      
        // Uncomment last line and make sure ur fivem update channel is canary or run the example in lib/fivem.ts
    }
}

new Main().start();