import './electronAPI';

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');

  oStyle.id = 'app-loading-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-loading-wrap';
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

function useSkeleton() {
  const styleContent = `
.app-skeleton-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  background: #fff;
  z-index: 9;
}
.app-skeleton-nav {
  padding: 0 0 20px;
  border-bottom: 1px solid #ccc;
}
.app-skeleton-content {
  height: calc(100% - 60px);
}
.app-skeleton-footer {
  background-color: rgba(204, 201, 201, 0.2);
  height: 40px;
  width: 100%;
}
.wavesurfer {
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 100%;
  height: 260px;
  --c: rgb(118, 218, 255);
  --w1: radial-gradient(100% 57% at top, #0000 100%, var(--c) 100.5%) no-repeat;
  --w2: radial-gradient(100% 57% at bottom, var(--c) 100%, #0000 100.5%) no-repeat;
  background: var(--w1), var(--w2), var(--w1), var(--w2);
  background-position-x:
    -200%,
    -100%,
    0%,
    100%;
  background-position-y: 100%;
  background-size: 50.5% 100%;
}

    `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');

  oStyle.id = 'app-skeleton-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-skeleton-wrap';
  oDiv.innerHTML = `<div class="app-skeleton-nav"></div><div class="app-skeleton-content"></div><div class="wavesurfer"></div><div class="app-skeleton-footer"></div>`;

  return {
    appendSkeleton() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeSkeleton() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------
const { appendLoading, removeLoading } = useLoading();
const { appendSkeleton, removeSkeleton } = useSkeleton();

if (location.pathname.includes('/index.html')) {
  domReady().then(appendSkeleton);
  setTimeout(removeSkeleton, 4999);
} else {
  if (
    !location.pathname.includes('/shotScreen.html') &&
    !location.pathname.includes('/clipScreen.html') &&
    !location.pathname.includes('/canvas.html')
  ) {
    domReady().then(appendLoading);

    setTimeout(removeLoading, 4999);
  }
}

window.onmessage = (ev) => {
  if (ev.data.payload === 'removeLoading') {
    location.pathname.includes('/index.html') ? removeSkeleton() : removeLoading();
  }
};
