const setColor = (color) => {
        browser.runtime.sendMessage({
            command: 'color',
            value: color
        });
        return true;
    },
    getManifestColor = async () => {
      return false;
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if(manifestLink) {
            try {
                const manifest = await fetch(manifestLink.href);
                if(manifest.ok) {
                    const json = await manifest.json();
                    if(json.hasOwnProperty('theme_color')) {
                        return setColor(json.theme_color);
                    }
                    if(json.hasOwnProperty('background_color')) {
                        return setColor(json.background_color);
                    }
                }
            }
            catch(e) {
                return false;
            }
        }
        return false;
    },
    getMeta = (name, cbk) => {
        const meta = document.querySelector(`meta[name="${name}"]`);
        if(meta) {
            const success = cbk(meta.content);
            const obs = new MutationObserver(() => { cbk(meta.content); });
            obs.observe(meta, {
                attributes: true
            });
            return true;
        }
        return false;
    },
    getThemeColor = () => {
        return getMeta("theme-color", setColor);
    },
    getMSTileColor = () => {
        return getMeta("msapplication-TileColor", setColor);
    },
    getBrowserConfig = async () => {
        const msappConfig = document.querySelector('meta[name="msapplication-config"]');
        if(msappConfig) {
            try {
                const browserConfig = await fetch(msappConfig.content);
                if(browserConfig.ok) {
                    const text = await browserConfig.text(),
                        parser = new DOMParser();
                    const doc = parser.parseFromString(text, "application/xml");
                    const color = doc.querySelector("TileColor");
                    if(color) {
                        return setColor(color.textContent);
                    }
                }
            }
            catch(e) {
                return false;
            }
        }
        return false;
    },
    getStatusBarStyle = () => {
        return getMeta("apple-mobile-web-app-status-bar-style", (style) => {
            if(style.startsWith("black")) {
                return setColor("#000000");
            }
        });
    },
    getColor = async () => {
        if(await getManifestColor()) {
            console.log("manifest");
            return;
        }
        if(getThemeColor()) {
            console.log("theme");
            return;
        }
        if(getMSTileColor()) {
            console.log("ms tile");
            return;
        }
        if(await getBrowserConfig()) {
            console.log("ms config");
            return;
        }
        if(getStatusBarStyle()) {
            console.log("apple status bar");
            return;
        }
        browser.runtime.sendMessage({
            command: 'reset'
        });
    };

getColor();
