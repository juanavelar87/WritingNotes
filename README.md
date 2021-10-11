# Writing Notes

Writing Notes is a web application where you can make notes and flashcards. The notes can be regular notes, they can have different tags that you can create, you can choose the color which the note will be display in the front page, make it public for all the users who want to read it, make it relevant if it's necessary at the time and the main reason I wanted to make this, the ability to nest notes inside notes so that you can have a better organization and having the possibility to see each note individually while also being able to place it inside a different note if needed.
To do this project I used all the platforms and languages I learned in the curse(HTML, CSS, JavaScript and Django)

# Pages
## All
In the “all” page you will be able to see all your notes and ,if needed, search through them to find the one you were looking for.
## Notes
In the Notes page there are less notes shown because it only shows the ones that are the “parent”, the ones which display others inside of them and are not inside one of the other notes. 
## Public
The public page is a display of the notes which are public for everyone, it's important to mention that the user is the only one who has the ability to decide whether to make his note public or not. 
## Relevant
The relevant page will display important notes for you at that moment, so you can access them easily and fast. 
## New Note 
The page New note is a more complete way of making a note than the quick note button that will only allow you to access its title and body, New Note page will let you have a wider space to write and decide the color and its relevance.
## Flashcards
At last the flashcard page will display flashcards, flashcards that you will study from time to time so that you don’t forget about certain things(spaced repetition). It shows the flashcards that you have to do today or in the past days and it will set the next date depending on your easiness to answer the question.

# How to use
## Create note
To make a note you can either choose to make it in New Note or press in the Quick note button. You will be displayed with a textarea which corresponds to the body of your note, a simple input field and if you choose the New Note option also you will be able to define its color and if it's relevant and a bigger space to write.

## Note
### Access Note
Once you have a note you can change it, if you are in the front page you will have to double click on a note to enter to its individual page(one click will only minimize it). 
### Individual Page
The individual page will display the title of your note, when you created it, last edited, display button, your note, inside notes and changes for your note.
#### Writing
In the individual page you will have a bigger space if you want to edit your note, also if your note has inside notes you will also be able to edit them and write on them. Saving will be handled by a save button that will appear when you write.
#### Display
Display is a visualization of your notes in a concept map, it's structure is implemented by the display.js file. The structure of the tree will be implemented by the hierarchy of the notes and the ones inside them until they have reached third childs at which point it will only be display the first child of the parent note. You can access the notes byb clicking twice in its title.
#### Changes
In the individual page you will be able to do all the previous changes and two more, make it public and add a note to it as well as take it out from that note.
  * Relevant- Make relevant and easy-access your note
  * Color- Edit the background color of your note, you will have the background div as an example of the color you decided.
  * Add notes- When you select a note it will appear immediately down in the div for inside notes. 
  * Add tag- When you add a tag it will appear in a div
  * Make public- Will let you make public your note 
## Flashcards
You can use the flashcards by first creating one, it is possible to create one with the button at the top of the page. When you have created one you can access it via the flashcards page or the All page since the flashcards page will only show you the flashcards that you have due today. When you access it you will be displayed with only the title and the body not shown so that you can think the answer and then when you think you know the answer display it and based on the easiness and the respond you will decide if it was difficult, easy or medium and then based on that the next date to review.
## Main pages
In the main pages there will be a display of the notes depending in which page you selected and with other functions.
### Display
The title of the note will be displayed, if you click twice you will go to its individual page but if you click once you will minimize it leaving only it's title and by clicking again it will recover its original form.
You also will see the tags that the note has.
### Edit
In most of the places where a note is displayed you will have the ability to edit it (except for the public if you are not the user who wrote it) by an edit content div that will let you save what you edit with a save button that will appear the first time you write in the note.
Also in the main pages you will have a cross button that will let you eliminate your note if you want to.

# Distinctiveness and Complexity
My project is different from the ones I did throughout the curse. It utilizes Django in the back-end and Javascript to create all the things in the front-end. It is mobile responsive as the option of double click to access a note is changed by only one click(since it is zoom-in when clicked twice in phone). 
This project is the one I have invested more energy and time doing it because I like it and I knew it could help me in the future and who knows maybe others because I think that with some improvements it could be really useful since there is not so many free note-taking apps out there.
## Structure of files
The structure of the files is similar to the ones of the other projects. 
* static/WritingNotes
  ** Layout.js: Provides most of the javascript in the page since it is a single-page app.
  ** display.js: Provides the Javascript needed to the display of the concept map of the notes.
  ** styles.css: Provides the styles for the page.
* templates/WritingNotes
Contains all the HTML files of the web page.
* reading/views.py contains all the functions for the views.
* reading/urls.py contains the urls for the projects.
* reading/models.py contains all the models.

## How to run
cd into projects directory
python manage.py migrate
and python manage.py runserver to run the web app
