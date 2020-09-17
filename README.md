# page-stat
A web browser extension to measure time spent on websites.

# Introduction
page-stat is a browser extension for chrome and firefox that calculates how
much time is spent on websites in general  and provides statistics
of daily, weekly, monthly and yearly usage.

# How the extension collects data
For measuring the time spent on a site, the extension stores a `map` containing objects called as focused hosts, where each of it has two fields, following the schematics below, that indicates a `host name` and one that stores the time (in the unix timestamp format) for the very moment that the host was once opened.

```
{
	host: 'host name',
	focusedAt: 0123456789, // Unix timestamp
};
```

For calculating the time spent, the extension listens for each tab status, and when one of the focused hosts goes out of focus, a calculation is made by subtracting the moment when the site lost focus by the moment it was focused for the last time. And lastly, the current usage time for the host is incremented by the value obtained.

This approach is good for not relying on infinite loops for calculating time, which would be terrible, but it has a very important caveat: if the user puts the computer to sleep; minimize the browser window; or simply open another window that sits above the browser, the time will keep counting until, somehow, the page in focus loses focus.

A very obvious solution to this would be to listen to possible changes on the browser window focus, but the current extension API is unreliable for that matter. See [issue 391471](https://bugs.chromium.org/p/chromium/issues/detail?id=391471) and [issue 387377](https://bugs.chromium.org/p/chromium/issues/detail?id=387377).

For this reason, this solution is not the best in this case, but when I started working on this extension I had no idea where I was getting myself into, since I've had neved wrote a browser extension before, and I've also already spent way too much time working on this, so that will be a fix for later.

# Using the extension
Right after installing the extension, it will start collecting time data from the sites accessed by following the default settings, defined in the `Setting` section that can be found in the page  shown by options menu, that can be accessed by right clicking the extension's menu.

![alt text][options-page]

![alt text][options-menu]

Clicking on the extension menu, it will show up information about the current site, disclosed on the extension's menu, showin by the following image.

![alt text][menu]

The first two lines of information give the current `host name` and the `host status`. The host status tells if the extension is collecting the usage time for the current host. By deactivating it, it will stop calculating the `time spent`. This configuration can be changed anytime by visiting the host again or by going into the `Settings` section.

The middle section displays the `time spent` in that host on the current day.

Lastly, the `Show statistics` button opens up the overall statistics page, where it shows usage statistics for every visited page since the extension was installed. The same page can be accessed by clicking the `Statistics` option in the menu on the left.

Explain how to use the extension in the major browsers.

[menu]: /images/menu.png "Extension's menu."
[options-page]: /images/options.png "Options page, showing side menu."
[options-menu]: /images/right-click-menu.png "Right click menu."

# Storage
Discuss about the unlimitedStorage permission, explain the usage estimation and talk about how the extension uses data.

# Browser compatibility
This extension is compatible with **Firefox**; **Google Chrome and derivatives**; **Opera**.

# Installation
* Firefox: [Add-ons for Firefox page]();
* Google Chrome: [Chrome Web Store page](); 
* Opera: [Opera add-ons page]();

## Manual installation
See the specifications regarding unpacked extensions for your particular browser.
