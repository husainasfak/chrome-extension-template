# Steps
- init react project
- create manifest.json in the public folder
- Add icons (16, 48 and 128 px)
- Configure Vite Build for Extension
 - `pnpm add -D vite-plugin-static-copy`
 - configure vite.config.ts
- Build project 


## 1. Manifest JSON
- It's a JSON file that acts like the extension's instruction manual or blueprint. It tells the browser everything it needs to know about your extension: its name, version, what permissions it needs, what components it has, and how they should work. Without it, the browser wouldn't recognize your folder as an extension or know what to do with your code files. 
    ### **Key parts**
    - "manifest_version": 3": Specifies you're using the latest standard (required for new extensions in Chrome).
    - "name": "My Cool Extension": The name shown to users.
    - "version": "1.0": Your extension's version number.
    - "description": "Does something awesome.": A brief summary.
    - "icons": { ... }: Defines icons for the toolbar, extensions page, etc.
    - "permissions": [...]: Crucial for security. Lists special browser features your extension needs access to (like accessing browser tabs, storage, or specific websites). We'll cover this more later.
    - "action": { ... }: Defines what happens when you click the extension's icon in the toolbar. In our example, "default_popup": "index.html" told it to open our React app in a small window. You could also have it just trigger an event in the background script instead of opening a popup.
    - "background": { ... }: Specifies a script that runs in the background.
    - "content_scripts": [ ... ]: Specifies scripts to inject directly into web pages.
    - "options_page": "options.html": Defines an HTML page for user settings, accessible from the extension management page.


## 2. Extension Components

- ### **Popup**: 
    The small HTML window that appears when you click the extension icon (if defined by "action": { "default_popup": ... } in the manifest). Runs like a temporary mini web page. It has its own HTML DOM, JavaScript environment. 

    Purpose : Quick interactions, displaying information, providing buttons/forms.
    
    Limitation: It only exists while it's open. When you click away, it closes, and its code stops running until opened again.

- ### **Content Scripts**:
    JavaScript and/or CSS files that your extension injects directly into specific web pages the user visits. 
    They run "inside" the web page (like google.com, youtube.com, etc.), alongside the page's own scripts. They can see and modify the page's content (the DOM). 
    
    However, they run in an "isolated world," meaning they can't directly access the web page's JavaScript variables or functions easily (for security), but they can manipulate the page's structure and appearance.
    
    
    Purpose: Reading information from pages, modifying how pages look or behave, adding new buttons or features to existing websites.

    Example: An extension that automatically finds all email addresses on a page and lists them, or one that changes the background color of Twitter, or adds a "Save to My Notes" button below YouTube videos.
    
    Manifest: You define them using the "content_scripts" key, specifying which URLs they should run on ("matches": ["*://*.example.com/*"]) and which JS/CSS files to inject.
    Permissions: Usually requires "host_permissions" in the manifest for the sites you want to modify.


- ### **Background Script (Service Worker in Manifest V3):**
    A single JavaScript file that runs in the background, separate from any web page or popup. In Manifest V3, this is implemented as a Service Worker.

    Runs in its own special browser process. It cannot directly access web page content (DOM). It's event-driven, meaning it wakes up when something happens (like the extension being installed, a message arriving, an alarm firing, a browser event occurring), does its job, and then becomes idle again to save resources.

    The central coordinator. Handles long-running tasks, listens for browser events (like switching tabs, closing windows), manages extension state, communicates with APIs, intercepts network requests, and coordinates communication between other parts of the extension (popups, content scripts).

    An extension that checks your unread email count every 5 minutes, listens for clicks on the toolbar icon if there's no popup, saves settings when changed in the options page, or reacts when you bookmark a page.

    Manifest: Defined using "background": { "service_worker": "background.js" }.

- ### **Options Page:**
     A regular HTML page (potentially using React, Vue, etc.) for users to configure your extension's settings.
     Runs like a normal web page within a browser tab.
     Letting users customize the extension (e.g., set API keys, choose themes, enable/disable features).

     Manifest: Defined using "options_page": "options.html" or "options_ui": { "page": "options.html", "open_in_tab": true }.



## 3. Communication: How Parts Talk to Each Other (Messaging)
Since the Popup, Content Scripts, and Background Script run in different places, they can't just call each other's functions directly. They need a way to send messages.

**Mechanism**: The chrome.runtime.sendMessage() function sends a message (usually a JSON object), and chrome.runtime.onMessage.addListener() listens for incoming messages.



## 4. Permissions: Asking for Access
Concept: By default, extensions are sandboxed and can't do much. To access sensitive browser APIs or interact with websites, you must declare permissions in your manifest.json.
Why: Security and user trust. Users are warned about the permissions an extension requests before installing it.
Types:

"permissions": For accessing browser APIs like storage (to save data), tabs (to interact with browser tabs), alarms (to run code periodically), scripting (to programmatically inject scripts).

"host_permissions": For interacting with specific websites. Needed for content scripts to run on those sites (e.g., "*://*.google.com/*") or for background scripts to make network requests to them. <all_urls> grants access to all websites (use sparingly!).

Rule: Only ask for the permissions your extension absolutely needs to function.



Okay, great! Now that you have a working extension, let's break down the fundamental concepts behind Chrome extensions (which mostly apply to other browsers supporting the WebExtensions API like Firefox and Edge) so you can build more complex things.

Think of a browser extension like a mini-app that lives inside your browser. It can enhance your Browse experience, modify web pages, interact with browser features, or connect web services together.

Here are the core concepts:

1. The Manifest (manifest.json) - The Blueprint

What it is: This is the most important file. It's a JSON file that acts like the extension's instruction manual or blueprint. It tells the browser everything it needs to know about your extension: its name, version, what permissions it needs, what components it has, and how they should work.
Why it's needed: Without it, the browser wouldn't recognize your folder as an extension or know what to do with your code files.
Key Parts (Examples):
"manifest_version": 3": Specifies you're using the latest standard (required for new extensions in Chrome).
"name": "My Cool Extension": The name shown to users.
"version": "1.0": Your extension's version number.
"description": "Does something awesome.": A brief summary.
"icons": { ... }: Defines icons for the toolbar, extensions page, etc.
"permissions": [...]: Crucial for security. Lists special browser features your extension needs access to (like accessing browser tabs, storage, or specific websites). We'll cover this more later.
"action": { ... }: Defines what happens when you click the extension's icon in the toolbar. In our example, "default_popup": "index.html" told it to open our React app in a small window. You could also have it just trigger an event in the background script instead of opening a popup.
"background": { ... }: Specifies a script that runs in the background (more on this below).
"content_scripts": [ ... ]: Specifies scripts to inject directly into web pages (more on this below).
"options_page": "options.html": Defines an HTML page for user settings, accessible from the extension management page.


## 2. Extension Components & Where Code Runs (Execution Contexts)

Your extension isn't just one program; it's often made of different parts that run in different places or "contexts":

**a) Popup:**

What: The small HTML window that appears when you click the extension icon (if defined by "action": { "default_popup": ... } in the manifest).
Context: Runs like a temporary mini web page. It has its own HTML DOM, JavaScript environment.
Purpose: Quick interactions, displaying information, providing buttons/forms.
Example: Our React extension showing "Hello from React!" is a popup.
Limitation: It only exists while it's open. When you click away, it closes, and its code stops running until opened again.

**b) Content Scripts:**

What: JavaScript and/or CSS files that your extension injects directly into specific web pages the user visits.
Context: They run "inside" the web page (like google.com, youtube.com, etc.), alongside the page's own scripts. They can see and modify the page's content (the DOM). However, they run in an "isolated world," meaning they can't directly access the web page's JavaScript variables or functions easily (for security), but they can manipulate the page's structure and appearance.
Purpose: Reading information from pages, modifying how pages look or behave, adding new buttons or features to existing websites.
Example: An extension that automatically finds all email addresses on a page and lists them, or one that changes the background color of Twitter, or adds a "Save to My Notes" button below YouTube videos.
Manifest: You define them using the "content_scripts" key, specifying which URLs they should run on ("matches": ["*://*.example.com/*"]) and which JS/CSS files to inject.
Permissions: Usually requires "host_permissions" in the manifest for the sites you want to modify.


**c) Background Script (Service Worker in Manifest V3):**

What: A single JavaScript file that runs in the background, separate from any web page or popup. In Manifest V3, this is implemented as a Service Worker.
Context: Runs in its own special browser process. It cannot directly access web page content (DOM). It's event-driven, meaning it wakes up when something happens (like the extension being installed, a message arriving, an alarm firing, a browser event occurring), does its job, and then becomes idle again to save resources.
Purpose: The central coordinator. Handles long-running tasks, listens for browser events (like switching tabs, closing windows), manages extension state, communicates with APIs, intercepts network requests, and coordinates communication between other parts of the extension (popups, content scripts).
Example: An extension that checks your unread email count every 5 minutes, listens for clicks on the toolbar icon if there's no popup, saves settings when changed in the options page, or reacts when you bookmark a page.
Manifest: Defined using "background": { "service_worker": "background.js" }.


**d) Options Page:**

What: A regular HTML page (potentially using React, Vue, etc.) for users to configure your extension's settings.
Context: Runs like a normal web page within a browser tab.
Purpose: Letting users customize the extension (e.g., set API keys, choose themes, enable/disable features).
Manifest: Defined using "options_page": "options.html" or "options_ui": { "page": "options.html", "open_in_tab": true }.


## 3. Communication: How Parts Talk to Each Other (Messaging)

Since the Popup, Content Scripts, and Background Script run in different places, they can't just call each other's functions directly. They need a way to send messages.

Mechanism: The chrome.runtime.sendMessage() function sends a message (usually a JSON object), and chrome.runtime.onMessage.addListener() listens for incoming messages.
Simple Example:
Popup needs data: The popup script calls chrome.runtime.sendMessage({ greeting: "hello from popup" }, (response) => { console.log("Background says:", response.farewell); });
Background listens: The background script has a listener: chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { if (message.greeting === "hello from popup") { console.log("Popup is calling!"); sendResponse({ farewell: "goodbye from background" }); } });
Response: The background script uses sendResponse to send a reply back to the specific popup instance that sent the message.
Use Cases: Content scripts often need to send data they scraped from a page to the background script for processing or storage. Popups might ask the background script for the latest stored settings.


## 4. Permissions: Asking for Access

Concept: By default, extensions are sandboxed and can't do much. To access sensitive browser APIs or interact with websites, you must declare permissions in your manifest.json.
Why: Security and user trust. Users are warned about the permissions an extension requests before installing it.
Types:
"permissions": For accessing browser APIs like storage (to save data), tabs (to interact with browser tabs), alarms (to run code periodically), scripting (to programmatically inject scripts).
"host_permissions": For interacting with specific websites. Needed for content scripts to run on those sites (e.g., "*://*.google.com/*") or for background scripts to make network requests to them. <all_urls> grants access to all websites (use sparingly!).
Rule: Only ask for the permissions your extension absolutely needs to function.


## 5. Storage: Saving Data

What: Extensions often need to save settings or data. The chrome.storage API provides ways to do this.

Types:
chrome.storage.local: Stores data locally on the user's machine. Larger storage limit. Data persists.

chrome.storage.sync: Stores data that Chrome tries to sync across devices where the user is logged in (if sync is enabled). Smaller limit, ideal for user preferences. Data persists.

chrome.storage.session: Stores data only while the browser is running. Cleared when the browser closes. Good for temporary session state. (Manifest V3 specific).

Permission: Requires the "storage" permission in the manifest.

Example: chrome.storage.sync.set({ favoriteColor: 'blue' }, () => { console.log('Color saved!'); }); and chrome.storage.sync.get(['favoriteColor'], (result) => { console.log('Favorite color is ' + result.favoriteColor); });