This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# Instructions on running demo

## Generate a github token

Login to your github account and follow the instructions [here](https://github.com/settings/tokens/new)

## Build and start demo

Open a terminal window and type the following commands in the shell:

```sh
cd my-app
npm install
npm start
```

You should now be able to view the application in your browser [here](http://localhost:3000/) - at localhost port 3000.

To use the application, enter the github token you generated and press "Go" to view a list of your repositories.

When you click on one of your repositories you should be able to view the open issues for that repository. You should also be able to rearrange them.

## To persisting issues order on backend

- Add a column for rank to your table/collection
- In the moveCard method in IssuesList make an api request to update the ranking for each issue. Instead of just reordering the array, also keep track of rank item and sort the display based on the rank value. 
