# Reddit Clone

## Overview


Reddit Clone is a web app based off of the social news discussion site, Reddit. Visitors of the site can view relevant posts under broad categories such as programming and pictures. Users can register and login to create their own text/image posts. Users can also access their profile, where they will be able to see the posts they have made. In addition to that, users can upvote or downvote posts to express which posts they like or dislike. The most popular posts will be shown on the homepage. On any post, users can also add comments.


## User Stories or Use Cases
<!-- 
(___TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://www.mongodb.com/download-center?jmp=docs&_ga=1.47552679.1838903181.1489282706#previous)_) -->

1. As a non-registered user, I can register a new account.
2. As a registered user, I can log in to the site.
3. As a registered user, I can create posts to be uploaded to any category.
4. As a registered user, I can comment on any post.
5. As a registered user, I can upvote or downvote any post.
6. As a user, I can view posts of any category.
7. As a user, I can view any user's page.
8. As a user, I can view comments.
9. As a user, I can request a new category.


## Research Topics

<!-- (___TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed_) -->

* (5 points) Integrate user authentication
    * Passport - authentication middleware for Node.js for Express-based web apps
      * used to support username + password functionality for the site
        - specifically using [this module](http://www.passportjs.org/docs/username-password/)
  <!--   * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password -->
<!--     * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
    * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page -->
* (4 points) Perform client side form validation using a JavaScript library
    * [Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation) - checks for valid form input on client-side before the values are submitted to the server
      * used to ensure that invalid inputs such as empty fields, inclusion of special characters, etc will not be submitted to the server
* (2 points) Use a CSS framework throughout your site, use a reasonable of customization of the framework
    * CSS framework - provides layout and styling of the site
      * [tailwind.css](https://tailwindcss.com/) 

11 points total out of 8 required points <!--(___TODO__: addtional points will __not__ count for extra credit_)-->


## [Link to Initial Main Project File](src/app.js) 

<!-- (___TODO__: create a skeleton Express application with a package.json, app.js, views folder, etc. ... and link to your initial app.js_)
 -->
## Annotations / References Used

<!-- (___TODO__: list any tutorials/references/etc. that you've based your code off of_) -->

1. [Form Validation](https://css-tricks.com/form-validation-part-2-constraint-validation-api-javascript/)
2. [Regex to determine if link is image url](https://stackoverflow.com/questions/169625/regex-to-check-if-valid-url-that-ends-in-jpg-png-or-gif)
3. [HTML Escaping to ensure user input is not displayed unescaped](http://shebang.mintern.net/foolproof-html-escaping-in-javascript/)
4. [Professor Versoza's slides on Passport Authentication](https://cs.nyu.edu/courses/fall19/CSCI-UA.0480-001/_site/slides/16/auth.html#/)

