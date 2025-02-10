console.log('Hotreload payload POC');
const iframe = document.createElement('iframe');

iframe.src = 'http://localhost:5173/';
iframe.name = 'hotreload-ui';

Object.assign(iframe.style, {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '999999999',
    border: 'none'
});

document.body.appendChild(iframe);