const tabColors = new Map(),
    setColor = (color, window) => {
        // For this to be something I'd distribute the following issues would have to be fixed:
        // - The accent color should just not be set, but that's sadly not an option.
        // - The text color should have good contrast to the toolbar color, so it should probably
        //   decide between light/dark variants.
        browser.theme.update(window, {
            colors: {
                toolbar: color,
                accentcolor: '-moz-Dialog',
                textcolor: 'auto'
            }
        });
    },
    resetColor = () => {
        browser.theme.reset();
    };

browser.runtime.onMessage.addListener((message, sender) => {
    if(message.command === 'color') {
        tabColors.set(sender.tab.id, message.value);
        if(sender.tab.active) {
            setColor(message.value, sender.tab.windowId);
        }
    }
    else if(message.command === 'reset') {
        resetColor();
    }
});

browser.tabs.onActivated.addListener((activeInfo) => {
    if(tabColors.has(activeInfo.tabId)) {
        setColor(tabColors.get(activeInfo.tabId), activeInfo.windowId);
    }
    else {
        resetColor();
    }
});
