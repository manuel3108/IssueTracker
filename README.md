# IssueTracker
JavaScript based easy-to-use issue tracker

### How does it look like?
I like apps and websites which have a dark-mode, but I dont like it, when it becomes to dark. Thats why I have choosen light greys. Also I wanted to keep things such minimalistic as possible. I don't know anybody who love to have websites with millions of buttons. Now, have a look at the image below, I think that most of use-cases should be clear.
![](http://manuel-serret.bplaced.de/IssueTracker/img/main.PNG)
In the center there is thie simple issue-table with the most important data for an issue. If the list becomes longer than the height of your screen, then a scrollbar will appear. On the top right you have a searchbar, where you can filter the issues by everything you want. I also want to mention that you can order the issues by clicking on one of the table categories. The button on the bottom left will let you create a new issue.


### What are the main features?
- customization (create or delete priorities, topics and states)
- self-hostable (you can download the source and install the IssueTracker on your own webserver)
- fast (becasue of a single page application)
- free (download, install, have fun)


### Is there a demo?
Well, at the moment I dont have access to a webserver with an empty database, so at the moment there isn't a demo. But with this link you can see some more screenshots.


### Who to install?
First you need to be sure, that you have a webserver (supporting PHP) with enougth empty space and access to a database.
1. Download this repo and upload all files to your webserver.
2. Open the page 'install.php' located in the root of the project in your preffered browser.
3. Fill out the requiered data and click install
4. When the installation has successfully finished, there will be a button, which will take you to the issue tracker.
5. finished! Have fun :)


### Hints for usage
- Pressing the ESCAPE-Key will close the current panel and take you to the main page
- With an empty searchbar, closed issue will not been showed. When the searchbar isn't empty, closed issues will be shown
- In the searchbar you can search after the id, the title, the priority, the topic and the states
- You can order the visible issues by clicking on id, priority, topic, state, created, updated


### Issues, Bugs, Features
Feel free to open an issue, i will try my best to help you, if you need help.
Feature Request are higly apperciated and I really want to know what additional ideas you have.

If you have Feedback in any other cases, feel free to open an issue and write down, what you want to say. I will make sure, that I will respond to you.


### License
This project is licensed under the MIT-License. Feel free to have a look at the license ![here](https://github.com/manuel3108/IssueTracker/blob/master/LICENSE)
