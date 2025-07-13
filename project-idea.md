Objective: Build and deploy a simple web application where I can track if the weather every day was simply good, bad, or okay and then view the results in a visually summarized fashion. 

Detailed Project Idea:

To start out, let's build a completely public web application with no authenticaion. If it's successful, we can add authentication later.

There should be two routes in the web application:

/ (root) - This will display a simple title: "Was the weather nice today?"
Underneath that will be color coded squares, with each square representing a single day. The squares will be organized into months, somewhat looking like a calendar but without any labels other than the month name. Each square will either be: 
- gray if the day has no data or is in the future
- green if the day was categorized as "good" weather
- yellow if the day was categorized as "okay" weather
- red if the day was categorized as "bad" weather

/set_weather - This will be a public route used to set the weather. It will contain simple form with two inputs: 
One will be a date picker to select the date (default to today)
The other will be a simple dropdown with the options of "good", "bad", "okay"

Tech Stack
Frontend: I would like to use react for the frontend. Use prebuilt UI components to make the frontend look as nice as possible. The form doesn't have to look nice, but we should use a prebuilt datepicker library rather than building our own. The color coded calendar for the home page should look nice, as that's the main screen of the application.

Backend: I'm open to suggestions. To start, we have very minimum requirements, but it's possible we will add on additional API integrations over time that may require a more robust backend such as users and authentication. We will need some sort of a database solution to store the weather information, but it doesn't have to be robust.

Deployment: I would like a free or low cost solution to deploy this site to the public internet that I can access from my phone and share with other people. The deployment solution would need to be able to support the frontend, backend and database. My primary concern is low cost, I do not expect this website to ever be used for anything more than personal use. 
