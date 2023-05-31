<h1>MiddleWeight Fantasy Matchup</h1>

<h2>What this app is about</h2>
<p>This app contains all the middleweight boxers that were crowned champions till the year 2022.Then the user can select two champions and the app predicts which boxer would win if they were to fight. The algorithm to decide the winner uses the boxing record of resepctive boxers. The current algorithm decides the winner based on the amount of champions a boxer has beaten, but future versions would take into account other variables such as height, reach, and KO ratio.</p>


<h2> How this app was created</h2>
  <p>
 First I scraped list of middleweight boxing champions from wikipedia from year 1884 to 2022 using JSDOM axios. Then I scraped individual records for each middleweight champion. Then I cleaned the data and uploaded it on PostgreSQL databse and Prisma. Then I used JavaScript NodeJS/expressJS to create backend APIs. The APIs would fetch data from database using SQL queries. Then I designed a frontend UI using HTML and CSS. In the UI users could pit two boxing champions against each other and then an algorithm in the backend would decide the winner and display it in the frontend. After this I optimized the speed of uploading data to database from 3600 databse calls to 3, which brought the the process of uploading the data from one whole day to a few seconds. The app also contains tests with Cypress.IO. 
  </p>    
  
  
---

App demo
---
https://github.com/rk14283/listOfMiddleWeightChampions/assets/59180436/e028b604-ee56-43ff-9c7c-41d16bb4b711


<h2>Used technologies</h2>
<ul>
<li><a href ="https://github.com/rk14283/listOfMiddleWeightChampions/blob/master/index.js">Webscraping with axios</a></li>
<li><a href="https://github.com/rk14283/listOfMiddleWeightChampions/blob/master/expressJS/views/templates.ejs">EJS to build UI</a></li>
<li><a href ="">Prisma to host and interface with the database(PostgreSQL)<a></li>
<li><a href ="">Automated tests with Cypress.IO<a></li>  
</ul>
  
