# website-color
Use VivaldiFox instead of this extension.

## Things this extension does that VivaldiFox doesn't
To get the color of the current site, this extension considers the following settings:

 - `theme_color` in the web app manifest, if it can be loaded
 - `background_color` in the web app manifest, if it can be loaded
 - `theme-color` meta tag (that's the only thing VivaldiFox uses)
 - `msapplication-TileColor` meta tag
 - `msapplication-config` xml configuration for the tile
 - `apple-mobile-web-app-status-bar-style` to make the toolbar black if the app requests a black toolbar

Further, the meta tags are watched for changes, so that the theme color for a page can change dynamically.
